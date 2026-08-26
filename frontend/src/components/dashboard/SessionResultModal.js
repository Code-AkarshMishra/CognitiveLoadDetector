"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Brain, 
  Activity, 
  Eye, 
  Clock, 
  Download, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Sparkles, 
  Coffee, 
  Heart,
  FileText
} from "lucide-react";

export default function SessionResultModal({
  isOpen,
  onClose,
  summary,
  onDownloadReport,
  onDownloadCSV
}) {
  if (!isOpen || !summary) return null;

  const score = summary.cognitiveLoadScore || 0;
  const productivity = summary.productivityScore !== undefined ? summary.productivityScore : Math.max(0, 100 - score);
  const fatigueRisk = summary.fatigueRisk || (score > 75 ? "High" : score > 50 ? "Moderate" : "Low");
  const duration = summary.durationFormatted || `${summary.durationSeconds || 0}s`;

  // Calculate Performance Grade based on load & stability
  let grade = "A+";
  let gradeBadge = "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40";
  let gradeText = "Exceptional Focus & Cadence";

  if (score >= 75 || summary.tabSwitchCount >= 7) {
    grade = "C";
    gradeBadge = "bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/40";
    gradeText = "Elevated Fatigue / High Distraction";
  } else if (score >= 50 || summary.backspaceCount > 10) {
    grade = "B";
    gradeBadge = "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40";
    gradeText = "Moderate Strain - Work Pacing Recommended";
  }

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        className="w-full max-w-2xl rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-2xl space-y-6 my-8 text-[var(--foreground)]"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/25">
              <Trophy size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-[var(--foreground)]">
                  Session Performance & Fatigue Assessment
                </h2>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                Duration: <span className="font-bold text-[var(--foreground)]">{duration}</span> • Mode: <span className="font-bold text-cyan-600 dark:text-cyan-400 uppercase">{summary.role} ({summary.task})</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)] transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Top Hero Performance Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-indigo-500/5 to-purple-500/10 border border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">
              Overall Focus Rating
            </span>
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <span className="text-4xl font-black text-[var(--foreground)]">{grade}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${gradeBadge}`}>
                {gradeText}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-center">
            <div className="px-3 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
              <p className="text-[10px] text-[var(--text-secondary)] uppercase font-bold">Productivity</p>
              <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{productivity}%</p>
            </div>
            <div className="px-3 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
              <p className="text-[10px] text-[var(--text-secondary)] uppercase font-bold">Cognitive Load</p>
              <p className="text-xl font-black text-cyan-600 dark:text-cyan-400">{score} / 100</p>
            </div>
            <div className="px-3 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
              <p className="text-[10px] text-[var(--text-secondary)] uppercase font-bold">Fatigue Risk</p>
              <p className={`text-xl font-black ${fatigueRisk === "High" ? "text-rose-500" : fatigueRisk === "Moderate" ? "text-amber-500" : "text-emerald-500"}`}>
                {fatigueRisk}
              </p>
            </div>
          </div>
        </div>

        {/* 4 Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3.5 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)] space-y-1">
            <p className="text-[10px] text-[var(--text-secondary)] uppercase font-bold">Typing Pace</p>
            <p className="text-lg font-black text-[var(--foreground)]">{summary.wordsPerMinute || 0} WPM</p>
            <p className="text-[10px] text-[var(--text-secondary)]">{summary.totalKeystrokes || 0} keys pressed</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)] space-y-1">
            <p className="text-[10px] text-[var(--text-secondary)] uppercase font-bold">Correction Stress</p>
            <p className="text-lg font-black text-rose-600 dark:text-rose-400">{summary.backspaceCount || 0}</p>
            <p className="text-[10px] text-[var(--text-secondary)]">Backspaces hit</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)] space-y-1">
            <p className="text-[10px] text-[var(--text-secondary)] uppercase font-bold">Attention Index</p>
            <p className="text-lg font-black text-indigo-600 dark:text-indigo-400">{summary.attentionIndex || 0}%</p>
            <p className="text-[10px] text-[var(--text-secondary)]">{summary.tabSwitchCount || 0} tab switches</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)] space-y-1">
            <p className="text-[10px] text-[var(--text-secondary)] uppercase font-bold">Mouse Inactivity</p>
            <p className="text-lg font-black text-teal-600 dark:text-teal-400">{summary.mouseIdleTime || 0}s</p>
            <p className="text-[10px] text-[var(--text-secondary)]">{summary.mouseClicks || 0} clicks</p>
          </div>
        </div>

        {/* AI Behavioral Insights & Wellness Recommendations */}
        <div className="p-4 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)] space-y-2.5">
          <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
            <Sparkles size={16} />
            <h4 className="text-xs font-black uppercase tracking-wider">AI Recovery Plan & Guidance</h4>
          </div>

          <div className="space-y-1.5 text-xs text-[var(--foreground)]">
            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
              <Coffee size={15} className="text-amber-500 mt-0.5 flex-shrink-0" />
              <span>
                {fatigueRisk === "High"
                  ? "High cognitive fatigue detected. Take a mandatory 5-minute break away from all screens (20-20-20 rule: look 20 feet away for 20 seconds)."
                  : fatigueRisk === "Moderate"
                  ? "Moderate task workload recorded. Hydrate, stretch your wrists, and pace your next focus block."
                  : "Excellent sustained focus! Your cadence and context retention were optimal."}
              </span>
            </div>
            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
              <Heart size={15} className="text-emerald-500 mt-0.5 flex-shrink-0" />
              <span>
                {summary.tabSwitchCount > 3
                  ? "Frequent context switching observed across browser tabs. Consider full-screen mode to sustain deeper concentration."
                  : "Minimal distractions recorded throughout this session window."}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[var(--border)]">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onDownloadReport}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition cursor-pointer shadow-md"
            >
              <Download size={14} />
              <span>Download PDF Audit</span>
            </button>
            <button
              onClick={onDownloadCSV}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[var(--surface-muted)] hover:bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--foreground)] text-xs font-bold transition cursor-pointer"
            >
              <FileText size={14} />
              <span>Export CSV</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-[var(--surface-muted)] hover:bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--foreground)] text-xs font-bold border border-[var(--border)] transition cursor-pointer"
          >
            Close Summary
          </button>
        </div>

      </motion.div>
    </div>
  );
}
