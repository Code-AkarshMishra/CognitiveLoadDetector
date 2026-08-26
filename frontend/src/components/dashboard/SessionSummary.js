import { BrainCircuit, Clock3, Gauge, Target } from "lucide-react";

export default function SessionSummary({ summary }) {
  if (!summary) return null;

  return (
    <section className="surface-card p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
          <Target size={20} aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-2xl font-black text-[var(--foreground)]">
            Last Session Summary
          </h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            A simple view of how your session felt based on your focus and fatigue signals.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric icon={Clock3} title="Duration" value={summary.durationFormatted} />
        <Metric icon={Gauge} title="Productivity" value={`${summary.productivityScore}%`} />
        <Metric icon={BrainCircuit} title="Fatigue Risk" value={summary.fatigueRisk} />
        <Metric icon={Target} title="Engagement" value={summary.engagementState} />
      </div>

      {summary.autoSaved && (
        <div className="mt-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 p-4 text-sm text-emerald-800 dark:text-emerald-300 flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
          <span>
            Session CSV auto-saved to folder: <strong className="font-mono text-xs select-all">{`sessions/${summary.filename}`}</strong>
          </span>
        </div>
      )}
    </section>
  );
}

function Metric({ icon: Icon, title, value }) {
  return (
    <article className="metric-card">
      <Icon className="text-[var(--primary)]" size={20} aria-hidden="true" />
      <p className="mt-4 text-sm font-semibold text-[var(--text-muted)]">{title}</p>
      <h3 className="mt-2 text-xl font-black text-[var(--foreground)]">{value}</h3>
    </article>
  );
}
