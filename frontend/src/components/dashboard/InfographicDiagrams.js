"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Cpu, 
  Activity, 
  Lock, 
  Eye, 
  MousePointer, 
  Keyboard, 
  ArrowRight, 
  CheckCircle2, 
  Database,
  BarChart3,
  Sparkles,
  Zap,
  Server
} from "lucide-react";

export default function InfographicDiagrams() {
  const [activeTab, setActiveTab] = useState("architecture");

  return (
    <div className="surface-card p-6 sm:p-8 space-y-6 overflow-hidden relative">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30">
            <Sparkles size={24} className="animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[var(--foreground)] flex items-center gap-2">
              System Architecture & Infographics
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Interactive visualization of 5 Hz AI Telemetry, E2E Privacy, & ML Fatigue Pipeline
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 bg-[var(--surface-muted)] p-1.5 rounded-xl border border-[var(--border)] self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("architecture")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "architecture"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20"
                : "text-[var(--text-secondary)] hover:text-[var(--foreground)]"
            }`}
          >
            <Cpu size={14} />
            <span>AI ML Pipeline</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("privacy")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "privacy"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20"
                : "text-[var(--text-secondary)] hover:text-[var(--foreground)]"
            }`}
          >
            <Lock size={14} />
            <span>E2E Privacy</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("matrix")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "matrix"
                ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/20"
                : "text-[var(--text-secondary)] hover:text-[var(--foreground)]"
            }`}
          >
            <BarChart3 size={14} />
            <span>Fatigue Matrix</span>
          </button>
        </div>
      </div>

      {/* Tab Content Panels */}
      <AnimatePresence mode="wait">
        {activeTab === "architecture" && (
          <motion.div
            key="architecture"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              {/* Step 1 */}
              <div className="surface-card border border-blue-500/30 p-4 rounded-2xl relative group hover:border-blue-500/60 transition-all bg-slate-900/40">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    Step 1 (5 Hz)
                  </span>
                  <Activity size={18} className="text-blue-400" />
                </div>
                <h3 className="font-bold text-sm text-[var(--foreground)] mb-1">Behavioral Stream</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
                  Captures keystrokes, WPM velocity, backspace corrections, mouse vectors & focus state every 200 ms.
                </p>
                <div className="flex items-center gap-2 text-[10px] font-mono text-blue-300 bg-blue-950/50 p-2 rounded-lg border border-blue-800/40">
                  <Keyboard size={12} /> <MousePointer size={12} /> Continuous Sampling
                </div>
              </div>

              {/* Step 2 */}
              <div className="surface-card border border-cyan-500/30 p-4 rounded-2xl relative group hover:border-cyan-500/60 transition-all bg-slate-900/40">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    Step 2
                  </span>
                  <Server size={18} className="text-cyan-400" />
                </div>
                <h3 className="font-bold text-sm text-[var(--foreground)] mb-1">Spring Boot Ingestion</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
                  Spring Boot REST API validates incoming 5 Hz payload frames and buffers session context.
                </p>
                <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-300 bg-cyan-950/50 p-2 rounded-lg border border-cyan-800/40">
                  <Zap size={12} /> REST /api/predict
                </div>
              </div>

              {/* Step 3 */}
              <div className="surface-card border border-indigo-500/30 p-4 rounded-2xl relative group hover:border-indigo-500/60 transition-all bg-slate-900/40">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    Step 3
                  </span>
                  <Cpu size={18} className="text-indigo-400" />
                </div>
                <h3 className="font-bold text-sm text-[var(--foreground)] mb-1">Python ML Inference</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
                  `predict_score.py` evaluates typing stability, idle ratio, tab switches, and computes fatigue risk.
                </p>
                <div className="flex items-center gap-2 text-[10px] font-mono text-indigo-300 bg-indigo-950/50 p-2 rounded-lg border border-indigo-800/40">
                  <Cpu size={12} /> XGBoost & Feature Scaling
                </div>
              </div>

              {/* Step 4 */}
              <div className="surface-card border border-purple-500/30 p-4 rounded-2xl relative group hover:border-purple-500/60 transition-all bg-slate-900/40">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    Step 4
                  </span>
                  <Database size={18} className="text-purple-400" />
                </div>
                <h3 className="font-bold text-sm text-[var(--foreground)] mb-1">MongoDB & Dashboard</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
                  Metrics stored in MongoDB Atlas; real-time gauge update & wellness nudges rendered on UI.
                </p>
                <div className="flex items-center gap-2 text-[10px] font-mono text-purple-300 bg-purple-950/50 p-2 rounded-lg border border-purple-800/40">
                  <Database size={12} /> MongoDB Session Storage
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "privacy" && (
          <motion.div
            key="privacy"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="surface-card p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Lock size={20} />
                </span>
                <h3 className="font-bold text-sm text-[var(--foreground)]">Zero Keylogging Guarantee</h3>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Raw typed characters, passwords, and sensitive text inputs are NEVER recorded or transmitted. Only high-level timing deltas (KPM/WPM) and backspace frequency are measured.
              </p>
            </div>

            <div className="surface-card p-5 rounded-2xl border border-teal-500/30 bg-teal-950/10 space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
                  <Eye size={20} />
                </span>
                <h3 className="font-bold text-sm text-[var(--foreground)]">On-Device Facial Landmark Check</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Webcam fatigue snapshots are analyzed transiently in-browser or local memory. No raw video feed is stored on cloud servers.
                </p>
              </div>
            </div>

            <div className="surface-card p-5 rounded-2xl border border-cyan-500/30 bg-cyan-950/10 space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <ShieldCheck size={20} />
                </span>
                <h3 className="font-bold text-sm text-[var(--foreground)]">End-to-End Encrypted Storage</h3>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                All saved session records in MongoDB Atlas are encrypted with AES-256 tokens ensuring individual user privacy and role-restricted developer inspection.
              </p>
            </div>
          </motion.div>
        )}

        {activeTab === "matrix" && (
          <motion.div
            key="matrix"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-1">
                <div className="flex justify-between items-center text-xs font-bold text-emerald-400">
                  <span>Score: 0 - 44</span>
                  <span>LOW RISK</span>
                </div>
                <h4 className="font-black text-emerald-200 text-sm">Optimal Flow State</h4>
                <p className="text-[11px] text-[var(--text-secondary)]">Steady typing rhythm, low key correction ratio, minimal tab switching.</p>
              </div>

              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 space-y-1">
                <div className="flex justify-between items-center text-xs font-bold text-amber-400">
                  <span>Score: 45 - 67</span>
                  <span>MODERATE</span>
                </div>
                <h4 className="font-black text-amber-200 text-sm">Mild Strain Detected</h4>
                <p className="text-[11px] text-[var(--text-secondary)]">Slight decrease in typing speed, rising backspace usage, short pauses.</p>
              </div>

              <div className="p-4 rounded-xl border border-orange-500/30 bg-orange-950/20 space-y-1">
                <div className="flex justify-between items-center text-xs font-bold text-orange-400">
                  <span>Score: 68 - 81</span>
                  <span>HIGH RISK</span>
                </div>
                <h4 className="font-black text-orange-200 text-sm">Elevated Fatigue</h4>
                <p className="text-[11px] text-[var(--text-secondary)]">Frequent backspaces, prolonged mouse idle times, tab distraction spikes.</p>
              </div>

              <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/20 space-y-1">
                <div className="flex justify-between items-center text-xs font-bold text-rose-400">
                  <span>Score: 82 - 100</span>
                  <span>CRITICAL</span>
                </div>
                <h4 className="font-black text-rose-200 text-sm">Severe Exhaustion</h4>
                <p className="text-[11px] text-[var(--text-secondary)]">Extremely erratic typing, heavy distraction switches. Immediate break required.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
