/**
 * Utility to format and trigger download of CSV files.
 */

/**
 * Format and download a single session summary as a CSV.
 * @param {Object} session The session summary data
 * @param {string} filename Name of the file to save
 */
export function downloadSessionCSV(session, filename) {
  if (!session) return;

  const headers = [
    "Session ID",
    "Date & Time",
    "Role",
    "Task",
    "Duration (Seconds)",
    "Duration (Formatted)",
    "Productivity Score (%)",
    "Fatigue Risk",
    "Engagement State",
    "Total Keystrokes",
    "Backspace Count",
    "Typing Speed (WPM)",
    "Avg Key Interval (ms)",
    "Mouse Clicks",
    "Mouse Distance (px)",
    "Mouse Speed (px/ms)",
    "Mouse Idle Time (Seconds)",
    "Tab Switches",
    "Window Focus Changes",
    "Webcam Snapshots",
  ];

  const rows = [
    [
      session.id || "",
      session.sessionStartAt ? new Date(session.sessionStartAt).toLocaleString() : "",
      session.role || "",
      session.task || "",
      session.durationSeconds ?? 0,
      session.durationFormatted || "",
      session.productivityScore ?? 0,
      session.fatigueRisk || "",
      session.engagementState || "",
      session.totalKeystrokes ?? 0,
      session.backspaceCount ?? 0,
      session.wordsPerMinute ?? 0,
      session.averageInterval ?? 0,
      session.mouseClicks ?? 0,
      session.mouseDistance ?? 0,
      session.mouseSpeed ?? 0,
      session.mouseIdleTime ?? 0,
      session.tabSwitchCount ?? 0,
      session.windowFocusChangeCount ?? 0,
      session.webcamSnapshots ?? 0,
    ]
  ];

  downloadCSV(headers, rows, filename);
}

/**
 * Format and download a list of sessions as a CSV.
 * @param {Array<Object>} sessions List of session summary objects
 * @param {string} filename Name of the file to save
 */
export function downloadHistoryCSV(sessions, filename) {
  if (!sessions || !sessions.length) return;

  const headers = [
    "Session ID",
    "Start Time",
    "End Time",
    "Role",
    "Task",
    "Duration (Seconds)",
    "Duration (Formatted)",
    "Productivity Score (%)",
    "Fatigue Risk",
    "Engagement State",
    "Total Keystrokes",
    "Backspace Count",
    "Typing Speed (WPM)",
    "Avg Key Interval (ms)",
    "Mouse Clicks",
    "Mouse Distance (px)",
    "Mouse Speed (px/ms)",
    "Mouse Idle Time (Seconds)",
    "Tab Switches",
    "Window Focus Changes",
    "Webcam Snapshots",
  ];

  const rows = sessions.map((session) => [
    session.id || "",
    session.sessionStartAt ? new Date(session.sessionStartAt).toISOString() : "",
    session.sessionEndAt ? new Date(session.sessionEndAt).toISOString() : "",
    session.role || "",
    session.task || "",
    session.durationSeconds ?? 0,
    session.durationFormatted || "",
    session.productivityScore ?? 0,
    session.fatigueRisk || "",
    session.engagementState || "",
    session.totalKeystrokes ?? 0,
    session.backspaceCount ?? 0,
    session.wordsPerMinute ?? 0,
    session.averageInterval ?? 0,
    session.mouseClicks ?? 0,
    session.mouseDistance ?? 0,
    session.mouseSpeed ?? 0,
    session.mouseIdleTime ?? 0,
    session.tabSwitchCount ?? 0,
    session.windowFocusChangeCount ?? 0,
    session.webcamSnapshots ?? 0,
  ]);

  downloadCSV(headers, rows, filename);
}

/**
 * Base helper to generate and trigger the download of CSV content
 */
function downloadCSV(headers, rows, filename) {
  const csvContent = [
    headers.join(","),
    ...rows.map(row => 
      row.map(val => {
        const str = String(val ?? "");
        // Escape quotes, commas, and newlines
        if (/[",\n\r]/.test(str)) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      }).join(",")
    )
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
