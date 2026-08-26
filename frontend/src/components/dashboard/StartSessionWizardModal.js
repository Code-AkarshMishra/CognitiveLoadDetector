"use client";

import { useState, useEffect } from "react";
import { 
  BookOpen, 
  Code2, 
  FileText, 
  MousePointer2, 
  PenLine, 
  Presentation, 
  X, 
  ArrowRight, 
  Check, 
  GraduationCap, 
  Code, 
  Sparkles, 
  ArrowLeft 
} from "lucide-react";

const taskOptions = [
  { value: "coding", label: "Coding / Dev", description: "Writing code, debugging, active IDE work", icon: Code2 },
  { value: "reading", label: "Reading / Research", description: "Documentation, technical papers, articles", icon: BookOpen },
  { value: "writing", label: "Writing / Doc", description: "Drafting specs, reports, emails, notes", icon: PenLine },
  { value: "meeting", label: "Meetings", description: "Video calls, screen share, team sync", icon: Presentation },
  { value: "designing", label: "UI/UX Design", description: "Figma, canvas editing, wireframing", icon: MousePointer2 },
  { value: "lecture", label: "Video Learning", description: "Tutorials, online lectures, courses", icon: Presentation },
  { value: "reporting", label: "Report Work", description: "Analytics review, status updates, Jira", icon: FileText },
];

export default function StartSessionWizardModal({
  isOpen,
  open,
  onClose,
  currentRole,
  initialRole,
  currentTask,
  initialTask,
  onStartSession
}) {
  const isVisible = isOpen !== undefined ? isOpen : open;
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(initialRole || currentRole || "developer");
  const [selectedTask, setSelectedTask] = useState(initialTask || currentTask || "coding");

  useEffect(() => {
    if (initialRole || currentRole) setSelectedRole(initialRole || currentRole);
    if (initialTask || currentTask) setSelectedTask(initialTask || currentTask);
  }, [initialRole, currentRole, initialTask, currentTask]);

  if (!isVisible) return null;

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  const handleNext = () => {
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleLaunch = () => {
    onStartSession({ role: selectedRole, task: selectedTask });
    setStep(1);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md">
      <section className="w-full max-w-xl overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] p-6 shadow-2xl sm:p-8 relative transition-colors">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] pb-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 shadow-md">
              <Sparkles size={22} className="animate-pulse" />
            </span>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                Session Setup • Step {step} of 2
              </p>
              <h2 className="mt-0.5 text-2xl font-black text-[var(--foreground)]">
                {step === 1 ? "Choose Your Mode" : "What task are you working on?"}
              </h2>
            </div>
          </div>

          <button
            aria-label="Close setup modal"
            className="rounded-2xl p-2 text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)] transition cursor-pointer"
            type="button"
            onClick={handleClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Step 1: Select Role/Mode */}
        {step === 1 && (
          <div className="mt-6 space-y-6">
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Select your profile mode so the AI calibration accurately accounts for your typing pace, thinking pauses, and distraction thresholds:
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setSelectedRole("student")}
                className={`relative flex flex-col justify-between p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedRole === "student"
                    ? "bg-emerald-500/15 border-emerald-500 text-[var(--foreground)] shadow-md ring-2 ring-emerald-500/30"
                    : "bg-[var(--surface-muted)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="p-3 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      <GraduationCap size={24} />
                    </span>
                    {selectedRole === "student" && (
                      <span className="h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-md">
                        <Check size={14} />
                      </span>
                    )}
                  </div>
                  <h3 className="font-black text-base text-[var(--foreground)]">Student Mode</h3>
                  <p className="mt-1.5 text-xs text-[var(--text-secondary)] leading-relaxed">
                    Paced for learning, study sessions, reading, lectures, and academic problem-solving with extended thinking grace times.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("developer")}
                className={`relative flex flex-col justify-between p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedRole === "developer"
                    ? "bg-cyan-500/15 border-cyan-500 text-[var(--foreground)] shadow-md ring-2 ring-cyan-500/30"
                    : "bg-[var(--surface-muted)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="p-3 rounded-xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                      <Code size={24} />
                    </span>
                    {selectedRole === "developer" && (
                      <span className="h-6 w-6 rounded-full bg-cyan-500 text-white flex items-center justify-center text-xs font-bold shadow-md">
                        <Check size={14} />
                      </span>
                    )}
                  </div>
                  <h3 className="font-black text-base text-[var(--foreground)]">Developer Mode</h3>
                  <p className="mt-1.5 text-xs text-[var(--text-secondary)] leading-relaxed">
                    Optimized for intense drafting, active IDE coding, bug fixing, and continuous technical workflows.
                  </p>
                </div>
              </button>
            </div>

            <div className="pt-4 flex justify-end border-t border-[var(--border)]">
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/25 transition cursor-pointer"
              >
                <span>Continue to Activity Task</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Select Task */}
        {step === 2 && (
          <div className="mt-6 space-y-6">
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Choose your primary activity for this session so we accurately evaluate typing pace vs thinking pauses:
            </p>

            <div className="grid gap-2.5 max-h-[280px] overflow-y-auto pr-1">
              {taskOptions.map(({ value, label, description, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSelectedTask(value)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedTask === value
                      ? "bg-cyan-500/15 border-cyan-500 text-[var(--foreground)] font-bold shadow-sm ring-1 ring-cyan-500/30"
                      : "bg-[var(--surface-muted)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`p-2.5 rounded-xl border ${selectedTask === value ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/30' : 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)]'}`}>
                      <Icon size={18} />
                    </span>
                    <div>
                      <h4 className="text-sm font-black text-[var(--foreground)]">{label}</h4>
                      <p className="text-xs text-[var(--text-secondary)]">{description}</p>
                    </div>
                  </div>
                  {selectedTask === value && (
                    <span className="h-5 w-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center text-xs font-bold">
                      <Check size={12} />
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-[var(--border)]">
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[var(--surface-muted)] hover:bg-[var(--surface-raised)] text-[var(--foreground)] text-xs font-bold border border-[var(--border)] transition cursor-pointer"
              >
                <ArrowLeft size={15} />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleLaunch}
                className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold shadow-xl shadow-cyan-500/25 transition cursor-pointer hover:scale-[1.02] active:scale-95"
              >
                <Sparkles size={16} />
                <span>Start Session Now</span>
              </button>
            </div>
          </div>
        )}

      </section>
    </div>
  );
}
