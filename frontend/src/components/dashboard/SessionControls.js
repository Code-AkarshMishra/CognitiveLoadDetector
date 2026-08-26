import { Download, Play, Puzzle, Square } from "lucide-react";

export default function SessionControls({
  sessionActive,
  startSession,
  stopSession,
  downloadReport,
  downloadCSVReport,
  onInstallExtension,
}) {
  return (
    <div className="surface-card p-6 sm:p-8">
      <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="section-kicker">Session Control</p>

          <h2 className="mt-2 text-2xl font-black text-[var(--foreground)] sm:text-3xl">
            {sessionActive ? "Analysis Running" : "Ready to Start"}
          </h2>

          <p className="mt-3 max-w-xl text-[var(--text-secondary)]">
            Start a session to understand your focus level, fatigue risk and how your work feels over time.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {!sessionActive ? (
            <button 
              onClick={startSession} 
              className="btn-primary flex items-center justify-center gap-2 px-8 py-3 text-sm font-bold shadow-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border-0" 
              type="button"
            >
              <Play size={18} aria-hidden="true" />
              <span>Start Analysis</span>
            </button>
          ) : (
            <button onClick={stopSession} className="btn-danger flex items-center justify-center gap-2 px-8 py-3 text-sm font-bold shadow-xl" type="button">
              <Square size={17} aria-hidden="true" />
              <span>Stop Session</span>
            </button>
          )}

          {downloadReport && (
            <button className="btn-secondary" type="button" onClick={downloadReport}>
              <Download size={18} aria-hidden="true" />
              <span>Export PDF Report</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
