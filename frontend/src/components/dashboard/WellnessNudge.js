import { Coffee, Gamepad2, Headphones, Trees, X } from "lucide-react";

const suggestions = [
  { icon: Coffee, label: "Take a short break" },
  { icon: Headphones, label: "Listen to calming audio" },
  { icon: Trees, label: "Walk for two minutes" },
  { icon: Gamepad2, label: "Play a quick relaxing game" },
];

export default function WellnessNudge({ open, fatigueRisk, productivityScore, onDismiss }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <section className="w-full max-w-lg rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-lg)] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="section-kicker text-[var(--warning)]">Rest Suggestion</p>
            <h2 className="mt-2 text-2xl font-black text-[var(--foreground)]">
              Your focus looks strained
            </h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Productivity is at {productivityScore}% and fatigue risk is {fatigueRisk}.
              A short reset may help you come back sharper.
            </p>
          </div>

          <button
            aria-label="Dismiss rest suggestion"
            className="btn-secondary !h-10 !min-h-10 !w-10 !p-0"
            type="button"
            onClick={onDismiss}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {suggestions.map(({ icon: Icon, label }) => (
            <div key={label} className="activity-option cursor-default">
              <Icon size={18} aria-hidden="true" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
