"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Eye, 
  Keyboard, 
  MousePointer2, 
  Sparkles, 
  ShieldCheck,
  Zap,
  Layers,
  Activity,
  Code2,
  GraduationCap
} from "lucide-react";

export default function WhatWeMeasureSection() {
  const [selectedRole, setSelectedRole] = useState("developer");

  const pillars = [
    {
      icon: Keyboard,
      color: "from-cyan-500 to-blue-600",
      tag: "Keystroke Rhythm",
      title: "Keyboard Cadence",
      desc: "Measures typing rhythm velocity, inter-key delay variance, and backspace error pressure in real time.",
      metric1: "Cadence Latency",
      metric2: "Correction Strain",
      sample: selectedRole === "developer" ? "Dev Baseline: >45 WPM (High Burst)" : "Student Baseline: >30 WPM (Reading Flow)"
    },
    {
      icon: MousePointer2,
      color: "from-indigo-500 to-purple-600",
      tag: "Navigation Flow",
      title: "Cursor Trajectory",
      desc: "Quantifies cursor velocity smoothness, click intensity, and idle versus deep-focus task intervals.",
      metric1: "Trajectory Fluidity",
      metric2: "Context Blurs",
      sample: selectedRole === "developer" ? "Multi-window IDE Switches Tolerated" : "Doc & Research Navigation Calibrated"
    },
    {
      icon: Eye,
      color: "from-emerald-500 to-teal-600",
      tag: "15s Smart Bursts",
      title: "OpenCV Facial Vision",
      desc: "Runs brief 15-second privacy-first vision bursts to detect eye blink frequency and facial fatigue signs.",
      metric1: "Blink Frequency",
      metric2: "Zero Stored Video",
      sample: "Hardware Auto-Shuts Off After 15s"
    },
  ];

  return (
    <section id="measure" className="border-b border-[var(--border)] bg-[var(--surface)] py-20 transition-colors">
      <div className="max-w-[1500px] w-full mx-auto px-4 sm:px-8 lg:px-12 space-y-12">
        
        {/* Section Header with Role Adaptation Switcher */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-800 dark:text-cyan-300 text-xs font-black uppercase tracking-wider">
              <Sparkles size={13} className="text-cyan-600 dark:text-cyan-400" />
              <span>Multimodal Telemetry Inputs</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[var(--foreground)] leading-tight">
              Objective Behavioral Telemetry. Zero Surveys.
            </h2>
            <p className="text-base text-[var(--text-secondary)] leading-relaxed font-normal">
              Continuous, calibrated inference adapts automatically to user workflow profiles without self-reporting bias.
            </p>
          </div>

          {/* Interactive Role Selector */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)] self-start md:self-auto">
            <button
              type="button"
              onClick={() => setSelectedRole("developer")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedRole === "developer"
                  ? "bg-cyan-500 text-slate-950 shadow-md font-black"
                  : "text-[var(--text-secondary)] hover:text-[var(--foreground)]"
              }`}
            >
              <Code2 size={15} />
              <span>Developer Profile</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole("student")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedRole === "student"
                  ? "bg-indigo-600 text-white shadow-md font-black"
                  : "text-[var(--text-secondary)] hover:text-[var(--foreground)]"
              }`}
            >
              <GraduationCap size={15} />
              <span>Student Profile</span>
            </button>
          </div>
        </div>

        {/* 3 Balanced Modern Feature Cards (Zero bullet clutter) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map(({ icon: Icon, color, tag, title, desc, metric1, metric2, sample }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="p-7 rounded-3xl bg-[var(--surface-muted)] border border-[var(--border)] shadow-lg hover:shadow-xl transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr ${color} text-white shadow-md`}>
                    <Icon size={22} />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)] shadow-sm">
                    {tag}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl font-black text-[var(--foreground)] tracking-tight">
                    {title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-normal">
                    {desc}
                  </p>
                </div>
              </div>

              {/* Clean Metric Chips & Live Calibrated Preview */}
              <div className="space-y-3 pt-4 border-t border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <span className="flex-1 text-center py-1.5 px-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[11px] font-bold text-[var(--foreground)] shadow-sm">
                    {metric1}
                  </span>
                  <span className="flex-1 text-center py-1.5 px-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[11px] font-bold text-[var(--foreground)] shadow-sm">
                    {metric2}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[11px] text-[var(--text-secondary)] font-medium flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-500 shrink-0" />
                  <span className="truncate">{sample}</span>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
