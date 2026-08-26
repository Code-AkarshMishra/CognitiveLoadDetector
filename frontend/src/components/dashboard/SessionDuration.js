import { Clock3 } from "lucide-react";

export default function SessionDuration({ formattedTime }) {
  return (
    <section className="surface-card p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
          <Clock3 size={20} aria-hidden="true" />
        </span>
        <h2 className="text-2xl font-black text-[var(--foreground)]">
          Session Duration
        </h2>
      </div>

      <p className="mt-5 text-5xl font-black text-[var(--primary)]">
        {formattedTime}
      </p>
    </section>
  );
}
