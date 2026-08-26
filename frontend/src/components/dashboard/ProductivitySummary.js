"use client";

import { useState } from "react";
import { 
  Activity, 
  BrainCircuit, 
  Clock3, 
  Gauge, 
  Monitor, 
  Sparkles, 
  Info, 
  Keyboard, 
  MousePointer, 
  Layers, 
  ShieldAlert,
  Flame,
  LineChart
} from "lucide-react";
import EvaluationCriteriaModal from "./EvaluationCriteriaModal";

export const CRITERIA_DETAILS = {
  student: {
    coding: {
      formula: "Productivity = (Keyboard * 0.40 + Mouse * 0.30 + FocusContinuity * 0.30) - DistractionPenalty - IdlePenalty",
      weights: { keyboard: 40, mouse: 30, focus: 30 },
      idleGrace: 120,
      expectedKeyboard: "Moderate typing activity (~12 WPM). Pauses are expected for thinking.",
      expectedMouse: "Moderate mouse usage (~15 events/min) for file switching and selection.",
      distractionImpact: "High. Focus is broken by switching tabs (-15 pts per tab switch).",
      description: "Student Coding is evaluated on active syntax writing, moderate cursor movements, and long thinking times.",
      scoring: [
        "Thinking pauses are normal up to 120s and do not penalize you immediately.",
        "Frequent tab switching suggests distraction and reduces productivity.",
        "Both typing and scrolling are weighted to measure problem-solving flow."
      ]
    },
    reading: {
      formula: "Productivity = (ScrollActivity * 0.65 + MouseClicks * 0.25 + Keyboard * 0.10) - DistractionPenalty - IdlePenalty",
      weights: { keyboard: 10, mouse: 65, focus: 25 },
      idleGrace: 180,
      expectedKeyboard: "Very low keyboard usage (~0-2 WPM) expected.",
      expectedMouse: "Consistent scrolling and highlighting actions (~15 events/min).",
      distractionImpact: "Very High. Switching tabs indicates distraction away from reading material (-20 pts per switch).",
      description: "Student Reading focuses on scrolling activity and stable visual attention without context-switching.",
      scoring: [
        "Scrolling and text selection are highly rewarded.",
        "Generous idle grace time of 180 seconds to allow quiet reading.",
        "High penalty for leaving the reading tab."
      ]
    },
    writing: {
      formula: "Productivity = (WPMScore * 0.50 + Keystrokes * 0.30 + Mouse * 0.20) - DistractionPenalty - IdlePenalty",
      weights: { keyboard: 80, mouse: 20, focus: 0 },
      idleGrace: 60,
      expectedKeyboard: "High continuous typing speed (~20 WPM) and key presses.",
      expectedMouse: "Low mouse activity expected (only for text editing/navigation).",
      distractionImpact: "Moderate. Tab switches disrupt drafting flow (-10 pts per switch).",
      description: "Student Writing demands active drafting, high typing speed, and low correction ratios.",
      scoring: [
        "Typing pace (WPM) is the primary driver of productivity.",
        "Low idle tolerance: pauses longer than 60s are penalized.",
        "Excessive backspaces raise fatigue warnings."
      ]
    },
    meeting: {
      formula: "Productivity = (SessionContinuity * 0.80 + Interaction * 0.20) - DistractionPenalty",
      weights: { keyboard: 5, mouse: 15, focus: 80 },
      idleGrace: 480,
      expectedKeyboard: "Extremely low keyboard usage expected.",
      expectedMouse: "Low mouse movement expected.",
      distractionImpact: "High. Tab hopping during a meeting implies multi-tasking or disengagement (-15 pts per switch).",
      description: "Student Meetings prioritize session continuity, listening focus, and low distraction.",
      scoring: [
        "Productivity is judged by keeping the tab active and visible.",
        "Idle timer has an extremely high grace period (480s).",
        "Active listening is assumed as long as tab focus is maintained."
      ]
    },
    designing: {
      formula: "Productivity = (MouseEvents * 0.70 + Keyboard * 0.10 + Focus * 0.20) - DistractionPenalty - IdlePenalty",
      weights: { keyboard: 10, mouse: 70, focus: 20 },
      idleGrace: 90,
      expectedKeyboard: "Low typing expected (mainly shortcuts and renaming).",
      expectedMouse: "Continuous mouse movement, dragging, and clicking (~60 events/min).",
      distractionImpact: "Moderate. Context switches reduce design flow (-10 pts per switch).",
      description: "Student Designing is judged by mouse movement density, canvas navigation, and tool usage.",
      scoring: [
        "Continuous mouse operations are highly valued.",
        "Short thinking intervals (90s grace) are permitted.",
        "Mouse idle time degrades focus scores quickly."
      ]
    },
    lecture: {
      formula: "Productivity = (ScreenFocusTime * 0.75 + NotesTaking * 0.25) - DistractionPenalty",
      weights: { keyboard: 25, mouse: 10, focus: 65 },
      idleGrace: 300,
      expectedKeyboard: "Low keyboard activity (used for taking periodic notes).",
      expectedMouse: "Minimal mouse interaction (full-screen focus).",
      distractionImpact: "Extreme. Leaving the lecture tab pauses learning and reduces focus (-20 pts per switch).",
      description: "Student Lecture watching rewards sustained video focus and sparse note-taking.",
      scoring: [
        "Focus continuity is key; tab switching is heavily penalized.",
        "Large idle grace period (300s) to accommodate video watching.",
        "Short keystroke bursts are recognized as note taking."
      ]
    },
    reporting: {
      formula: "Productivity = (WPMScore * 0.35 + Keystrokes * 0.25 + MouseClicks * 0.25 + Scroll * 0.15) - DistractionPenalty - IdlePenalty",
      weights: { keyboard: 60, mouse: 40, focus: 0 },
      idleGrace: 90,
      expectedKeyboard: "Steady, structured typing expected (~16 WPM).",
      expectedMouse: "Moderate clicking and scrolling to gather information.",
      distractionImpact: "Moderate. Context switching reduces structured progress (-10 pts per switch).",
      description: "Student Reporting represents structured document work, requiring balanced keyboard and mouse.",
      scoring: [
        "Moderate, stable typing and active mouse editing.",
        "Distractions count triggers standard focus penalties.",
        "Short idle grace (90s) for reviewing drafts."
      ]
    }
  },
  developer: {
    coding: {
      formula: "Productivity = (Keyboard * 0.45 + Mouse * 0.30 + FocusContinuity * 0.25) - DistractionPenalty - IdlePenalty",
      weights: { keyboard: 45, mouse: 30, focus: 25 },
      idleGrace: 150,
      expectedKeyboard: "Active typing bursts (~15 WPM) with short intervals.",
      expectedMouse: "Frequent navigation, clicking, and file switching (~25 events/min).",
      distractionImpact: "Very High. Blurs and tab hopping heavily impact coding focus (-15 pts per switch).",
      description: "Developer Coding requires active writing, frequent IDE navigation, and deep concentration.",
      scoring: [
        "Ample thinking grace time (150s) given for complex design thinking.",
        "Tab switches are penalized heavily as distractions.",
        "Keyboard intervals are closely monitored for fatigue indicator."
      ]
    },
    reading: {
      formula: "Productivity = (ScrollActivity * 0.70 + MouseClicks * 0.20 + Keyboard * 0.10) - DistractionPenalty - IdlePenalty",
      weights: { keyboard: 10, mouse: 70, focus: 20 },
      idleGrace: 180,
      expectedKeyboard: "Extremely low typing (~0 WPM) is expected.",
      expectedMouse: "Frequent scrolls, highlights, and documentation searches.",
      distractionImpact: "High. Focus loss on technical reading is heavily penalized (-15 pts per switch).",
      description: "Developer Reading focuses on reviewing documentation, PRs, and architectural texts.",
      scoring: [
        "Document scrolling and text selection are primary inputs.",
        "Low typing does not penalize reading productivity.",
        "Generous 180s idle grace to understand complex API docs."
      ]
    },
    writing: {
      formula: "Productivity = (WPMScore * 0.55 + Keystrokes * 0.25 + Mouse * 0.20) - DistractionPenalty - IdlePenalty",
      weights: { keyboard: 80, mouse: 20, focus: 0 },
      idleGrace: 90,
      expectedKeyboard: "Fast drafting typing speed (~25 WPM) and key entries.",
      expectedMouse: "Low mouse activity (navigation only).",
      distractionImpact: "Moderate. Tab switches reduce writing throughput (-10 pts per switch).",
      description: "Developer Writing targets specs writing, markdown documentation, or emails.",
      scoring: [
        "WPM and Keystroke count are heavily weighted.",
        "Typing intervals are checked for continuous flow.",
        "Pauses beyond 90s indicate disruption of drafting."
      ]
    },
    meeting: {
      formula: "Productivity = (SessionContinuity * 0.85 + Interaction * 0.15) - DistractionPenalty",
      weights: { keyboard: 5, mouse: 10, focus: 85 },
      idleGrace: 600,
      expectedKeyboard: "Extremely low keyboard usage expected.",
      expectedMouse: "Very low mouse activity expected.",
      distractionImpact: "Very High. Switching tabs or window focus suggests distraction from meeting discussion (-15 pts per switch).",
      description: "Developer Meetings measure active online presence, call participation, and screen visibility.",
      scoring: [
        "Productivity is determined by keeping the application active.",
        "Extremely high idle grace (600s) to watch screen shares.",
        "Tab blurs reduce focus score aggressively."
      ]
    },
    designing: {
      formula: "Productivity = (MouseEvents * 0.75 + Keyboard * 0.10 + Focus * 0.15) - DistractionPenalty - IdlePenalty",
      weights: { keyboard: 10, mouse: 75, focus: 15 },
      idleGrace: 90,
      expectedKeyboard: "Low typing expected (renaming layers, inputting dimensions).",
      expectedMouse: "Extremely high mouse tracking, dragging, and clicking (~80 events/min).",
      distractionImpact: "Moderate. Canvas distraction lowers flow (-10 pts per switch).",
      description: "Developer Designing evaluates layout planning, UI prototyping, and Figma interactions.",
      scoring: [
        "Continuous mouse movements and actions are highly rewarded.",
        "Short thinking intervals (90s grace) are normal.",
        "Low typing is expected and doesn't penalize score."
      ]
    },
    lecture: {
      formula: "Productivity = (ScreenFocusTime * 0.80 + NotesTaking * 0.20) - DistractionPenalty",
      weights: { keyboard: 20, mouse: 10, focus: 70 },
      idleGrace: 300,
      expectedKeyboard: "Low keyboard activity (used for periodic notes or coding along).",
      expectedMouse: "Minimal mouse interaction expected.",
      distractionImpact: "Extreme. Tab switches pause course learning (-20 pts per switch).",
      description: "Developer Lecture covers video learning, technical tutorials, and talks.",
      scoring: [
        "Session duration and screen focus are the primary indicators.",
        "Video watching is accommodated with 300s idle grace.",
        "Note-taking or code-along typing raises productivity."
      ]
    },
    reporting: {
      formula: "Productivity = (WPMScore * 0.40 + Keystrokes * 0.25 + MouseClicks * 0.20 + Scroll * 0.15) - DistractionPenalty - IdlePenalty",
      weights: { keyboard: 65, mouse: 35, focus: 0 },
      idleGrace: 90,
      expectedKeyboard: "Structured steady typing expected (~18 WPM).",
      expectedMouse: "Moderate clicks and scrolls for data collection.",
      distractionImpact: "Moderate. Tab switches reduce writing throughput (-10 pts per switch).",
      description: "Developer Reporting stands for status reports, Jira updates, and analytics.",
      scoring: [
        "Active documentation and reporting metrics are evaluated.",
        "Balanced typing speed and scroll activity.",
        "Idle grace is set to 90s."
      ]
    }
  }
};

const taskOptions = [
  { value: "coding", label: "Coding / Dev" },
  { value: "reading", label: "Reading / Research" },
  { value: "writing", label: "Writing / Doc" },
  { value: "meeting", label: "Meetings" },
  { value: "designing", label: "UI/UX Design" },
  { value: "lecture", label: "Video Learning" },
  { value: "reporting", label: "Report Work" },
];

export default function ProductivitySummary({
  role,
  task,
  standards,
  productivityScore,
  fatigueRisk,
  engagementState,
  browserStatus,
  sessionActive,
  formattedTime,
  keyboardMetrics,
  mouseMetrics,
  webcamMetrics,
  onRoleChange,
  onTaskChange,
  // New metrics props passed from page.js
  tabSwitchCount = 0,
  windowFocusChangeCount = 0,
  accumulatedIdleTime = 0,
  activeWorkingTime = 0,
  distractionScore = 0,
  focusPercentage = 0,
}) {
  const [modalOpen, setModalOpen] = useState(false);

  const statusCopy = sessionActive
    ? "Real-time metrics are feeding into your role-specific productivity engine."
    : "Select your role and task context, then start a session to monitor focus.";

  const insight = getInsight({
    sessionActive,
    productivityScore,
    keyboardMetrics,
    mouseMetrics,
    distractionScore,
  });

  const cameraInfo = webcamMetrics.cameraActive
    ? "Webcam sensor is active for mental fatigue snap checks."
    : webcamMetrics.lastCaptureReason
    ? `Last fatigue check: ${webcamMetrics.lastCaptureReason}.`
    : "Camera analysis runs periodically once session starts.";

  return (
    <section className="space-y-6">
      
      {/* 1. Primary User Metrics Grid (Animated Radial Gauges & Glowing Themes) */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Productivity Circular Radial Gauge Card */}
        <article className="surface-card p-6 rounded-3xl border border-[var(--border)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 shadow-lg flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mb-2">
              <Gauge size={20} />
            </span>
            <p className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">
              Productivity
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              {sessionActive ? "Live Focus Gauge" : "Start session"}
            </p>
          </div>

          <RadialProgressGauge
            percentage={sessionActive ? productivityScore : 0}
            textValue={sessionActive ? `${productivityScore}%` : "--"}
            colorClass={sessionActive ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" : "text-slate-600"}
          />
        </article>

        {/* Fatigue Risk Dynamic Theme Card */}
        <article className={`surface-card p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col justify-between ${
          !sessionActive 
            ? "border-[var(--border)]" 
            : fatigueRisk === "High" || fatigueRisk === "Critical"
            ? "border-rose-500/40 bg-gradient-to-br from-rose-950/40 to-slate-950 shadow-rose-500/10"
            : fatigueRisk === "Elevated" || fatigueRisk === "Watch"
            ? "border-amber-500/40 bg-gradient-to-br from-amber-950/40 to-slate-950 shadow-amber-500/10"
            : "border-emerald-500/40 bg-gradient-to-br from-emerald-950/40 to-slate-950 shadow-emerald-500/10"
        }`}>
          <div className="flex items-center justify-between">
            <span className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${
              !sessionActive
                ? "bg-slate-800 text-slate-400 border-slate-700"
                : fatigueRisk === "High" || fatigueRisk === "Critical"
                ? "bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse"
                : fatigueRisk === "Elevated"
                ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                : "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
            }`}>
              <BrainCircuit size={20} />
            </span>
            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border ${
              !sessionActive
                ? "bg-slate-800/80 text-slate-400 border-slate-700"
                : fatigueRisk === "High" || fatigueRisk === "Critical"
                ? "bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse"
                : fatigueRisk === "Elevated"
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
            }`}>
              {sessionActive ? fatigueRisk : "Standby"}
            </span>
          </div>

          <div className="mt-4">
            <p className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">
              Fatigue Risk Level
            </p>
            <p className={`mt-1 text-2xl font-black tracking-tight ${
              !sessionActive
                ? "text-[var(--foreground)]"
                : fatigueRisk === "High" || fatigueRisk === "Critical"
                ? "text-rose-400"
                : fatigueRisk === "Elevated"
                ? "text-amber-400"
                : "text-emerald-400"
            }`}>
              {sessionActive ? fatigueRisk : "--"}
            </p>
          </div>
        </article>

        {/* Session Timer Card */}
        <article className="surface-card p-6 rounded-3xl border border-[var(--border)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Clock3 size={20} />
            </span>
            {sessionActive && (
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-ping" />
                Active
              </span>
            )}
          </div>

          <div className="mt-4">
            <p className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">
              Session Time
            </p>
            <p className="mt-1 text-2xl font-black tracking-tight text-blue-400 font-mono">
              {formattedTime || "00:00:00"}
            </p>
          </div>
        </article>

        {/* Active Mode & Quick Context Switcher Card */}
        <article className="surface-card p-6 rounded-3xl border border-[var(--border)] transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/30 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Monitor size={20} />
            </span>
            <button
              type="button"
              onClick={() => onRoleChange(role === "student" ? "developer" : "student")}
              className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 hover:bg-teal-500/20 transition cursor-pointer"
            >
              Switch Role
            </button>
          </div>

          <div className="mt-4">
            <p className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">
              Active Context
            </p>
            <p className="mt-1 text-lg font-black text-teal-400 truncate">
              {role ? `${role.charAt(0).toUpperCase() + role.slice(1)}` : "Student"} • {task ? task.toUpperCase() : "CODING"}
            </p>
          </div>
        </article>
      </div>

      {/* 2. Clean Focus Assistant & Insights Banner */}
      <div className="surface-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex gap-4 items-start">
          <span className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
            <Sparkles size={22} />
          </span>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              AI Focus Assistant • {role ? role.toUpperCase() : "STUDENT"} MODE ({task ? task.toUpperCase() : "CODING"})
            </p>
            <h4 className="mt-1 text-base font-extrabold text-[var(--foreground)]">
              {insight.title}
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)] max-w-2xl">
              {insight.body}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4 text-xs text-[var(--text-secondary)] dark:border-slate-800 dark:bg-slate-950/40 shrink-0 min-w-[220px]">
          <div className="flex items-center gap-2">
            <div className={`h-2.5 w-2.5 rounded-full ${webcamMetrics.cameraActive ? "bg-emerald-400 animate-ping" : "bg-slate-500"}`} />
            <span className="font-bold text-[var(--foreground)]">Fatigue Sensor</span>
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed">{cameraInfo}</p>
        </div>
      </div>

      {/* Criteria Details Popup Modal */}
      <EvaluationCriteriaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        role={role}
        task={task}
        criteriaDetails={CRITERIA_DETAILS}
      />

    </section>
  );
}

function OverviewCard({ icon: Icon, title, value, note, theme = "emerald" }) {
  const themeStyles = {
    emerald: {
      border: "hover:border-emerald-500/30 hover:shadow-emerald-500/5",
      iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10",
      text: "text-emerald-600 dark:text-emerald-400"
    },
    amber: {
      border: "hover:border-amber-500/30 hover:shadow-amber-500/5",
      iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/10",
      text: "text-amber-600 dark:text-amber-400"
    },
    rose: {
      border: "hover:border-rose-500/30 hover:shadow-rose-500/5",
      iconBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/10",
      text: "text-rose-600 dark:text-rose-400"
    },
    sky: {
      border: "hover:border-sky-500/30 hover:shadow-sky-500/5",
      iconBg: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/10",
      text: "text-sky-600 dark:text-sky-400"
    },
    blue: {
      border: "hover:border-blue-500/30 hover:shadow-blue-500/5",
      iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/10",
      text: "text-blue-600 dark:text-blue-400"
    },
    gray: {
      border: "hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-slate-500/5",
      iconBg: "bg-[var(--surface-muted)] text-[var(--text-secondary)] border border-[var(--border)] dark:bg-slate-800/80 dark:text-slate-400 dark:border-slate-700/10",
      text: "text-[var(--foreground)]"
    }
  }[theme] || {
    border: "hover:border-[var(--border-strong)]",
    iconBg: "bg-[var(--surface-muted)] text-[var(--text-secondary)]",
    text: "text-[var(--foreground)]"
  };

  return (
    <article className={`surface-card p-5 transition-all duration-300 hover:-translate-y-1 ${themeStyles.border}`}>
      <div className="flex items-center gap-3">
        <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${themeStyles.iconBg}`}>
          <Icon size={18} />
        </span>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">
            {title}
          </p>
          <p className={`mt-1.5 text-2xl font-black ${themeStyles.text}`}>
            {value}
          </p>
        </div>
      </div>
      <p className="mt-3.5 text-xs text-[var(--text-secondary)]">
        {note}
      </p>
    </article>
  );
}

function ScorecardBox({ title, value, icon: Icon, theme = "gray" }) {
  const themeStyles = {
    emerald: "border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 shadow-sm shadow-emerald-500/5",
    amber: "border-amber-500/20 bg-amber-500/5 text-amber-700 dark:text-amber-400 shadow-sm shadow-amber-500/5",
    sky: "border-sky-500/20 bg-sky-500/5 text-sky-700 dark:text-sky-400 shadow-sm shadow-sky-500/5",
    rose: "border-rose-500/20 bg-rose-500/5 text-rose-700 dark:text-rose-400 shadow-sm shadow-rose-500/5",
    purple: "border-purple-500/20 bg-purple-500/5 text-purple-700 dark:text-purple-400 shadow-sm shadow-purple-500/5",
    teal: "border-teal-500/20 bg-teal-500/5 text-teal-700 dark:text-teal-400 shadow-sm shadow-teal-500/5",
    gray: "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] dark:border-slate-800 dark:bg-slate-950/40 dark:text-white"
  }[theme] || "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] dark:border-slate-800 dark:bg-slate-950/40 dark:text-white";

  const iconColor = {
    emerald: "text-emerald-600 dark:text-emerald-400",
    amber: "text-amber-600 dark:text-amber-400",
    sky: "text-sky-600 dark:text-sky-400",
    rose: "text-rose-600 dark:text-rose-400",
    purple: "text-purple-600 dark:text-purple-400",
    teal: "text-teal-600 dark:text-teal-400",
    gray: "text-slate-400 dark:text-slate-500"
  }[theme] || "text-slate-400 dark:text-slate-500";

  return (
    <div className={`rounded-xl border p-3 flex flex-col justify-between h-20 transition-all duration-300 hover:scale-[1.03] ${themeStyles}`}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-extrabold uppercase tracking-wider truncate mr-1 text-[var(--text-secondary)]">
          {title}
        </span>
        <Icon size={12} className={`shrink-0 ${iconColor}`} />
      </div>
      <p className="text-lg font-black tracking-tight mt-1">
        {value}
      </p>
    </div>
  );
}

function getInsight({ sessionActive, productivityScore, keyboardMetrics, mouseMetrics, distractionScore }) {
  if (!sessionActive) {
    return {
      title: "Engine Standby",
      body: "Choose your context above, then start analysis. We'll dynamically track interaction profiles, typing speeds, and context shifts.",
      mini: "Start a session to see live guidance.",
    };
  }

  if (distractionScore > 40) {
    return {
      title: "High Context Switching",
      body: "Frequent tab switches or window unfocuses detected. Try focusing on a single tool to recover productivity speed.",
      mini: "Minimize tab hops to boost scoring.",
    };
  }

  if (productivityScore >= 80) {
    return {
      title: "Flow State Detected",
      body: "Excellent rhythm. Your keyboard input and mouse engagement perfectly match the criteria profile. Keep going!",
      mini: "You are in a highly productive zone.",
    };
  }

  if (mouseMetrics.idleTime > 60 && keyboardMetrics.wordsPerMinute < 3) {
    return {
      title: "Extended Quiet Time",
      body: "Very low keyboard and mouse activity. If you're reading or in a meeting, this is normal. Otherwise, a short reset break might refresh you.",
      mini: "A break may improve your next focus period.",
    };
  }

  return {
    title: "Balanced Pacing",
    body: "Sustained moderate activity. Keep maintaining this pace and avoid side tasks or quick tab switches to avoid distraction penalties.",
    mini: "Maintain your current pace and avoid distractions.",
  };
}

function RadialProgressGauge({ percentage = 0, size = 95, strokeWidth = 8, colorClass = "text-emerald-400", textValue }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const numericVal = Math.min(100, Math.max(0, Number(percentage) || 0));
  const strokeDashoffset = circumference - (numericVal / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center shrink-0">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-800/60 fill-transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`fill-transparent transition-all duration-700 ease-out ${colorClass}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-lg font-black tracking-tight text-[var(--foreground)]">
          {textValue !== undefined ? textValue : `${numericVal}%`}
        </span>
      </div>
    </div>
  );
}
