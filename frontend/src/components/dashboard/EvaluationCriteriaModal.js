"use client";

import { X, Keyboard, MousePointer, ShieldAlert, Award, Timer, Info } from "lucide-react";

export default function EvaluationCriteriaModal({
  isOpen,
  onClose,
  role = "developer",
  task = "coding",
  criteriaDetails,
  taskStandards
}) {
  if (!isOpen) return null;

  const safeRole = role || "developer";
  const safeTask = task || "coding";

  const roleTitle = safeRole === "developer" ? "Developer" : "Student";
  const taskTitle = {
    coding: "Coding / Development",
    reading: "Reading / Research",
    writing: "Writing / Documentation",
    designing: "UI/UX Design",
    lecture: "Video Learning / Lecture",
    meeting: "Meetings",
    reporting: "Report Work",
  }[safeTask] || safeTask;

  const standard = taskStandards?.[safeRole]?.[safeTask];
  const details = criteriaDetails?.[safeRole]?.[safeTask] || {
    weights: { keyboard: 35, mouse: 35, focus: 30 },
    idleGrace: standard?.idleThreshold || 90,
    expectedKeyboard: `${standard?.expectedWpm || 35}+ WPM expected rhythm`,
    expectedMouse: "Active cursor movement & interaction",
    distractionImpact: "Frequent tab/window switches reduce focus score",
    formula: "Multimodal calibrated interaction score with idle & strain penalty"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-900/90 text-slate-100 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/40 px-6 py-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Evaluation Criteria
            </span>
            <h3 className="mt-1 text-xl font-extrabold text-white">
              {roleTitle} · {taskTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[75vh] overflow-y-auto px-6 py-6 space-y-6">
          
          {/* Formula */}
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 flex items-start gap-3">
            <Award className="text-blue-400 shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="text-sm font-bold text-white">Scoring Formula</h4>
              <p className="mt-1 text-xs text-blue-300 leading-relaxed font-mono">
                {details.formula}
              </p>
            </div>
          </div>

          {/* Metric Weights */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Metric Weightage
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-slate-850 p-3 text-center border border-slate-800/80">
                <p className="text-xs font-bold text-slate-400">Keyboard</p>
                <p className="mt-1 text-lg font-black text-emerald-400">
                  {details.weights.keyboard}%
                </p>
              </div>
              <div className="rounded-xl bg-slate-850 p-3 text-center border border-slate-800/80">
                <p className="text-xs font-bold text-slate-400">Mouse / Scroll</p>
                <p className="mt-1 text-lg font-black text-sky-400">
                  {details.weights.mouse}%
                </p>
              </div>
              <div className="rounded-xl bg-slate-850 p-3 text-center border border-slate-800/80">
                <p className="text-xs font-bold text-slate-400">Focus / Time</p>
                <p className="mt-1 text-lg font-black text-violet-400">
                  {details.weights.focus}%
                </p>
              </div>
            </div>
          </div>

          {/* Activity Standards */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Expected Interaction Profile
            </h4>
            
            {/* Keyboard */}
            <div className="flex gap-3 items-start">
              <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-400 shrink-0">
                <Keyboard size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Keyboard Input</p>
                <p className="mt-0.5 text-xs text-slate-400 leading-relaxed">
                  {details.expectedKeyboard}
                </p>
              </div>
            </div>

            {/* Mouse */}
            <div className="flex gap-3 items-start">
              <div className="rounded-xl bg-sky-500/10 p-2 text-sky-400 shrink-0">
                <MousePointer size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Mouse & Scrolling</p>
                <p className="mt-0.5 text-xs text-slate-400 leading-relaxed">
                  {details.expectedMouse}
                </p>
              </div>
            </div>

            {/* Idle grace */}
            <div className="flex gap-3 items-start">
              <div className="rounded-xl bg-amber-500/10 p-2 text-amber-400 shrink-0">
                <Timer size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Allowed Thinking Pause</p>
                <p className="mt-0.5 text-xs text-slate-400 leading-relaxed">
                  Up to <span className="font-bold text-amber-300">{details.idleGrace} seconds</span>. Pause durations beyond this threshold will apply an accumulated idle penalty.
                </p>
              </div>
            </div>

            {/* Distraction */}
            <div className="flex gap-3 items-start">
              <div className="rounded-xl bg-rose-500/10 p-2 text-rose-400 shrink-0">
                <ShieldAlert size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Distraction Impact</p>
                <p className="mt-0.5 text-xs text-slate-400 leading-relaxed">
                  {details.distractionImpact}
                </p>
              </div>
            </div>
          </div>

          {/* How Distraction is Detected */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/20 p-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Info size={14} className="text-slate-400" />
              Distraction & Score Penalties
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-400 pl-4 list-disc">
              <li>
                Each **tab switch** triggers a distraction penalty based on the active mode (e.g. -10 to -20 points).
              </li>
              <li>
                Leaving or **blurring the active window** increases the distraction score and halts productivity growth.
              </li>
              <li>
                Continuous tab hopping yields a **high distraction score** which aggressively scales down final productivity.
              </li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 bg-slate-950/40 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-semibold text-white px-5 py-2.5 transition"
          >
            Got it
          </button>
        </div>

      </div>
    </div>
  );
}
