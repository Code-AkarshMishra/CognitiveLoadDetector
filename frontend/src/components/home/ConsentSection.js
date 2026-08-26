"use client";

import { motion } from "framer-motion";
import { CheckCircle2, HandHeart, ShieldCheck } from "lucide-react";

const consentItems = [
  "Explicit user consent is required before triggering any 30-second camera scan.",
  "Users have full control to cancel or stop live sessions at any moment.",
  "Clear visibility into what metrics are calculated and how criteria are judged.",
  "Zero passive background recording when not in an active user session.",
];

export default function ConsentSection() {
  return (
    <section className="border-b border-[var(--border)] bg-[var(--surface)] py-20 transition-colors">
      <div className="max-w-[1500px] w-full mx-auto px-4 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-[var(--border)] bg-[var(--surface-muted)] overflow-hidden shadow-xl"
        >
          <div className="grid gap-0 lg:grid-cols-12">
            
            <div className="lg:col-span-5 bg-gradient-to-tr from-cyan-600 to-indigo-700 p-8 sm:p-10 text-white flex flex-col justify-between space-y-6">
              <div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 shadow-md">
                  <HandHeart size={24} />
                </span>
                <h2 className="mt-6 text-2xl sm:text-3xl font-black text-white">
                  User Sovereignty & Consent
                </h2>
                <p className="mt-3 text-xs sm:text-sm text-cyan-100 leading-relaxed">
                  You are always in control of your telemetry. All sensory processing is explicit, ephemeral, and fully inspectable.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-cyan-200">
                <ShieldCheck size={16} />
                <span>Zero Hidden Telemetry Streams</span>
              </div>
            </div>

            <div className="lg:col-span-7 p-6 sm:p-8 space-y-3 flex flex-col justify-center">
              {consentItems.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3.5 shadow-sm"
                >
                  <CheckCircle2
                    className="mt-0.5 shrink-0 text-cyan-500"
                    size={18}
                  />
                  <p className="text-xs font-bold text-[var(--foreground)]">
                    {item}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
