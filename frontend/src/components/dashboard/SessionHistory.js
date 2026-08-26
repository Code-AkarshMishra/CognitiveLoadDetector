import { Calendar, Clock, Download, History, Keyboard, MousePointer, Trash2 } from "lucide-react";
import { downloadSessionCSV } from "@/services/csvExporter";

export default function SessionHistory({
  history,
  onClearHistory,
  onDeleteSession,
  onExportHistoryCSV,
}) {
  const getFatigueBadgeClass = (risk) => {
    switch (risk) {
      case "High":
        return "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400";
      case "Elevated":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "Watch":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
    }
  };

  const getProductivityColorClass = (score) => {
    if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
    if (score >= 50) return "text-amber-500 dark:text-amber-400";
    return "text-rose-500 dark:text-rose-400";
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return "N/A";
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  return (
    <section className="surface-card p-6 sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--border)] pb-5">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
            <History size={22} aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-2xl font-black text-[var(--foreground)]">
              Saved Sessions History
            </h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Review and export details of all your recorded focus sessions.
            </p>
          </div>
        </div>

        {history && history.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={onExportHistoryCSV}
              className="btn-secondary flex items-center gap-2 px-3.5 py-2 text-xs font-semibold"
              type="button"
            >
              <Download size={15} aria-hidden="true" />
              <span>Export History CSV</span>
            </button>
            <button
              onClick={onClearHistory}
              className="rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 transition px-3.5 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-2"
              type="button"
            >
              <Trash2 size={15} aria-hidden="true" />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>

      {!history || history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <History size={48} className="text-[var(--text-muted)] opacity-40 mb-3" />
          <p className="text-base font-bold text-[var(--foreground)]">No Saved Sessions Yet</p>
          <p className="mt-1.5 max-w-sm text-sm text-[var(--text-secondary)]">
            Start a focus session, work for a bit, and stop the session. Your details will be stored and listed here.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  <th className="pb-3 pl-2">Session Info</th>
                  <th className="pb-3">Duration</th>
                  <th className="pb-3 text-center">Productivity</th>
                  <th className="pb-3 text-center">Fatigue Risk</th>
                  <th className="pb-3">Keyboard Metrics</th>
                  <th className="pb-3">Mouse Metrics</th>
                  <th className="pb-3 pr-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] text-sm">
                {history.map((session) => (
                  <tr key={session.id} className="hover:bg-[var(--surface-muted)]/30 transition-colors">
                    <td className="py-4 pl-2">
                      <div className="font-bold text-[var(--foreground)] capitalize">
                        {session.role} - {session.task}
                      </div>
                      <div className="mt-1 text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
                        <Calendar size={12} className="text-[var(--text-muted)]" />
                        {formatDateTime(session.sessionStartAt)}
                      </div>
                    </td>
                    <td className="py-4 font-mono font-medium text-[var(--foreground)]">
                      {session.durationFormatted}
                    </td>
                    <td className="py-4 text-center">
                      <span className={`font-black text-base ${getProductivityColorClass(session.productivityScore)}`}>
                        {session.productivityScore}%
                      </span>
                    </td>
                    <td className="py-4 text-center">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${getFatigueBadgeClass(session.fatigueRisk)}`}>
                        {session.fatigueRisk}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="text-xs text-[var(--foreground)] flex items-center gap-1">
                        <Keyboard size={12} className="text-[var(--text-secondary)]" />
                        <span className="font-semibold">{session.totalKeystrokes ?? 0}</span> keys
                      </div>
                      <div className="mt-1 text-xs text-[var(--text-secondary)]">
                        {session.wordsPerMinute ?? 0} WPM | {session.backspaceCount ?? 0} backspaces
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="text-xs text-[var(--foreground)] flex items-center gap-1">
                        <MousePointer size={12} className="text-[var(--text-secondary)]" />
                        <span className="font-semibold">{session.mouseClicks ?? 0}</span> clicks
                      </div>
                      <div className="mt-1 text-xs text-[var(--text-secondary)] flex items-center gap-1.5 flex-wrap">
                        <span>{session.mouseDistance ?? 0}px dist</span>
                        <span className="text-[var(--border)]">|</span>
                        <span>Idle: {session.mouseIdleTime ?? 0}s</span>
                        {session.tabSwitchCount > 0 && (
                          <>
                            <span className="text-[var(--border)]">|</span>
                            <span className="text-amber-600 dark:text-amber-400 font-semibold">{session.tabSwitchCount} tabs</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-4 pr-2 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => downloadSessionCSV(session, `Session-${session.task}-${Date.now()}.csv`)}
                          className="rounded-lg p-1.5 text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)] transition"
                          title="Download CSV for this session"
                          type="button"
                        >
                          <Download size={16} />
                        </button>
                        <button
                          onClick={() => onDeleteSession(session.id)}
                          className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                          title="Delete session"
                          type="button"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile & Tablet Card View */}
          <div className="lg:hidden space-y-4">
            {history.map((session) => (
              <div
                key={session.id}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface-card)] p-4 space-y-3 shadow-sm hover:border-[var(--primary)]/30 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-black text-[var(--foreground)] capitalize">
                      {session.role} - {session.task}
                    </h3>
                    <p className="mt-0.5 text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
                      <Calendar size={12} className="text-[var(--text-muted)]" />
                      {formatDateTime(session.sessionStartAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => downloadSessionCSV(session, `Session-${session.task}-${Date.now()}.csv`)}
                      className="rounded-xl border border-[var(--border)] p-2 text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] transition"
                      title="Download CSV"
                      type="button"
                    >
                      <Download size={15} />
                    </button>
                    <button
                      onClick={() => onDeleteSession(session.id)}
                      className="rounded-xl border border-rose-100 p-2 text-rose-500 hover:bg-rose-50 dark:border-rose-900/30 dark:hover:bg-rose-950/40 transition"
                      title="Delete Session"
                      type="button"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-[var(--surface-muted)]/30 rounded-xl p-3 text-xs border border-[var(--border)]/55">
                  <div>
                    <span className="text-[var(--text-muted)] block text-[10px] uppercase font-semibold">Duration</span>
                    <span className="font-mono font-bold text-[var(--foreground)] text-sm flex items-center gap-1 mt-0.5">
                      <Clock size={12} className="text-[var(--text-secondary)]" />
                      {session.durationFormatted}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] block text-[10px] uppercase font-semibold">Productivity</span>
                    <span className={`font-black text-sm block mt-0.5 ${getProductivityColorClass(session.productivityScore)}`}>
                      {session.productivityScore}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] block text-[10px] uppercase font-semibold">Fatigue Risk</span>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.2 text-[10px] font-bold mt-1 ${getFatigueBadgeClass(session.fatigueRisk)}`}>
                      {session.fatigueRisk}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] block text-[10px] uppercase font-semibold">Tab Switches</span>
                    <span className="font-semibold block mt-0.5 text-[var(--foreground)]">
                      {session.tabSwitchCount ?? 0} switches
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div className="space-y-1">
                    <span className="text-[var(--text-muted)] font-medium flex items-center gap-1">
                      <Keyboard size={12} /> Keyboard
                    </span>
                    <p className="text-[var(--foreground)] font-semibold">{session.totalKeystrokes ?? 0} keystrokes</p>
                    <p className="text-[var(--text-secondary)] text-[11px]">{session.wordsPerMinute ?? 0} WPM | {session.backspaceCount ?? 0} backspaces</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[var(--text-muted)] font-medium flex items-center gap-1">
                      <MousePointer size={12} /> Mouse
                    </span>
                    <p className="text-[var(--foreground)] font-semibold">{session.mouseClicks ?? 0} clicks</p>
                    <p className="text-[var(--text-secondary)] text-[11px]">{session.mouseDistance ?? 0}px dist | Idle: {session.mouseIdleTime ?? 0}s</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
