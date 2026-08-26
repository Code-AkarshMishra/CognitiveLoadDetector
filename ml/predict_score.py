import sys
import json
import math

def calculate_cognitive_load(
    typing_wpm=0.0,
    total_clicks=0,
    tab_switches=0,
    idle_seconds=0.0,
    backspace_count=0,
    total_keystrokes=0,
    role="developer",
    task="coding",
    facial_fatigue_score=None,
    face_detected=None,
    eyes_detected_count=None,
    lighting_quality=None
):
    """
    Task-Specific Multimodal Cognitive Load & Productivity ML Assessment Model.
    Supports behavioral telemetry (keyboard/mouse/switches) + OpenCV facial vision metrics.
    """
    typing_wpm = float(typing_wpm or 0.0)
    total_clicks = int(total_clicks or 0)
    tab_switches = int(tab_switches or 0)
    idle_seconds = float(idle_seconds or 0.0)
    backspace_count = int(backspace_count or 0)
    total_keystrokes = int(total_keystrokes or 0)
    role = str(role or "developer").lower()
    task = str(task or "coding").lower()

    # 1. Activity Check
    has_activity = (total_keystrokes > 0 or typing_wpm > 0 or total_clicks > 0 or idle_seconds > 0 or (face_detected is not None))
    has_meaningful_work = (total_keystrokes >= 3 or typing_wpm >= 2.0 or total_clicks >= 2 or idle_seconds > 5.0 or (face_detected is True))

    if not has_activity or not has_meaningful_work:
        return {
            "status": "success",
            "cognitiveLoadScore": 0.0,
            "fatigueRisk": "Low",
            "attentionIndex": 0.0,
            "typingStability": 0.0,
            "mouseEfficiency": 0.0,
            "productivityScore": 0.0,
            "insights": [
                f"Session initialized for {role.upper()} ({task.upper()}).",
                "Awaiting user interaction and 30s vision scan signals."
            ],
            "recommendations": [
                "Begin your task to start live telemetry evaluation."
            ],
            "modelInfo": f"NeuroTrack Task-Calibrated ML Engine ({task})"
        }

    # 2. Task-Specific Productivity & Attention Calculation
    correction_ratio = backspace_count / max(1.0, float(total_keystrokes))
    insights = [f"Assessing {role.upper()} in {task.upper()} mode."]
    recommendations = []

    if task in ("reading", "lecture"):
        # Reading & Lecture: Typing is minimal; steady attention & low tab switching
        idle_penalty = max(0.0, (idle_seconds - 180.0) * 0.15) if idle_seconds > 180 else 0.0
        switch_penalty = tab_switches * 8.0
        productivity = max(10.0, min(100.0, 95.0 - switch_penalty - idle_penalty))
        typing_stability = 0.0 if total_keystrokes == 0 else round(min(100.0, max(0.0, 100.0 - correction_ratio * 150.0)), 1)
        mouse_efficiency = round(max(10.0, min(100.0, 80.0 - (idle_seconds * 0.2) + min(20.0, total_clicks * 3.0))), 1)
        attention_index = round(max(5.0, min(100.0, 95.0 - switch_penalty - idle_penalty)), 1)

    elif task == "designing":
        # Designing / UI-UX: High mouse interactions and clicks, minimal typing
        mouse_productivity = min(70.0, total_clicks * 4.0)
        idle_penalty = min(40.0, idle_seconds * 0.5)
        switch_penalty = tab_switches * 7.0
        productivity = max(5.0, min(100.0, 30.0 + mouse_productivity - idle_penalty - switch_penalty))
        typing_stability = 0.0 if total_keystrokes == 0 else round(min(100.0, (typing_wpm / 20.0) * 100.0), 1)
        mouse_efficiency = round(max(10.0, min(100.0, min(100.0, total_clicks * 6.0) - (idle_seconds * 0.4))), 1)
        attention_index = round(max(5.0, min(100.0, 90.0 - switch_penalty - (idle_seconds * 0.3))), 1)

    elif task == "meeting":
        # Meeting / Sync: Passive engagement, listening
        switch_penalty = tab_switches * 12.0
        productivity = max(15.0, min(100.0, 90.0 - switch_penalty))
        typing_stability = 0.0
        mouse_efficiency = 50.0 if total_clicks > 0 else 0.0
        attention_index = round(max(10.0, min(100.0, 90.0 - switch_penalty)), 1)

    elif task in ("writing", "reporting"):
        # Writing / Docs / Reporting: Sustained typing pace & low corrections
        target_wpm = 25.0 if role == "student" else 35.0
        wpm_factor = min(1.0, typing_wpm / target_wpm)
        accuracy_factor = max(0.0, 1.0 - (correction_ratio * 2.0))
        typing_stability = round(max(0.0, min(100.0, wpm_factor * accuracy_factor * 100.0)), 1)
        switch_penalty = tab_switches * 9.0
        productivity = round(max(5.0, min(100.0, (wpm_factor * 60.0) + (accuracy_factor * 35.0) - switch_penalty)), 1)
        mouse_efficiency = round(max(5.0, min(100.0, 50.0 + min(30.0, total_clicks * 3.0) - (idle_seconds * 0.5))), 1)
        attention_index = round(max(5.0, min(100.0, 95.0 - switch_penalty - (idle_seconds * 0.3))), 1)

    else:
        # Default: Coding / Dev Mode
        target_wpm = 30.0 if role == "student" else 45.0
        wpm_factor = min(1.0, typing_wpm / target_wpm) if typing_wpm > 0 else 0.0
        accuracy_factor = max(0.0, 1.0 - (correction_ratio * 2.2))
        typing_stability = round(max(0.0, min(100.0, wpm_factor * accuracy_factor * 100.0)), 1) if total_keystrokes >= 3 else 0.0
        mouse_factor = min(25.0, total_clicks * 2.5)
        switch_penalty = tab_switches * 8.0
        idle_penalty = min(35.0, (idle_seconds / 60.0) * 20.0)
        productivity = round(max(5.0, min(100.0, (wpm_factor * 55.0) + (accuracy_factor * 30.0) + mouse_factor - switch_penalty - idle_penalty)), 1)
        mouse_efficiency = round(max(0.0, min(100.0, min(80.0, total_clicks * 5.0) + 20.0 - (idle_seconds * 0.8))), 1) if total_clicks > 0 else 0.0
        attention_index = round(max(0.0, min(100.0, 95.0 - switch_penalty - idle_penalty)), 1)

    # 3. Incorporate OpenCV Facial Vision Metrics (if 30s scan is active)
    vision_strain_addition = 0.0
    if facial_fatigue_score is not None:
        fatigue_val = float(facial_fatigue_score)
        vision_strain_addition = (fatigue_val - 30.0) * 0.25
        if face_detected:
            insights.append(f"OpenCV Vision HUD: Face detected (Fatigue Index: {round(fatigue_val, 1)}/100).")
        if eyes_detected_count is not None and eyes_detected_count == 0:
            insights.append("Vision Alert: Eye closure or gaze diverted from screen.")
            vision_strain_addition += 8.0
            attention_index = max(10.0, attention_index - 12.0)
        if lighting_quality == "poor":
            insights.append("Low ambient lighting may cause visual fatigue.")
            vision_strain_addition += 4.0

    # 4. Real Cognitive Load & Fatigue Calculation (0-100 scale)
    base_load = (100.0 - productivity) * 0.65
    stress_load = (correction_ratio * 38.0) + (tab_switches * 7.0) + min(20.0, idle_seconds * 0.15)
    cognitive_load_score = round(max(5.0, min(98.0, base_load + stress_load + vision_strain_addition)), 1)

    # 5. Fatigue Risk Classification
    if cognitive_load_score >= 75.0 or productivity <= 40.0 or tab_switches >= 7:
        fatigue_risk = "High"
    elif cognitive_load_score >= 48.0 or productivity <= 65.0:
        fatigue_risk = "Moderate"
    else:
        fatigue_risk = "Low"

    # Contextual Insights & Recommendations
    insights.append(f"Calculated Productivity: {round(productivity, 1)}% | Cognitive Load: {cognitive_load_score}/100.")
    if tab_switches > 0:
        insights.append(f"Context blur: {tab_switches} tab switches recorded.")
    if correction_ratio > 0.15:
        insights.append(f"Correction stress: {backspace_count} backspaces hit.")

    if fatigue_risk == "High":
        recommendations.append("High cognitive strain / productivity drop detected. Take a 5-minute break (20-20-20 rule).")
    elif fatigue_risk == "Moderate":
        recommendations.append("Moderate task fatigue. Maintain steady pacing.")
    else:
        recommendations.append("Optimal workflow state. Continue current task.")

    return {
        "status": "success",
        "cognitiveLoadScore": cognitive_load_score,
        "fatigueRisk": fatigue_risk,
        "attentionIndex": round(attention_index, 1),
        "typingStability": typing_stability,
        "mouseEfficiency": mouse_efficiency,
        "productivityScore": round(productivity, 1),
        "facialFatigueScore": round(facial_fatigue_score, 1) if facial_fatigue_score is not None else None,
        "insights": insights,
        "recommendations": recommendations,
        "modelInfo": f"NeuroTrack Real Multimodal ML Engine v3.2 ({task})"
    }

if __name__ == "__main__":
    try:
        wpm = float(sys.argv[1]) if len(sys.argv) > 1 else 0.0
        clicks = int(sys.argv[2]) if len(sys.argv) > 2 else 0
        tab_switches = int(sys.argv[3]) if len(sys.argv) > 3 else 0
        idle_sec = float(sys.argv[4]) if len(sys.argv) > 4 else 0.0
        backspaces = int(sys.argv[5]) if len(sys.argv) > 5 else 0
        keystrokes = int(sys.argv[6]) if len(sys.argv) > 6 else 0
        role = str(sys.argv[7]) if len(sys.argv) > 7 else "developer"
        task = str(sys.argv[8]) if len(sys.argv) > 8 else "coding"

        res = calculate_cognitive_load(wpm, clicks, tab_switches, idle_sec, backspaces, keystrokes, role, task)
        print(json.dumps(res))
    except Exception as e:
        print(json.dumps({
            "status": "success",
            "cognitiveLoadScore": 0.0,
            "fatigueRisk": "Low",
            "attentionIndex": 0.0,
            "typingStability": 0.0,
            "mouseEfficiency": 0.0,
            "productivityScore": 0.0,
            "insights": ["Telemetry initial state."],
            "recommendations": ["Awaiting interaction."]
        }))
