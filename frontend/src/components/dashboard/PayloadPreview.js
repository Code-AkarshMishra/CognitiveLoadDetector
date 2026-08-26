import { Code2 } from "lucide-react";

export default function PayloadPreview({ payload }) {
  return (
    <section className="surface-card p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface-muted)] text-[var(--foreground)]">
          <Code2 size={20} aria-hidden="true" />
        </span>
        <h2 className="text-2xl font-black text-[var(--foreground)]">
          Generated Payload
        </h2>
      </div>

      <pre className="mt-6 max-h-[420px] overflow-auto rounded-2xl border border-[var(--border)] bg-slate-950 p-4 text-sm leading-6 text-slate-100">
        {JSON.stringify(payload, null, 2)}
      </pre>
    </section>
  );
}
