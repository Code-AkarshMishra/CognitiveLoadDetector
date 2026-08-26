import { Camera } from "lucide-react";

export default function WebcamMetrics({ webcamMetrics }) {
  return (
    <section className="surface-card p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--violet-soft)] text-[var(--violet)]">
          <Camera size={20} aria-hidden="true" />
        </span>
        <h2 className="text-2xl font-black text-[var(--foreground)]">
          Webcam Metrics
        </h2>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          title="Permission"
          value={webcamMetrics.permissionGranted ? "Granted" : "Pending"}
        />
        <Metric title="Camera" value={webcamMetrics.cameraActive ? "Active" : "Inactive"} />
        <Metric title="Snapshots" value={webcamMetrics.snapshotCount} />
        <Metric title="Last Reason" value={webcamMetrics.lastCaptureReason || "-"} />
        <Metric
          title="Frame Signal"
          value={
            webcamMetrics.lastFrameSummary?.likelyUsableFrame
              ? "Usable"
              : webcamMetrics.lastFrameSummary
              ? "Low light"
              : "-"
          }
        />
      </div>
    </section>
  );
}

function Metric({ title, value }) {
  return (
    <div className="metric-card">
      <p className="text-sm font-semibold text-[var(--text-muted)]">{title}</p>
      <h3 className="mt-2 break-words text-xl font-black text-[var(--foreground)]">
        {value}
      </h3>
    </div>
  );
}
