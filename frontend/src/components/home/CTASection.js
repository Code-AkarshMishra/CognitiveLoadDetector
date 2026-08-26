"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, UserPlus, BrainCircuit, Sparkles } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-b from-[var(--surface)] to-[var(--surface-muted)] relative overflow-hidden transition-colors">
      <div className="max-w-[1500px] w-full mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto p-8 sm:p-14 rounded-[36px] bg-gradient-to-tr from-slate-900 via-indigo-950 to-cyan-950 border border-cyan-500/30 text-center shadow-2xl relative overflow-hidden"
        >
          {/* Ambient glow */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyan-500/25 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-500/25 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-black uppercase tracking-wider">
              <Sparkles size={14} className="text-cyan-400" />
              <span>Free & Privacy-Preserving</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight !text-white max-w-2xl mx-auto leading-tight">
              Ready to Master Your Cognitive Workflow?
            </h2>

            <p className="max-w-2xl mx-auto text-sm sm:text-base !text-slate-200 leading-relaxed font-normal">
              Start a live session in seconds. Monitor cognitive index, typing rhythms, and 15-second facial fatigue signals with zero software install required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/30 transition hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Launch Live Laboratory</span>
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/register"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 !text-white border border-slate-700 font-bold text-sm transition cursor-pointer shadow-md"
              >
                <UserPlus size={16} />
                <span>Create Operator Account</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
