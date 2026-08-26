import { Database } from "lucide-react";

export default function DeveloperDataPanel({ events }) {
  const latestEvents = events.slice(-5).reverse();

  return (
    <section className="surface-card p-6 sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface-muted)] text-[var(--foreground)]">
            <Database size={20} aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-2xl font-black text-[var(--foreground)]">
              JSON Collection
            </h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Stored locally for backend handoff and admin review.
            </p>
          </div>
        </div>
        <span className="status-pill self-start">{events.length} events</span>
      </div>

      <pre className="mt-5 max-h-[320px] overflow-auto rounded-2xl border border-[var(--border)] bg-slate-950 p-4 text-xs leading-5 text-slate-100 sm:text-sm">
        {JSON.stringify(latestEvents, null, 2)}
      </pre>
    </section>
  );
}
