import { MousePointer2 } from "lucide-react";

export default function MouseMetrics({ mouseMetrics }) {
  return (
    <section className="surface-card p-6 sm:p-8">
      <SectionTitle icon={MousePointer2} title="Mouse Metrics" />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Metric title="Position X" value={mouseMetrics.x} />
        <Metric title="Position Y" value={mouseMetrics.y} />
        <Metric title="Clicks" value={mouseMetrics.clickCount} />
        <Metric title="Moves" value={mouseMetrics.movementEvents} />
        <Metric title="Distance" value={mouseMetrics.totalDistance} />
        <Metric title="Idle Time" value={`${mouseMetrics.idleTime}s`} />
      </div>
    </section>
  );
}

function SectionTitle({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
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
