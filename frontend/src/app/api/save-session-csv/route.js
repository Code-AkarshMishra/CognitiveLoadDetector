import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request) {
  try {
    const session = await request.json();
    if (!session) {
      return NextResponse.json({ error: "Session data is required" }, { status: 400 });
    }

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

    const row = [
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
    ];

    // Format row as CSV values with proper escaping
    const csvRow = row.map(val => {
      const str = String(val ?? "");
      if (/[",\n\r]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }).join(",");

    const csvContent = [headers.join(","), csvRow].join("\n");

    // Root directory path for saving session CSV files (.sessions is dot-prefixed and ignored by Next.js HMR)
    const dirPath = path.join(process.cwd(), ".sessions");
    
    // Ensure the folder exists
    await fs.mkdir(dirPath, { recursive: true });

    // File name
    const timestamp = Date.now();
    const filename = `Session-${session.task}-${timestamp}.csv`;
    const filePath = path.join(dirPath, filename);

    // Save the file
    await fs.writeFile(filePath, csvContent, "utf-8");

    return NextResponse.json({ 
      success: true, 
      message: "Session CSV saved successfully",
      filename,
      path: filePath 
    });
  } catch (error) {
    console.error("API Error in save-session-csv:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
