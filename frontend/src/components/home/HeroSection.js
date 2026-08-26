"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Zap,
  Activity,
  Play,
  FileText,
  BrainCircuit,
  CheckCircle2,
  Lock,
  Cpu
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--border)] bg-gradient-to-b from-[var(--surface-muted)] via-[var(--surface)] to-[var(--background)] py-16 sm:py-24 transition-colors">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[320px] bg-gradient-to-tr from-cyan-500/15 via-blue-500/10 to-transparent blur-[130px] pointer-events-none" />

      <div className="max-w-[1500px] w-full mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        
        {/* Main Hero Grid */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Clear Value Proposition (7 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-800 dark:text-cyan-300 text-xs font-black tracking-wide shadow-sm">
              <Sparkles size={14} className="text-cyan-600 dark:text-cyan-400" />
              <span>Real-Time Cognitive Load & Mental Fatigue Telemetry</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[var(--foreground)] leading-[1.08]">
              Understand Your Focus. <br />
              <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-500 bg-clip-text text-transparent">
                Prevent Mental Burnout.
              </span>
            </h1>

            <p className="max-w-2xl text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed font-normal">
              Continuous cognitive load analysis powered by live typing rhythms, cursor velocity, and 15-second privacy-first OpenCV facial fatigue scans — without surveys or intrusive recording.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link
                href="/dashboard"
                className="flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-sm shadow-xl shadow-cyan-500/25 transition hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Play size={16} />
                <span>Launch Live Laboratory</span>
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/documentation"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[var(--surface)] hover:bg-[var(--surface-muted)] text-[var(--foreground)] border border-[var(--border)] font-bold text-sm transition cursor-pointer shadow-sm"
              >
                <FileText size={15} />
                <span>Documentation & Standards</span>
              </Link>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 max-w-xl text-xs font-bold text-[var(--foreground)]">
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
                <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
                <span>Zero Video Stored</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
                <Zap size={16} className="text-cyan-500 shrink-0" />
                <span>15s Vision Bursts</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
                <Activity size={16} className="text-indigo-500 shrink-0" />
                <span>Real-Time Nudges</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Live Calibrated Topology Preview (5 Cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="lg:col-span-5"
          >
            <div className="p-6 sm:p-7 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl space-y-5 relative overflow-hidden backdrop-blur-xl">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                    <BrainCircuit size={18} />
                  </span>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-[var(--foreground)]">
                      Multimodal Telemetry Engine
                    </h3>
                    <p className="text-[10px] text-[var(--text-secondary)]">Spring Boot :8080 ➔ Python ML :5001</p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Live ML Ready
                </span>
              </div>

              {/* 3 Core Stream Preview Rows */}
              <div className="space-y-2.5">
                <div className="p-3 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-[var(--foreground)]">Keystroke Cadence Dynamics</p>
                    <p className="text-[10px] text-[var(--text-secondary)]">Inter-key latency & backspace strain index</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
                    5 Hz Stream
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-[var(--foreground)]">Cursor Navigation Trajectory</p>
                    <p className="text-[10px] text-[var(--text-secondary)]">Movement fluidity & context switch blurs</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                    Velocity Calc
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-[var(--foreground)]">15s OpenCV Facial ML</p>
                    <p className="text-[10px] text-[var(--text-secondary)]">Blink frequency & posture (Zero raw video saved)</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                    Auto-Off ML
                  </span>
                </div>
              </div>

              {/* Bottom Quick Action */}
              <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
                <span className="flex items-center gap-1.5 font-medium">
                  <Lock size={13} className="text-emerald-500" />
                  100% Privacy Compliant
                </span>
                <Link href="/dashboard" className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline">
                  Launch Session →
                </Link>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
