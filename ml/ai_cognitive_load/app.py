import os
import sys
import base64
import numpy as np
import cv2
from flask import Flask, request, jsonify

try:
    from flask_cors import CORS
    has_cors = True
except ImportError:
    has_cors = False

# Add parent directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
try:
    from predict_score import calculate_cognitive_load
except ImportError:
    def calculate_cognitive_load(
        typing_wpm=0.0, total_clicks=0, tab_switches=0, idle_seconds=0.0,
        backspace_count=0, total_keystrokes=0, role="developer", task="coding",
        facial_fatigue_score=None, face_detected=None, eyes_detected_count=None, lighting_quality=None
    ):
        return {
            "status": "success",
            "cognitiveLoadScore": 0.0,
            "fatigueRisk": "Low",
            "attentionIndex": 0.0,
            "typingStability": 0.0,
            "mouseEfficiency": 0.0,
            "productivityScore": 0.0,
            "insights": ["Fallback model active."],
            "recommendations": ["Awaiting live interaction."]
        }

app = Flask(__name__)
if has_cors:
    CORS(app)

# Initialize OpenCV Cascades
face_cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
eye_cascade_path = cv2.data.haarcascades + 'haarcascade_eye.xml'

face_cascade = cv2.CascadeClassifier(face_cascade_path) if os.path.exists(face_cascade_path) else None
eye_cascade = cv2.CascadeClassifier(eye_cascade_path) if os.path.exists(eye_cascade_path) else None

def decode_image(b64_string):
    if not b64_string:
        return None
    if "," in b64_string:
        b64_string = b64_string.split(",", 1)[1]
    img_bytes = base64.b64decode(b64_string)
    np_arr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    return img

def analyze_facial_fatigue(img):
    """
    OpenCV-based Vision Analysis during 30s camera scan:
    - Detect face presence & position
    - Detect open eyes within face ROI
    - Analyze luminance & contrast
    - Estimate facial fatigue index (0-100 scale)
    """
    if img is None:
        return None, None, None, None

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    mean_val = float(np.mean(gray))
    std_val = float(np.std(gray))

    lighting_quality = "good"
    if mean_val < 45:
        lighting_quality = "poor"
    elif mean_val > 220:
        lighting_quality = "poor"

    face_detected = False
    eyes_detected_count = 0
    fatigue_index = 30.0  # Normal baseline

    if face_cascade is not None and not face_cascade.empty():
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=4, minSize=(60, 60))
        if len(faces) > 0:
            face_detected = True
            (x, y, w, h) = faces[0]
            roi_gray = gray[y:y + int(h * 0.65), x:x + w]  # Upper half for eyes

            if eye_cascade is not None and not eye_cascade.empty():
                eyes = eye_cascade.detectMultiScale(roi_gray, scaleFactor=1.15, minNeighbors=3, minSize=(15, 15))
                eyes_detected_count = len(eyes)

                if eyes_detected_count >= 2:
                    # Both eyes clearly open
                    fatigue_index = max(15.0, 30.0 - min(10.0, std_val * 0.1))
                elif eyes_detected_count == 1:
                    # Partial eye openness or head turn
                    fatigue_index = 45.0
                else:
                    # Eyes closed or squinting
                    fatigue_index = 68.0

            # Factor in poor lighting strain
            if lighting_quality == "poor":
                fatigue_index += 12.0
        else:
            # Face not centered or head away
            face_detected = False
            fatigue_index = 50.0

    return min(95.0, fatigue_index), face_detected, eyes_detected_count, lighting_quality

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "service": "ML Cognitive Load & Multimodal OpenCV Telemetry Engine",
        "openCvLoaded": face_cascade is not None,
        "version": "3.2"
    })

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(silent=True) or {}
    
    typing_wpm = float(data.get('typingWpm', data.get('typing_wpm', 0.0)) or 0.0)
    total_clicks = int(data.get('totalClicks', data.get('total_clicks', 0)) or 0)
    tab_switches = int(data.get('tabSwitches', data.get('tab_switches', 0)) or 0)
    idle_seconds = float(data.get('idleSeconds', data.get('idle_seconds', 0.0)) or 0.0)
    backspace_count = int(data.get('backspaceCount', data.get('backspace_count', 0)) or 0)
    total_keystrokes = int(data.get('totalKeystrokes', data.get('total_keystrokes', 0)) or 0)
    role = str(data.get('role', 'developer'))
    task = str(data.get('task', 'coding'))

    # Process 30s facial video frame if present
    facial_fatigue_score = None
    face_detected = None
    eyes_detected_count = None
    lighting_quality = None

    if 'image' in data and data['image']:
        try:
            img = decode_image(data['image'])
            if img is not None:
                facial_fatigue_score, face_detected, eyes_detected_count, lighting_quality = analyze_facial_fatigue(img)
        except Exception as e:
            print(f"OpenCV webcam processing error: {e}", file=sys.stderr)

    # Calculate real task-calibrated telemetry & productivity + vision fatigue
    result = calculate_cognitive_load(
        typing_wpm=typing_wpm,
        total_clicks=total_clicks,
        tab_switches=tab_switches,
        idle_seconds=idle_seconds,
        backspace_count=backspace_count,
        total_keystrokes=total_keystrokes,
        role=role,
        task=task,
        facial_fatigue_score=facial_fatigue_score,
        face_detected=face_detected,
        eyes_detected_count=eyes_detected_count,
        lighting_quality=lighting_quality
    )

    if face_detected is not None:
        result["visionScanDetails"] = {
            "faceDetected": face_detected,
            "eyesCount": eyes_detected_count,
            "lightingQuality": lighting_quality,
            "facialFatigueScore": facial_fatigue_score
        }

    return jsonify(result)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5001))
    print(f"Starting ML Flask Service with OpenCV Vision Engine on port {port}...")
    app.run(host='0.0.0.0', port=port)
