import { Keyboard } from "lucide-react";

export default function KeyboardMetrics({ keyboardMetrics }) {
  return (
    <section className="surface-card p-6 sm:p-8">
      <SectionTitle icon={Keyboard} title="Keyboard Metrics" />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Metric title="Keystrokes" value={keyboardMetrics.totalKeystrokes} />
        <Metric title="Backspaces" value={keyboardMetrics.backspaceCount} />
        <Metric title="Keys / Minute" value={keyboardMetrics.typingSpeed} />
        <Metric title="Words / Minute" value={keyboardMetrics.wordsPerMinute} />
        <Metric title="Avg Interval" value={`${keyboardMetrics.averageInterval} ms`} />
      </div>
    </section>
  );
}

function SectionTitle({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
        <Icon size={20} aria-hidden="true" />
      </span>
      <h2 className="text-2xl font-black text-[var(--foreground)]">{title}</h2>
    </div>
  );
}

function Metric({ title, value }) {
  return (
    <div className="metric-card">
      <p className="text-sm font-semibold text-[var(--text-muted)]">{title}</p>
      <h3 className="mt-2 break-words text-2xl font-black text-[var(--foreground)]">
        {value}
      </h3>
    </div>
  );
}
