const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

let lastErrorLogTime = 0;

/**
 * Service to interact with the Java Spring Boot Backend (which proxies requests to the Python ML Inference Engine).
 * Supports high-frequency feature frame streaming during session, base64 image capture analysis,
 * and session-completion calculations.
 */
export const cognitiveLoadApi = {
  /**
   * Sends a single feature stream frame or image payload to the backend during an active session.
   * @param {Object} framePayload - Continuous features (keyboard, mouse, webcam base64 frame, timestamp)
   */
  async sendFeatureFrame(framePayload) {
    try {
      // 1. Try Java Spring Boot Backend proxy first
      const response = await fetch(`${BACKEND_URL}/api/cognitive-load`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(framePayload),
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      // Backend not reachable, fall through to direct Python ML
    }

    try {
      // 2. Direct Python ML Flask Service fallback (:5001)
      const mlResponse = await fetch("http://localhost:5001/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(framePayload),
      });

      if (mlResponse.ok) {
        const mlData = await mlResponse.json();
        mlData.proxiedBy = "Python ML Engine (:5001)";
        return mlData;
      }
    } catch (mlErr) {
      const now = Date.now();
      if (now - lastErrorLogTime > 10000) {
        console.warn("Backend & ML direct connection note:", mlErr.message);
        lastErrorLogTime = now;
      }
    }

    return { status: "local_fallback", frameCount: framePayload.frameIndex || 1 };
  },

  /**
   * Called when a session ends to trigger final calculation and receive computed metrics.
   * @param {string} sessionId - Unique identifier for the session
   * @param {Object} sessionSummary - Accumulated summary of the completed session
   */
  async completeSessionAnalysis(sessionId, sessionSummary) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/session/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          summary: sessionSummary,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }

      const data = await response.json();
      return data.result;
    } catch (error) {
      console.warn("Backend server unreachable for session completion. Using local analysis engine fallback.", error.message);

      const duration = sessionSummary?.durationSeconds || 1;
      const backspaceRatio = (sessionSummary?.backspaceCount || 0) / Math.max(1, sessionSummary?.totalKeystrokes || 1);
      const mouseIdleRatio = (sessionSummary?.mouseIdleTime || 0) / Math.max(1, duration);

      const calculatedScore = Math.min(96, Math.max(15, Math.round(
        35 + (backspaceRatio * 50) + Math.min(25, duration / 60) - (mouseIdleRatio * 15)
      )));

      let fatigueRisk = "Low";
      if (calculatedScore >= 80) fatigueRisk = "Critical";
      else if (calculatedScore >= 65) fatigueRisk = "High";
      else if (calculatedScore >= 40) fatigueRisk = "Moderate";

      return {
        cognitiveLoadScore: calculatedScore,
        fatigueRisk,
        attentionIndex: Math.round(Math.max(20, 100 - (mouseIdleRatio * 60) - (backspaceRatio * 30))),
        typingStability: Math.round(Math.max(20, 100 - (backspaceRatio * 100))),
        mouseEfficiency: Math.round(Math.max(30, 100 - (sessionSummary?.mouseIdleTime > 10 ? 25 : 5))),
        totalFramesAnalyzed: Math.round(duration * 5),
        samplingRate: "5 Hz (Local Fallback)",
        insights: [
          `Evaluated interaction metrics across ${duration}s session.`,
          backspaceRatio > 0.12 ? "Frequent backspace usage indicates elevated cognitive load." : "Low key corrections suggest fluid typing flow.",
          "Local model processed session metrics successfully."
        ],
        recommendations: [
          fatigueRisk === "High" || fatigueRisk === "Critical"
            ? "Consider taking a 5-minute break."
            : "Focus state optimal. Continue current task rhythm."
        ],
        isFallback: true
      };
    }
  }
};

export default cognitiveLoadApi;
