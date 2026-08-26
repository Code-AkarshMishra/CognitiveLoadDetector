import { CheckCircle2 } from "lucide-react";

const sections = [
  {
    title: "Keyboard Analytics",
    description:
      "Measure typing behavior to identify cognitive stress, fatigue and focus fluctuations.",
    items: ["Typing Speed (WPM)", "Error Frequency", "Response Delay", "Consistency Tracking"],
    panel: "keyboard",
  },
  {
    title: "Mouse Behavior Analysis",
    description:
      "Detect hesitation, inactivity and abnormal interaction patterns through cursor behavior.",
    items: ["Cursor Stability", "Random Movement Detection", "Activity Monitoring", "Idle Time Analysis"],
    panel: "mouse",
  },
  {
    title: "Privacy-First Facial Analysis",
    description:
      "Webcam snapshots are processed only for fatigue indicators. No images or videos are stored.",
    items: ["Blink Rate", "Eye Closure Detection", "Yawn Detection", "Head Position Monitoring"],
    panel: "face",
  },
];

export default function ProductSection() {
  return (
    <section className="app-container app-section">
      <div className="max-w-3xl">
        <span className="section-kicker">Product Overview</span>
        <h2 className="section-title">Built around behavioral signals, not surveys.</h2>
        <p className="section-copy">
          NeuroTrack continuously analyzes user interaction patterns to estimate
          cognitive load and mental fatigue.
        </p>
      </div>

      <div className="mt-14 space-y-14">
        {sections.map((section, index) => (
          <div
            key={section.title}
            className="grid items-center gap-8 lg:grid-cols-2"
          >
            <div className={index === 1 ? "lg:order-2" : ""}>
              <h3 className="text-2xl font-bold text-[var(--foreground)] sm:text-3xl">
                {section.title}
              </h3>
              <p className="mt-4 text-[var(--text-secondary)]">{section.description}</p>
              <ul className="mt-7 space-y-3 text-[var(--text-secondary)]">
                {section.items.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2
                      className="shrink-0 text-[var(--success)]"
                      size={18}
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <ProductPanel type={section.panel} reverse={index === 1} />
          </div>
        ))}
      </div>
    </section>
  );
}

function ProductPanel({ type, reverse }) {
  if (type === "keyboard") {
    return (
      <div className={`surface-card p-6 ${reverse ? "lg:order-1" : ""}`}>
        <Progress label="Typing Speed" value="82 WPM" width="82%" tone="primary" />
        <Progress label="Consistency" value="91%" width="91%" tone="success" />
      </div>
    );
  }

  if (type === "mouse") {
    return (
      <div className={`surface-card p-6 ${reverse ? "lg:order-1" : ""}`}>
        {[
          ["Mouse Stability", "Stable"],
          ["Idle Time", "8%"],
          ["Interaction Rate", "High"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between border-b border-[var(--border)] py-4 last:border-b-0"
          >
            <span className="font-semibold text-[var(--text-secondary)]">{label}</span>
            <span className="font-bold text-[var(--foreground)]">{value}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`surface-card p-6 ${reverse ? "lg:order-1" : ""}`}>
      <div className="grid grid-cols-2 gap-4">
        {[
          ["Blink Rate", "14/min"],
          ["Eye Closure", "Normal"],
          ["Yawns", "1"],
          ["Alertness", "Good"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-[var(--border)] bg-white/76 p-5">
            <p className="text-sm text-[var(--text-secondary)]">{label}</p>
            <h4 className="mt-2 text-xl font-bold text-[var(--foreground)]">{value}</h4>
          </div>
        ))}
      </div>
    </div>
  );
}

function Progress({ label, value, width, tone }) {
  const barColor = tone === "success" ? "bg-[var(--success)]" : "bg-[var(--primary)]";

  return (
    <div className="py-4">
      <div className="flex justify-between gap-4">
        <span className="font-semibold text-[var(--text-secondary)]">{label}</span>
        <span className="font-bold text-[var(--foreground)]">{value}</span>
      </div>
      <div className="mt-3 h-2.5 rounded-full bg-[var(--surface-muted)]">
        <div className={`h-2.5 rounded-full ${barColor}`} style={{ width }} />
      </div>
    </div>
  );
}
