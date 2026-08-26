"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export default function useWebcamTracker(isTracking, { productivity = 100, tabSwitches = 0 } = {}) {
  const [stream, setStream] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [snapshotCount, setSnapshotCount] = useState(0);
  const [lastFrameData, setLastFrameData] = useState(null);
  const [activeTriggerReason, setActiveTriggerReason] = useState("session-start");
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const periodicTimerRef = useRef(null);
  const countdownTimerRef = useRef(null);
  const isTrackingRef = useRef(isTracking);
  isTrackingRef.current = isTracking;

  // Complete cleanup function to release all webcam hardware resources
  const stopCamera = useCallback(() => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      } catch (e) {
        console.warn("Track cleanup error:", e);
      }
      streamRef.current = null;
    }
    setStream(null);
    setCameraActive(false);
    setSecondsRemaining(0);
  }, []);

  // Start 15-second live webcam scan burst with strict auto-stop
  const start15sScan = useCallback(async (reason = "manual-scan") => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) return null;

    try {
      // Clear any existing countdown
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }

      // Stop any existing tracks before opening a fresh 15s stream
      if (streamRef.current) {
        try {
          streamRef.current.getTracks().forEach((t) => t.stop());
        } catch {}
        streamRef.current = null;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user"
        },
        audio: false,
      });

      streamRef.current = mediaStream;
      setStream(mediaStream);
      setCameraActive(true);
      setPermissionGranted(true);
      setActiveTriggerReason(reason);
      setSecondsRemaining(15);

      // Start 15s countdown to auto-stop camera completely
      let remaining = 15;
      countdownTimerRef.current = setInterval(() => {
        remaining -= 1;
        if (remaining <= 0) {
          if (countdownTimerRef.current) {
            clearInterval(countdownTimerRef.current);
            countdownTimerRef.current = null;
          }
          // Turn off camera hardware immediately
          if (streamRef.current) {
            try {
              streamRef.current.getTracks().forEach((t) => t.stop());
            } catch {}
            streamRef.current = null;
          }
          setStream(null);
          setCameraActive(false);
          setSecondsRemaining(0);
        } else {
          setSecondsRemaining(remaining);
        }
      }, 1000);

      return mediaStream;
    } catch (err) {
      console.warn("Webcam access error / denied:", err.message);
      stopCamera();
      return null;
    }
  }, [stopCamera]);

  // Backward compatibility alias
  const startCamera = start15sScan;
  const start30sScan = start15sScan;

  // Helper to extract base64 frame for OpenCV ML
  const captureFrameForMl = useCallback((videoElement) => {
    if (!videoElement || !streamRef.current) return null;

    try {
      if (videoElement.readyState < 2 || videoElement.videoWidth === 0) return null;

      let canvas = canvasRef.current;
      if (!canvas) {
        canvas = document.createElement("canvas");
        canvasRef.current = canvas;
      }

      canvas.width = 320;
      canvas.height = 240;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoElement, 0, 0, 320, 240);

      const base64Jpeg = canvas.toDataURL("image/jpeg", 0.65);

      setSnapshotCount((c) => c + 1);
      setLastFrameData(base64Jpeg);
      return base64Jpeg;
    } catch (e) {
      return null;
    }
  }, []);

  // 1. TRIGGER: Only when session starts -> 15s scan once
  useEffect(() => {
    if (isTracking) {
      start15sScan("session-start");
    } else {
      stopCamera();
      if (periodicTimerRef.current) {
        clearInterval(periodicTimerRef.current);
        periodicTimerRef.current = null;
      }
    }

    return () => {
      stopCamera();
      if (periodicTimerRef.current) {
        clearInterval(periodicTimerRef.current);
        periodicTimerRef.current = null;
      }
    };
  }, [isTracking, start15sScan, stopCamera]);

  // 2. TRIGGER: Periodic 10-Minute Check -> 15s scan
  useEffect(() => {
    if (!isTracking) return;

    periodicTimerRef.current = setInterval(() => {
      if (isTrackingRef.current) {
        start15sScan("10m-periodic-check");
      }
    }, 10 * 60 * 1000);

    return () => {
      if (periodicTimerRef.current) {
        clearInterval(periodicTimerRef.current);
        periodicTimerRef.current = null;
      }
    };
  }, [isTracking, start15sScan]);

  return {
    stream,
    metrics: {
      permissionGranted,
      cameraActive,
      secondsRemaining,
      snapshotCount,
      lastFrameData,
      activeTriggerReason,
    },
    startCamera: start15sScan,
    start15sScan,
    start30sScan: start15sScan,
    stopCamera,
    captureFrameForMl,
  };
}
