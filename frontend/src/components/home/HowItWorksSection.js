"use client";

import { motion } from "framer-motion";
import { Sliders, Cpu, Eye, BarChart2, BellRing, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    step: "01",
    icon: Sliders,
    title: "Select Role & Calibrate",
    description: "Choose your role (Developer or Student) and task mode (Coding, Reading, Writing, Meeting, Designing). Baseline thresholds auto-tune.",
  },
  {
    step: "02",
    icon: Cpu,
    title: "Stream Continuous Telemetry",
    description: "During your session, keypress intervals, backspaces, mouse speed, and context window switches are calculated at 5 Hz.",
  },
  {
    step: "03",
    icon: Eye,
    title: "15s Smart Vision ML",
    description: "Smart 15-second camera bursts detect facial fatigue, gaze stability, and blink dynamics using local OpenCV cascades with zero video recording.",
  },
  {
    step: "04",
    icon: BellRing,
    title: "Cognitive Score & Recovery Nudges",
    description: "View real-time cognitive index trajectory graphs and receive proactive 20-20-20 rest nudges when fatigue risk rises.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="workflow" className="border-b border-[var(--border)] bg-[var(--surface-muted)] py-20 transition-colors">
      <div className="max-w-[1500px] w-full mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={13} />
            <span>Architecture & Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[var(--foreground)]">
            How The Analysis Engine Operates
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            From active telemetry capture to automated cognitive load inference, everything happens locally and in real time.
          </p>
        </div>

        {/* 4-Step Pipeline Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ step, icon: Icon, title, description }, index) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-md hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-cyan-600 dark:text-cyan-400 font-mono">
                    {step}
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface-muted)] text-[var(--foreground)] border border-[var(--border)] shadow-sm">
                    <Icon size={18} />
                  </span>
                </div>
                <h3 className="text-base font-bold text-[var(--foreground)]">
                  {title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 transition cursor-pointer"
          >
            <span>Experience Live Analysis</span>
            <ArrowRight size={15} />
          </Link>
        </div>

      </div>
    </section>
  );
}
