import { Camera, Keyboard, MousePointer2, Radio } from "lucide-react";

export default function TrackingStatus({
  sessionActive,
  keyboardTracking,
  mouseTracking,
  webcamActive,
}) {
  return (
    <section className="surface-card p-6 sm:p-8">
      <h2 className="text-2xl font-black text-[var(--foreground)]">
        Tracking Status
      </h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatusCard icon={Radio} title="Session" value={sessionActive ? "Active" : "Inactive"} active={sessionActive} />
        <StatusCard icon={Keyboard} title="Keyboard" value={keyboardTracking ? "Running" : "Stopped"} active={keyboardTracking} />
        <StatusCard icon={MousePointer2} title="Mouse" value={mouseTracking ? "Running" : "Stopped"} active={mouseTracking} />
        <StatusCard icon={Camera} title="Webcam" value={webcamActive ? "Active" : "Inactive"} active={webcamActive} />
      </div>
    </section>
  );
}

function StatusCard({ icon: Icon, title, value, active }) {
  return (
    <div className="metric-card">
      <div className="flex items-center justify-between gap-3">
        <Icon className="text-[var(--primary)]" size={21} aria-hidden="true" />
        <span className="status-pill">
          <span className={`status-dot ${active ? "active" : ""}`} />
          {active ? "Live" : "Idle"}
        </span>
      </div>
      <p className="mt-5 text-sm font-semibold text-[var(--text-muted)]">{title}</p>
      <h3 className="mt-2 text-xl font-black text-[var(--foreground)]">{value}</h3>
    </div>
  );
}
