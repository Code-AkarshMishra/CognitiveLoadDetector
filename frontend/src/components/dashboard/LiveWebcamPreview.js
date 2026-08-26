"use client";

import { useRef, useEffect } from "react";
import { Camera, VideoOff, Eye, Sparkles, AlertCircle, Clock, ShieldCheck } from "lucide-react";

export default function LiveWebcamPreview({ 
  webcamTracker, 
  sessionActive,
  productivityScore = 100,
  tabSwitches = 0
}) {
  const videoRef = useRef(null);
  const stream = webcamTracker?.stream;
  const isCameraActive = !!stream && webcamTracker?.metrics?.cameraActive;
  const secondsRemaining = webcamTracker?.metrics?.secondsRemaining || 0;
  const triggerReason = webcamTracker?.metrics?.activeTriggerReason || "session-start";

  // Bind live media stream to the video DOM element directly
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((e) => {
        console.warn("Video playback auto-start:", e);
      });
    } else if (videoRef.current && !stream) {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  // High-frequency frame sampling loop for Python OpenCV ML (every 1.5s while 15s scan is active)
  useEffect(() => {
    if (!sessionActive || !isCameraActive || !webcamTracker?.captureFrameForMl) return;

    const interval = setInterval(() => {
      if (videoRef.current) {
        webcamTracker.captureFrameForMl(videoRef.current);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [sessionActive, isCameraActive, webcamTracker]);

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xl transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
            <Eye size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-[var(--foreground)] uppercase tracking-wider">
                OpenCV Facial Fatigue HUD
              </h3>
              {isCameraActive && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-bold animate-pulse">
                  <Clock size={11} /> {secondsRemaining}s left
                </span>
              )}
            </div>
            <p className="text-[11px] text-[var(--text-secondary)]">
              {isCameraActive 
                ? `15s Vision Scan Active (${triggerReason.replace(/-/g, " ")})`
                : sessionActive 
                ? "Camera Off (Auto-activates for 15s on start / 10m periodic check)"
                : "Camera Sensor Off"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {sessionActive && (
            <button
              onClick={() => {
                if (isCameraActive) {
                  webcamTracker?.stopCamera();
                } else {
                  webcamTracker?.start15sScan("manual-user-trigger");
                }
              }}
              className={`px-3 py-1 rounded-xl border text-[11px] font-bold transition cursor-pointer flex items-center gap-1.5 ${
                isCameraActive
                  ? "bg-rose-500/15 border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/25"
                  : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md border-cyan-400"
              }`}
            >
              <Camera size={13} />
              <span>{isCameraActive ? `Stop Scan (${secondsRemaining}s)` : "Trigger 15s Vision Scan"}</span>
            </button>
          )}

          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
            isCameraActive
              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 animate-pulse"
              : sessionActive
              ? "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30"
              : "bg-[var(--surface-muted)] text-[var(--text-muted)] border-[var(--border)]"
          }`}>
            <span className={`h-2 w-2 rounded-full ${isCameraActive ? "bg-emerald-500 animate-ping" : "bg-[var(--text-muted)]"}`} />
            {isCameraActive ? `SCANNING (${secondsRemaining}s)` : sessionActive ? "STANDBY (AUTO-OFF)" : "OFF"}
          </span>
        </div>
      </div>

      {/* Video Preview Container */}
      <div className="relative mt-4 overflow-hidden rounded-2xl border border-[var(--border)] bg-slate-950 shadow-inner h-[230px] sm:h-[270px]">
        {/* The Live Video Element */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          aria-label="Live webcam feed"
          className={`w-full h-full object-cover transform scale-x-[-1] transition-opacity duration-300 ${
            isCameraActive ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        />

        {/* Live HUD Overlay on Video */}
        {isCameraActive && (
          <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 border border-cyan-500/50 text-cyan-300 text-[10px] font-mono backdrop-blur-md">
                <Sparkles size={11} className="animate-spin text-cyan-400" />
                <span>OPENCV ML INFERENCE • 15S BURST</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 border border-emerald-500/50 text-emerald-300 text-[10px] font-mono backdrop-blur-md">
                <Clock size={11} className="text-emerald-400" />
                <span>AUTO-OFF IN: {secondsRemaining}s</span>
              </div>
            </div>

            {/* Centered Facial Scanning Crosshair */}
            <div className="relative w-full h-24 flex items-center justify-center">
              <div className="w-40 h-40 border-2 border-dashed border-cyan-400/70 rounded-3xl animate-pulse flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <div className="h-2.5 w-2.5 bg-cyan-400 rounded-full animate-ping" />
              </div>
            </div>

            {/* Bottom Telemetry HUD */}
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-300 bg-slate-950/85 px-3 py-1.5 rounded-xl border border-slate-800 backdrop-blur-md">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                OPENCV FACE & EYE DETECT: ACTIVE
              </span>
              <span>AUTO-TURNS OFF AT 0s</span>
            </div>
          </div>
        )}

        {/* Standby / Off Overlay */}
        {!isCameraActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-slate-950/90 to-slate-950 p-6 text-center text-white">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-md">
              <VideoOff size={24} />
            </div>
            <div>
              <p className="text-sm font-black text-slate-100">
                Camera is Automatically OFF
              </p>
              <p className="max-w-xs mx-auto mt-1 text-xs text-slate-400 leading-relaxed">
                {sessionActive 
                  ? "Camera only turns on for 15 seconds to check cognitive load with OpenCV ML and then shuts off completely."
                  : "Start a live session to activate telemetry tracking."}
              </p>
            </div>
            {sessionActive && (
              <button
                onClick={() => webcamTracker?.start15sScan("manual-click")}
                className="mt-1 px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-md transition cursor-pointer"
              >
                Run 15s Vision Scan
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
