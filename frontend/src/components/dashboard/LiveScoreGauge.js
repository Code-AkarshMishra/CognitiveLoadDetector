"use client";

import React from "react";
import { motion } from "framer-motion";
import { Brain, AlertTriangle, CheckCircle2, ShieldAlert, Clock, Zap, Target } from "lucide-react";

export default function LiveScoreGauge({
  score = 0,
  productivityScore = 0,
  fatigueRisk = "Inactive",
  attentionIndex = 0,
  typingStability = 0,
  mouseEfficiency = 0,
  isLive = false,
  proxiedBy = null
}) {
  const normalizedScore = isLive ? Math.min(100, Math.max(0, Math.round(score))) : 0;
  const normalizedProductivity = isLive ? Math.min(100, Math.max(0, Math.round(productivityScore || 0))) : 0;

  // Calculate SVG circumference for circular gauge (radius = 65)
  const radius = 65;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = isLive
    ? circumference - (normalizedScore / 100) * circumference
    : circumference;

  // Determine dynamic color styling
  let strokeColor = "#10b981"; // Emerald / Low
  let badgeBg = "bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300";
  let statusIcon = <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
  let statusText = "Optimal Focus";

  if (!isLive) {
    strokeColor = "#94a3b8"; // Slate / Inactive
    badgeBg = "bg-[var(--surface-muted)] border-[var(--border)] text-[var(--text-secondary)]";
    statusIcon = <Clock className="w-4 h-4 text-[var(--text-muted)]" />;
    statusText = "Session Inactive";
  } else if (normalizedScore >= 75) {
    strokeColor = "#ef4444"; // Red / High
    badgeBg = "bg-rose-500/15 border-rose-500/30 text-rose-700 dark:text-rose-300";
    statusIcon = <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
    statusText = "High Fatigue Risk";
  } else if (normalizedScore >= 50) {
    strokeColor = "#f59e0b"; // Amber / Moderate
    badgeBg = "bg-amber-500/15 border-amber-500/30 text-amber-700 dark:text-amber-300";
    statusIcon = <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
    statusText = "Moderate Strain";
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] backdrop-blur-xl p-6 shadow-xl transition-all duration-300">
      
      {/* Header with Live Status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[var(--foreground)] uppercase tracking-wider">
              Live Cognitive Metrics
            </h3>
            <p className="text-[11px] text-[var(--text-secondary)]">
              {isLive ? (proxiedBy ? `Inference via ${proxiedBy}` : "Real-time Telemetry Assessment") : "No Active Session • Zero Dummy Data"}
            </p>
          </div>
        </div>

        {isLive ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold animate-pulse">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>LIVE ML STREAM</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--surface-muted)] border border-[var(--border)] text-[var(--text-secondary)] text-xs font-medium">
            <span className="h-2 w-2 rounded-full bg-slate-400" />
            <span>AWAITING SESSION</span>
          </div>
        )}
      </div>

      {/* Dual Graphical Gauges Grid: Cognitive Load & Productivity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-3 items-center">
        
        {/* Gauge 1: Cognitive Load Index */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)]">
          <div className="relative flex items-center justify-center">
            <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 150 150">
              <circle
                cx="75"
                cy="75"
                r={radius}
                stroke="currentColor"
                strokeWidth="9"
                className="text-slate-200 dark:text-slate-800"
                fill="transparent"
              />
              <motion.circle
                cx="75"
                cy="75"
                r={radius}
                stroke={strokeColor}
                strokeWidth="10"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                strokeLinecap="round"
                fill="transparent"
                style={{
                  filter: isLive ? `drop-shadow(0 0 6px ${strokeColor})` : "none",
                }}
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center text-center">
              {isLive ? (
                <motion.div
                  key={normalizedScore}
                  initial={{ scale: 0.85, opacity: 0.7 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-baseline"
                >
                  <span className="text-3xl font-black tracking-tight text-[var(--foreground)]">
                    {normalizedScore}
                  </span>
                  <span className="text-xs font-bold text-[var(--text-secondary)] ml-0.5">/100</span>
                </motion.div>
              ) : (
                <span className="text-3xl font-black tracking-tight text-[var(--text-muted)]">--</span>
              )}
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mt-0.5">
                Cognitive Load
              </span>
            </div>
          </div>

          <div className={`mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold ${badgeBg}`}>
            {statusIcon}
            <span>{statusText}</span>
          </div>
        </div>

        {/* Gauge 2: Productivity Index */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)]">
          <div className="relative flex items-center justify-center">
            <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 150 150">
              <circle
                cx="75"
                cy="75"
                r={radius}
                stroke="currentColor"
                strokeWidth="9"
                className="text-slate-200 dark:text-slate-800"
                fill="transparent"
              />
              <motion.circle
                cx="75"
                cy="75"
                r={radius}
                stroke="#0284c7"
                strokeWidth="10"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: isLive ? circumference - (normalizedProductivity / 100) * circumference : circumference }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                strokeLinecap="round"
                fill="transparent"
                style={{
                  filter: isLive ? "drop-shadow(0 0 6px #0284c7)" : "none",
                }}
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center text-center">
              {isLive ? (
                <motion.div
                  key={normalizedProductivity}
                  initial={{ scale: 0.85, opacity: 0.7 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-baseline"
                >
                  <span className="text-3xl font-black tracking-tight text-[var(--foreground)]">
                    {normalizedProductivity}
                  </span>
                  <span className="text-xs font-bold text-[var(--text-secondary)] ml-0.5">%</span>
                </motion.div>
              ) : (
                <span className="text-3xl font-black tracking-tight text-[var(--text-muted)]">--</span>
              )}
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mt-0.5">
                Productivity
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-800 dark:text-cyan-300 text-[11px] font-bold">
            <Zap className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>{isLive ? `${normalizedProductivity}% Flow Rate` : "Standby"}</span>
          </div>
        </div>

      </div>

      {/* Sub-Metrics Breakdown Bars */}
      <div className="mt-4 grid grid-cols-3 gap-2.5 pt-4 border-t border-[var(--border)]">
        {/* Attention Index */}
        <div className="rounded-xl bg-[var(--surface-muted)] p-2.5 border border-[var(--border)] flex flex-col">
          <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] mb-1">
            <span className="font-bold">Attention</span>
            <span className="font-black text-cyan-600 dark:text-cyan-400">{isLive ? `${Math.round(attentionIndex)}%` : "--"}</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <motion.div
              className="h-full bg-cyan-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${isLive ? Math.min(100, Math.max(0, attentionIndex)) : 0}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </div>

        {/* Typing Stability */}
        <div className="rounded-xl bg-[var(--surface-muted)] p-2.5 border border-[var(--border)] flex flex-col">
          <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] mb-1">
            <span className="font-bold">Typing Flow</span>
            <span className="font-black text-indigo-600 dark:text-indigo-400">{isLive ? `${Math.round(typingStability)}%` : "--"}</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <motion.div
              className="h-full bg-indigo-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${isLive ? Math.min(100, Math.max(0, typingStability)) : 0}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </div>

        {/* Mouse Efficiency */}
        <div className="rounded-xl bg-[var(--surface-muted)] p-2.5 border border-[var(--border)] flex flex-col">
          <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] mb-1">
            <span className="font-bold">Mouse Effic.</span>
            <span className="font-black text-teal-600 dark:text-teal-400">{isLive ? `${Math.round(mouseEfficiency)}%` : "--"}</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <motion.div
              className="h-full bg-teal-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${isLive ? Math.min(100, Math.max(0, mouseEfficiency)) : 0}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </div>
      </div>

    </div>
  );
}
