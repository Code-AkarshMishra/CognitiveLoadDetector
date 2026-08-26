"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, XCircle, Lock, ShieldAlert, Sparkles } from "lucide-react";

const collected = [
  "Typing cadence & backspace ratios",
  "Mouse velocity & idle intervals",
  "15s ephemeral facial fatigue indicators",
  "Window & context blur frequency",
];

const notStored = [
  "Raw webcam videos or photographs",
  "Audio recordings or microphone streams",
  "Personal text content or keystroke logs",
  "Sensitive browsing or search histories",
];

export default function PrivacySection() {
  return (
    <section id="privacy" className="border-b border-[var(--border)] bg-[var(--surface)] py-20 transition-colors">
      <div className="max-w-[1500px] w-full mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Lock size={13} />
            <span>Privacy-First Engineering</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[var(--foreground)]">
            Zero Raw Recordings, 100% Ephemeral Telemetry
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            All vision processing occurs locally in 30-second windows without ever storing or uploading raw camera video.
          </p>
        </div>

        {/* 2-Column Comparison Grid */}
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Collected */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-7 rounded-3xl bg-[var(--surface-muted)] border border-[var(--border)] shadow-lg space-y-5"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                <CheckCircle2 size={20} />
              </span>
              <div>
                <h3 className="text-lg font-bold text-[var(--foreground)]">Ephemeral Telemetry Computed</h3>
                <p className="text-xs text-[var(--text-secondary)]">Only numeric metrics needed for real-time scoring</p>
              </div>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-[var(--border)]">
              {collected.map((item) => (
                <div key={item} className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-xs font-semibold text-[var(--foreground)]">
                  <CheckCircle2 size={16} className="text-cyan-500 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Not Stored */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-7 rounded-3xl bg-[var(--surface-muted)] border border-[var(--border)] shadow-lg space-y-5"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <ShieldCheck size={20} />
              </span>
              <div>
                <h3 className="text-lg font-bold text-[var(--foreground)]">Strictly Prohibited & Never Saved</h3>
                <p className="text-xs text-[var(--text-secondary)]">Guaranteed zero capture of raw private media</p>
              </div>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-[var(--border)]">
              {notStored.map((item) => (
                <div key={item} className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-xs font-semibold text-[var(--foreground)]">
                  <XCircle size={16} className="text-rose-500 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
