import { Camera, Keyboard, MousePointer2, Radio } from "lucide-react";

export default function CurrentActivity({
  sessionActive,
  keyboardTracking,
  mouseTracking,
  webcamActive,
}) {
  return (
    <section>
      <div className="mb-5">
        <h2 className="text-2xl font-black text-[var(--foreground)] sm:text-3xl">
          Live Monitoring
        </h2>
        <p className="mt-2 text-[var(--text-secondary)]">
          Current status of all active tracking modules.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card icon={Radio} title="Session" value={sessionActive ? "Running" : "Inactive"} active={sessionActive} tone="warning" />
        <Card icon={Keyboard} title="Keyboard" value={keyboardTracking ? "Monitoring" : "Stopped"} active={keyboardTracking} tone="primary" />
        <Card icon={MousePointer2} title="Mouse" value={mouseTracking ? "Monitoring" : "Stopped"} active={mouseTracking} tone="accent" />
        <Card icon={Camera} title="Camera" value={webcamActive ? "Active" : "Inactive"} active={webcamActive} tone="violet" />
      </div>
    </section>
  );
}

function Card({ icon: Icon, title, value, active, tone }) {
  const tones = {
    warning: "bg-[var(--warning-soft)] text-[var(--warning)]",
    primary: "bg-[var(--primary-soft)] text-[var(--primary)]",
    accent: "bg-[var(--accent-soft)] text-[var(--accent)]",
    violet: "bg-[var(--violet-soft)] text-[var(--violet)]",
  };

  return (
    <article className="metric-card">
      <div className="flex items-center justify-between gap-3">
        <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tones[tone]}`}>
          <Icon size={21} aria-hidden="true" />
        </span>
        <span className="status-pill">
          <span className={`status-dot ${active ? "active" : ""}`} />
          {active ? "Live" : "Idle"}
        </span>
      </div>

      <p className="mt-5 text-sm font-semibold text-[var(--text-muted)]">{title}</p>
      <h3 className="mt-2 text-2xl font-black text-[var(--foreground)]">{value}</h3>
    </article>
  );
}
