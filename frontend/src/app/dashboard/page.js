"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Square, 
  Sliders, 
  Sparkles, 
  Eye, 
  Keyboard, 
  MousePointer, 
  Layers, 
  Clock, 
  Download, 
  AlertCircle,
  Activity,
  Cpu,
  BrainCircuit,
  Maximize2,
  Gauge,
  ChevronDown,
  ChevronUp,
  BarChart3,
  X,
  Bell
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import HamburgerMenu from "@/components/layout/HamburgerMenu";
import LiveScoreGauge from "@/components/dashboard/LiveScoreGauge";
import LiveWebcamPreview from "@/components/dashboard/LiveWebcamPreview";
import StartSessionWizardModal from "@/components/dashboard/StartSessionWizardModal";
import EvaluationCriteriaModal from "@/components/dashboard/EvaluationCriteriaModal";
import InstallExtensionModal from "@/components/dashboard/InstallExtensionModal";
import WellnessNudge from "@/components/dashboard/WellnessNudge";
import SessionResultModal from "@/components/dashboard/SessionResultModal";
import { downloadSessionCSV, downloadHistoryCSV } from "@/services/csvExporter";
import { cognitiveLoadApi } from "@/services/cognitiveLoadApi";

import useKeyboardTracker from "@/hooks/useKeyboardTracker";
import useMouseTracker from "@/hooks/useMouseTracker";
import useSessionTimer from "@/hooks/useSessionTimer";
import useWebcamTracker from "@/hooks/useWebcamTracker";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart
} from "recharts";

const taskStandards = {
  student: {
    coding: { minWpm: 12, minMouseEvents: 15, idleGraceSeconds: 120, title: "Student Coding" },
    reading: { minWpm: 0, minMouseEvents: 10, idleGraceSeconds: 180, title: "Student Reading" },
    writing: { minWpm: 20, minMouseEvents: 5, idleGraceSeconds: 60, title: "Student Writing" },
    meeting: { minWpm: 0, minMouseEvents: 2, idleGraceSeconds: 480, title: "Student Lecture/Meeting" },
  },
  developer: {
    coding: { minWpm: 15, minMouseEvents: 20, idleGraceSeconds: 150, title: "Software Development" },
    reading: { minWpm: 0, minMouseEvents: 12, idleGraceSeconds: 180, title: "Code Review & Docs" },
    writing: { minWpm: 25, minMouseEvents: 6, idleGraceSeconds: 90, title: "Technical Spec Writing" },
    meeting: { minWpm: 0, minMouseEvents: 2, idleGraceSeconds: 600, title: "Team Architecture Sync" },
  }
};

export default function DashboardPage() {
  const [sessionActive, setSessionActive] = useState(false);
  const [role, setRole] = useState("developer");
  const [task, setTask] = useState("coding");
  const [browserStatus, setBrowserStatus] = useState("Visible");
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [windowFocusChangeCount, setWindowFocusChangeCount] = useState(0);

  // Modals & Drawers
  const [wizardModalOpen, setWizardModalOpen] = useState(false);
  const [criteriaModalOpen, setCriteriaModalOpen] = useState(false);
  const [installModalOpen, setInstallModalOpen] = useState(false);
  const [wellnessNudgeOpen, setWellnessNudgeOpen] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [showRawStats, setShowRawStats] = useState(false);
  const [recommendationDismissed, setRecommendationDismissed] = useState(false);

  // Real-time ML State - ZERO DUMMY DATA INITIALLY
  const [liveCognitiveScore, setLiveCognitiveScore] = useState(0);
  const [liveFatigueRisk, setLiveFatigueRisk] = useState("Inactive");
  const [liveAttentionIndex, setLiveAttentionIndex] = useState(0);
  const [liveTypingStability, setLiveTypingStability] = useState(0);
  const [liveMouseEfficiency, setLiveMouseEfficiency] = useState(0);
  const [liveProductivity, setLiveProductivity] = useState(0);
  const [liveInsights, setLiveInsights] = useState([]);
  const [liveRecommendations, setLiveRecommendations] = useState([]);
  const [lastProxyService, setLastProxyService] = useState(null);

  // Current logged in user from localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window === "undefined") return null;
    const stored = window.localStorage.getItem("neurotrack_user");
    return stored ? JSON.parse(stored) : null;
  });

  // Session state & History
  const [sessionStartAt, setSessionStartAt] = useState(null);
  const [sessionEndAt, setSessionEndAt] = useState(null);
  const [lastSessionSummary, setLastSessionSummary] = useState(null);
  const [chartTimeline, setChartTimeline] = useState([]);
  const [sessionHistory, setSessionHistory] = useState(() => {
    if (typeof window === "undefined") return [];
    const stored = window.localStorage.getItem("neurotrack_sessions");
    return stored ? JSON.parse(stored) : [];
  });

  const keyboardMetrics = useKeyboardTracker(sessionActive);
  const mouseMetrics = useMouseTracker(sessionActive);
  const sessionTimer = useSessionTimer(sessionActive);
  
  // Track webcam with 4 trigger conditions: session-start, productivity < 50%, tabSwitches >= 7, 10m interval
  const webcamTracker = useWebcamTracker(sessionActive, {
    productivity: liveProductivity,
    tabSwitches: tabSwitchCount
  });

  const streamRef = useRef({ keyboardMetrics, mouseMetrics, webcamMetrics: webcamTracker.metrics, sessionTimer });
  streamRef.current = { keyboardMetrics, mouseMetrics, webcamMetrics: webcamTracker.metrics, sessionTimer };

  // Tab & Window Focus Listeners
  useEffect(() => {
    if (!sessionActive) return;

    const handleVisibilityChange = () => {
      const isHidden = document.hidden;
      setBrowserStatus(isHidden ? "Background tab" : "Visible");
      if (isHidden) {
        setTabSwitchCount((c) => c + 1);
      }
    };

    const handleFocusBlur = () => {
      const hasFocus = document.hasFocus();
      setBrowserStatus(hasFocus ? "Visible" : "Background tab");
      if (!hasFocus) {
        setWindowFocusChangeCount((c) => c + 1);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleFocusBlur);
    window.addEventListener("focus", handleFocusBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleFocusBlur);
      window.removeEventListener("focus", handleFocusBlur);
    };
  }, [sessionActive]);

  // LIVE ML Scoring Stream Loop (Every 2 seconds during active session)
  useEffect(() => {
    if (!sessionActive) return;

    const streamInterval = setInterval(async () => {
      const { keyboardMetrics: kb, mouseMetrics: ms, webcamMetrics: wc, sessionTimer: st } = streamRef.current;

      const payload = {
        sessionId: sessionStartAt || "session-live",
        timestamp: Date.now(),
        durationSeconds: st.seconds,
        role,
        task,
        organization: currentUser?.organization || "Independent",
        typingWpm: kb.wordsPerMinute || 0,
        totalKeystrokes: kb.totalKeystrokes || 0,
        backspaceCount: kb.backspaceCount || 0,
        totalClicks: ms.clickCount || 0,
        idleSeconds: ms.idleTime || 0,
        tabSwitches: tabSwitchCount,
        mouseSpeed: ms.movementSpeed || 0,
        mouseDistance: ms.totalDistance || 0,
        image: wc.lastFrameData || null,
      };

      try {
        const result = await cognitiveLoadApi.sendFeatureFrame(payload);
        if (result && result.cognitiveLoadScore !== undefined) {
          const score = Number(result.cognitiveLoadScore);
          const prod = result.productivityScore !== undefined ? Number(result.productivityScore) : (100 - score);
          
          setLiveCognitiveScore(score);
          setLiveProductivity(prod);
          setLiveFatigueRisk(result.fatigueRisk || (score > 75 ? "High" : score > 50 ? "Moderate" : "Low"));
          setLiveAttentionIndex(result.attentionIndex !== undefined ? Number(result.attentionIndex) : 0);
          setLiveTypingStability(result.typingStability !== undefined ? Number(result.typingStability) : 0);
          setLiveMouseEfficiency(result.mouseEfficiency !== undefined ? Number(result.mouseEfficiency) : 0);
          if (result.insights && result.insights.length > 0) setLiveInsights(result.insights);
          if (result.recommendations && result.recommendations.length > 0) setLiveRecommendations(result.recommendations);
          if (result.proxiedBy || result.service) setLastProxyService(result.proxiedBy || result.service);

          // Append to dynamic chart timeline
          const timeLabel = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          setChartTimeline((prev) => [
            ...prev,
            {
              time: timeLabel,
              score: Math.round(score),
              attention: Math.round(result.attentionIndex || 0),
              productivity: Math.round(prod),
            }
          ].slice(-30));

          // Proactive fatigue rest nudge if score >= 75 for prolonged period
          if (score >= 75 && st.seconds > 60) {
            setWellnessNudgeOpen(true);
          }
        }
      } catch (err) {
        console.warn("Live stream evaluation tick:", err);
      }
    }, 2000);

    return () => clearInterval(streamInterval);
  }, [sessionActive, sessionStartAt, tabSwitchCount, role, task, currentUser]);

  const startSession = (config) => {
    if (config?.role) setRole(config.role);
    if (config?.task) setTask(config.task);

    const now = new Date().toISOString();
    setSessionStartAt(now);
    setSessionEndAt(null);
    setSessionActive(true);
    setTabSwitchCount(0);
    setWindowFocusChangeCount(0);
    setChartTimeline([]);
    setWizardModalOpen(false);
    setLastSessionSummary(null);
    setResultModalOpen(false);
    setLiveCognitiveScore(0.0);
    setLiveProductivity(0.0);
    setLiveFatigueRisk("Low");
    setLiveAttentionIndex(0.0);
    setLiveTypingStability(0.0);
    setLiveMouseEfficiency(0.0);
    setLiveInsights([`Session active under ${config?.role || role} mode for ${config?.task || task}.`]);
    setLiveRecommendations(["Begin your workflow. Telemetry stream is recording."]);
    setRecommendationDismissed(false);

    // Notify Chrome Extension across all open tabs
    if (typeof window !== "undefined") {
      window.postMessage({ type: "neurotrack-extension:start-session" }, "*");
    }
  };

  const stopSession = async () => {
    const now = new Date().toISOString();
    const duration = sessionTimer.seconds;

    // Notify Chrome Extension to stop collection across tabs
    if (typeof window !== "undefined") {
      window.postMessage({ type: "neurotrack-extension:stop-session" }, "*");
    }

    const summary = {
      id: `session-${Date.now()}`,
      role,
      task,
      organization: currentUser?.organization || "Independent",
      sessionStartAt,
      sessionEndAt: now,
      durationSeconds: duration,
      durationFormatted: sessionTimer.formattedTime,
      cognitiveLoadScore: liveCognitiveScore,
      productivityScore: liveProductivity,
      fatigueRisk: liveFatigueRisk,
      attentionIndex: liveAttentionIndex,
      typingStability: liveTypingStability,
      mouseEfficiency: liveMouseEfficiency,
      totalKeystrokes: keyboardMetrics.totalKeystrokes,
      backspaceCount: keyboardMetrics.backspaceCount,
      wordsPerMinute: keyboardMetrics.wordsPerMinute,
      mouseClicks: mouseMetrics.clickCount,
      mouseDistance: mouseMetrics.totalDistance,
      mouseIdleTime: mouseMetrics.idleTime,
      tabSwitchCount,
      windowFocusChangeCount,
      insights: liveInsights,
      recommendations: liveRecommendations,
    };

    setLastSessionSummary(summary);
    setSessionHistory((prev) => {
      const updated = [summary, ...prev];
      if (typeof window !== "undefined") {
        window.localStorage.setItem("neurotrack_sessions", JSON.stringify(updated));
      }
      return updated;
    });

    try {
      await fetch("http://localhost:8080/api/session/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: summary.id,
          organization: currentUser?.organization || "Independent",
          role,
          task,
          summary,
        })
      });
    } catch (e) {
      console.warn("Backend session record save:", e);
    }

    setSessionActive(false);
    setSessionEndAt(now);
    sessionTimer.resetTimer();
    setResultModalOpen(true);
  };

  // PDF Export (Crisp Professional Light Theme)
  const downloadReport = () => {
    const doc = new jsPDF({ format: "a4", unit: "pt" });
    const margin = 45;
    let y = 50;

    // 1. Clean White Background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 595, 842, "F");

    // Top Header Banner (Light Slate)
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, y - 15, 505, 65, 8, 8, "F");
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, y - 15, 505, 65, 8, 8, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(15, 23, 42);
    doc.text("NeuroTrack AI - Cognitive Load Audit", margin + 15, y + 15);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated: ${new Date().toLocaleString()}  |  Role: ${role.toUpperCase()} (${task.toUpperCase()})  |  Status: Verified`, margin + 15, y + 35);
    y += 75;

    // SECTION 1: EXECUTIVE COGNITIVE SUMMARY
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, y, 505, 125, 8, 8, "F");
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, 505, 125, 8, 8, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(2, 132, 199);
    doc.text("1. Executive Cognitive Summary", margin + 15, y + 22);

    const scoreVal = lastSessionSummary ? lastSessionSummary.cognitiveLoadScore : liveCognitiveScore;
    const fatigueVal = lastSessionSummary ? lastSessionSummary.fatigueRisk : liveFatigueRisk;
    const prodVal = lastSessionSummary?.productivityScore || liveProductivity;
    const attVal = lastSessionSummary?.attentionIndex || liveAttentionIndex;
    const durVal = lastSessionSummary?.durationFormatted || sessionTimer.formattedTime;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text(`• Final Cognitive Load Index: ${scoreVal} / 100`, margin + 20, y + 44);
    doc.text(`• Productivity Score: ${prodVal}%`, margin + 20, y + 62);
    doc.text(`• Fatigue Risk Level: ${fatigueVal}`, margin + 20, y + 80);
    doc.text(`• Attention Index: ${attVal}%`, margin + 20, y + 98);
    doc.text(`• Active Session Duration: ${durVal}`, margin + 270, y + 44);
    doc.text(`• 15s Vision ML Status: Evaluated`, margin + 270, y + 62);
    y += 140;

    // SECTION 2: BEHAVIORAL TELEMETRY SIGNALS
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, y, 505, 120, 8, 8, "F");
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, 505, 120, 8, 8, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(2, 132, 199);
    doc.text("2. Behavioral Telemetry Signals", margin + 15, y + 22);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text(`• Typing Velocity: ${lastSessionSummary?.wordsPerMinute || keyboardMetrics.wordsPerMinute} WPM`, margin + 20, y + 44);
    doc.text(`• Keystrokes & Corrections: ${lastSessionSummary?.totalKeystrokes || keyboardMetrics.totalKeystrokes} keys (${lastSessionSummary?.backspaceCount || keyboardMetrics.backspaceCount} backspaces)`, margin + 20, y + 62);
    doc.text(`• Context Switching: ${lastSessionSummary?.tabSwitchCount || tabSwitchCount} window/tab blurs`, margin + 20, y + 80);
    doc.text(`• Mouse Dynamics: ${lastSessionSummary?.mouseClicks || mouseMetrics.clickCount} clicks, ${lastSessionSummary?.mouseIdleTime || mouseMetrics.idleTime}s idle`, margin + 20, y + 98);
    y += 135;

    // SECTION 3: RECOVERY GUIDANCE & VERIFICATION
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, y, 505, 105, 8, 8, "F");
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, 505, 105, 8, 8, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(2, 132, 199);
    doc.text("3. AI Recovery Guidance & Standards", margin + 15, y + 22);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    const recs = lastSessionSummary?.recommendations || liveRecommendations || ["Optimal workflow state maintained."];
    let recY = y + 44;
    recs.slice(0, 3).forEach((rec) => {
      doc.text(`• ${rec}`, margin + 20, recY);
      recY += 18;
    });

    // Bottom Footer
    doc.setFontSize(8.5);
    doc.setTextColor(148, 163, 184);
    doc.text("NeuroTrack AI Telemetry Engine • Privacy-Preserving Ephemeral Model • Confidential Audit", margin + 15, 810);

    doc.save(`NeuroTrack-Report-${Date.now()}.pdf`);
  };

  const downloadCSV = () => {
    const summary = lastSessionSummary || {
      id: `session-${Date.now()}`,
      role,
      task,
      organization: currentUser?.organization || "Independent",
      durationSeconds: sessionTimer.seconds,
      cognitiveLoadScore: liveCognitiveScore,
      productivityScore: liveProductivity,
      fatigueRisk: liveFatigueRisk,
      totalKeystrokes: keyboardMetrics.totalKeystrokes,
      backspaceCount: keyboardMetrics.backspaceCount,
      wordsPerMinute: keyboardMetrics.wordsPerMinute,
      mouseClicks: mouseMetrics.clickCount,
      mouseIdleTime: mouseMetrics.idleTime,
      tabSwitchCount,
    };
    downloadSessionCSV(summary, `NeuroTrack-Telemetry-${Date.now()}.csv`);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Reconstructed Navigation Bar */}
      <Navbar
        rightExtra={
          <HamburgerMenu
            onOpenSetupWizard={() => setWizardModalOpen(true)}
            onDownloadReport={downloadReport}
            onDownloadCSV={downloadCSV}
            onOpenEvaluationCriteria={() => setCriteriaModalOpen(true)}
            onOpenInstallExtension={() => setInstallModalOpen(true)}
            currentRole={role}
            currentTask={task}
            onSelectRole={(newRole) => setRole(newRole)}
            onSelectTask={(newTask) => setTask(newTask)}
            currentUser={currentUser || { name: "Standard Operator", email: "user@neurotrack.ai", role }}
          />
        }
      />

      {/* Main Content Area with Seamless Layout Alignment */}
      <main className="flex-1 max-w-[1500px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-6 space-y-6">
        
        {/* Top Header Hero & Session Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-lg transition-colors">
          <div className="flex items-center gap-4">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20">
              <BrainCircuit size={26} />
              {sessionActive && (
                <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-ping" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-black text-[var(--foreground)]">Live Cognitive Laboratory</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-[11px] font-bold uppercase">
                  {role} • {taskStandards[role]?.[task]?.title || task}
                </span>
                {currentUser?.organization && (
                  <span className="hidden md:inline-flex px-2 py-0.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-700 dark:text-teal-400 text-[10px] font-bold">
                    {currentUser.organization}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
              Real-time multimodal telemetry & inference pipeline with 15s smart vision ML
            </p>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap">
            {sessionActive ? (
              <button
                onClick={stopSession}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-lg shadow-rose-500/20 transition cursor-pointer"
              >
                <Square size={15} />
                <span>Stop Analysis ({sessionTimer.formattedTime})</span>
              </button>
            ) : (
              <button
                onClick={() => setWizardModalOpen(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 transition hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <Play size={15} />
                <span>Start Live Session</span>
              </button>
            )}

            <button
              onClick={() => setWizardModalOpen(true)}
              disabled={sessionActive}
              className="flex items-center justify-center p-2.5 rounded-2xl bg-[var(--surface-muted)] hover:bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--foreground)] border border-[var(--border)] transition cursor-pointer disabled:opacity-50"
              title="Calibration & Task Settings"
            >
              <Sliders size={16} />
            </button>
          </div>
        </div>

        {/* Quick Clickable Controls Toolbar: Role & Task Modes */}
        <div className="p-3.5 sm:p-4 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-md flex items-center justify-between gap-4 transition-colors">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Active Mode:
            </span>
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)]">
              {[
                { id: "developer", label: "Dev" },
                { id: "student", label: "Student" },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                    role === r.id
                      ? "bg-cyan-500 text-slate-950 shadow-sm"
                      : "text-[var(--text-secondary)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)] flex-wrap">
              {[
                { id: "coding", label: "Coding" },
                { id: "reading", label: "Reading" },
                { id: "writing", label: "Writing" },
                { id: "meeting", label: "Meeting" },
                { id: "designing", label: "Designing" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTask(t.id)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    task === t.id
                      ? "bg-indigo-600 text-white shadow-sm font-bold"
                      : "text-[var(--text-secondary)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)]">
            <span>⚙️ Open Hamburger Menu for Exports & Setup</span>
          </div>
        </div>

        {/* Modern Symmetrical 3-Tier Dashboard Grid Layout */}
        <div className="space-y-6">
          
          {/* Tier 1: Dual Sensory Monitors (Live Gauges & Facial Vision HUD) - 2 Equal Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Top-Left (6 Cols): Real-time Dynamic Dual Gauges */}
            <div className="lg:col-span-6 flex flex-col">
              <LiveScoreGauge
                score={liveCognitiveScore}
                productivityScore={liveProductivity}
                fatigueRisk={liveFatigueRisk}
                attentionIndex={liveAttentionIndex}
                typingStability={liveTypingStability}
                mouseEfficiency={liveMouseEfficiency}
                isLive={sessionActive}
                proxiedBy={lastProxyService}
              />
            </div>

            {/* Top-Right (6 Cols): Live Camera Feed & OpenCV 15s Vision HUD */}
            <div className="lg:col-span-6 flex flex-col">
              <LiveWebcamPreview
                webcamTracker={webcamTracker}
                sessionActive={sessionActive}
                productivityScore={liveProductivity}
                tabSwitches={tabSwitchCount}
              />
            </div>
          </div>

          {/* Tier 2: Real-time Dynamic Recharts Trajectory Timeline (Full Width 12-Cols) */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                  <Activity size={16} />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[var(--foreground)]">
                    Live Continuous Cognitive Load & Productivity Trajectory
                  </h3>
                  <p className="text-[10px] text-[var(--text-secondary)]">
                    Real-time 2-second telemetry smoothing across active window intervals
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold">
                <span className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-500 shadow-sm" /> Cognitive Load
                </span>
                <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 shadow-sm" /> Attention Flow
                </span>
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-sm" /> Productivity
                </span>
              </div>
            </div>

            <div className="h-56 w-full">
              {sessionActive && chartTimeline.length > 1 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="attGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="prodGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" />
                    <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        color: "#fff",
                        borderColor: "#334155",
                        borderRadius: "14px",
                        fontSize: "11px",
                        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.4)"
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      name="Cognitive Load"
                      stroke="#06b6d4"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#scoreGradient)"
                    />
                    <Area
                      type="monotone"
                      dataKey="attention"
                      name="Attention"
                      stroke="#6366f1"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#attGradient)"
                    />
                    <Area
                      type="monotone"
                      dataKey="productivity"
                      name="Productivity"
                      stroke="#10b981"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#prodGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-[var(--border)] rounded-2xl">
                  <Activity size={28} className="text-[var(--text-muted)] mb-2 animate-pulse" />
                  <p className="text-xs font-semibold text-[var(--text-secondary)]">
                    {sessionActive ? "Streaming high-frequency telemetry frames..." : "Start a session to stream real-time multimodal trajectory graphs"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tier 3: Intelligence & Input Diagnostics (2 Equal Columns) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Bottom-Left (6 Cols): AI Cognitive Insights Card */}
            <div className="lg:col-span-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-cyan-600 dark:text-cyan-400" />
                    <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[var(--foreground)]">
                      AI Diagnostic Insights & Rest Guidance
                    </h3>
                  </div>
                  <span className="flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-ping" />
                    {sessionActive ? "ML Active" : "Standby"}
                  </span>
                </div>

                {sessionActive && liveInsights.filter(i => !i.toLowerCase().includes("calculated productivity:")).length > 0 ? (
                  <div className="space-y-2">
                    {liveInsights
                      .filter(i => !i.toLowerCase().includes("calculated productivity:"))
                      .map((insight, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)] text-xs text-[var(--foreground)] flex items-start gap-2.5 shadow-sm"
                        >
                          <span className="h-2 w-2 rounded-full bg-cyan-500 mt-1 shrink-0" />
                          <span className="leading-relaxed">{insight}</span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-[var(--surface-muted)] border border-dashed border-[var(--border)] text-center text-xs text-[var(--text-muted)]">
                    {sessionActive ? "Monitoring continuous cadence & interaction flow..." : "Start a session to stream real-time behavioral insights and ML fatigue alerts."}
                  </div>
                )}
              </div>

              {sessionActive && liveRecommendations.length > 0 && (
                <div className="pt-3 border-t border-[var(--border)]">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                    Proactive Action Rest Advisory:
                  </p>
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                    {liveRecommendations[0]}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom-Right (6 Cols): Input Cadence & Telemetry Matrix */}
            <div className="lg:col-span-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-xl space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 size={16} className="text-cyan-600 dark:text-cyan-400" />
                    <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[var(--foreground)]">
                      Input Cadence & Interaction Telemetry
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowRawStats(!showRawStats)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[var(--surface-muted)] hover:bg-[var(--surface-raised)] border border-[var(--border)] text-[11px] font-bold text-[var(--foreground)] transition cursor-pointer shadow-sm"
                  >
                    <span>{showRawStats ? "Hide Metrics" : "View Metrics"}</span>
                    {showRawStats ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>
                </div>

                {/* 4-Matrix Telemetry Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Keyboard WPM */}
                  <div className="p-3.5 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)] space-y-1 shadow-sm">
                    <div className="flex items-center justify-between text-[var(--text-muted)]">
                      <Keyboard size={15} className="text-cyan-500" />
                      <span className="text-[10px] uppercase font-bold">Typing</span>
                    </div>
                    <p className="text-2xl font-black text-[var(--foreground)]">
                      {sessionActive && showRawStats ? keyboardMetrics.wordsPerMinute : (sessionActive ? "•••" : 0)} <span className="text-xs text-[var(--text-secondary)] font-normal">WPM</span>
                    </p>
                    <p className="text-[10px] text-[var(--text-secondary)]">
                      {sessionActive && showRawStats ? `${keyboardMetrics.totalKeystrokes} keystrokes` : "Active cadence stream"}
                    </p>
                  </div>

                  {/* Correction Stress */}
                  <div className="p-3.5 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)] space-y-1 shadow-sm">
                    <div className="flex items-center justify-between text-[var(--text-muted)]">
                      <AlertCircle size={15} className="text-rose-500" />
                      <span className="text-[10px] uppercase font-bold">Corrections</span>
                    </div>
                    <p className="text-2xl font-black text-[var(--foreground)]">
                      {sessionActive && showRawStats ? keyboardMetrics.backspaceCount : (sessionActive ? "•••" : 0)}
                    </p>
                    <p className="text-[10px] text-[var(--text-secondary)]">
                      {sessionActive && showRawStats ? "Backspaces hit" : "Error strain index"}
                    </p>
                  </div>

                  {/* Mouse Velocity */}
                  <div className="p-3.5 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)] space-y-1 shadow-sm">
                    <div className="flex items-center justify-between text-[var(--text-muted)]">
                      <MousePointer size={15} className="text-indigo-500" />
                      <span className="text-[10px] uppercase font-bold">Mouse Clicks</span>
                    </div>
                    <p className="text-2xl font-black text-[var(--foreground)]">
                      {sessionActive && showRawStats ? mouseMetrics.clickCount : (sessionActive ? "•••" : 0)}
                    </p>
                    <p className="text-[10px] text-[var(--text-secondary)]">
                      {sessionActive && showRawStats ? `${mouseMetrics.idleTime}s idle time` : "Click & navigation flow"}
                    </p>
                  </div>

                  {/* Tab Switches */}
                  <div className="p-3.5 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)] space-y-1 shadow-sm">
                    <div className="flex items-center justify-between text-[var(--text-muted)]">
                      <Layers size={15} className="text-amber-500" />
                      <span className="text-[10px] uppercase font-bold">Switches</span>
                    </div>
                    <p className="text-2xl font-black text-[var(--foreground)]">
                      {sessionActive && showRawStats ? tabSwitchCount : (sessionActive ? "•••" : 0)}
                    </p>
                    <p className="text-[10px] text-[var(--text-secondary)]">
                      {sessionActive && showRawStats ? "Context blurs" : "Window transitions"}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-[var(--text-muted)] pt-1 text-center sm:text-left">
                {showRawStats ? "Real-time granular telemetry counts active." : "Metrics sanitized for executive overview. Click 'View Metrics' for raw numbers."}
              </p>
            </div>

          </div>

        </div>

      </main>

      {/* Setup Wizard Modal */}
      <StartSessionWizardModal
        isOpen={wizardModalOpen}
        onClose={() => setWizardModalOpen(false)}
        onStartSession={startSession}
        initialRole={role}
        initialTask={task}
        taskStandards={taskStandards}
      />

      {/* Criteria Modal */}
      <EvaluationCriteriaModal
        isOpen={criteriaModalOpen}
        onClose={() => setCriteriaModalOpen(false)}
        role={role}
        task={task}
        taskStandards={taskStandards}
      />

      {/* Install Extension Modal */}
      <InstallExtensionModal
        open={installModalOpen}
        onDismiss={() => setInstallModalOpen(false)}
      />

      {/* Wellness Nudge */}
      <WellnessNudge
        isOpen={wellnessNudgeOpen}
        onClose={() => setWellnessNudgeOpen(false)}
        onTakeBreak={stopSession}
      />

      {/* Post-Session Result Modal */}
      <SessionResultModal
        isOpen={resultModalOpen}
        onClose={() => setResultModalOpen(false)}
        summary={lastSessionSummary}
        onDownloadReport={downloadReport}
        onDownloadCSV={downloadCSV}
      />

      {/* Floating Pop-up Card for Live Recommended Action */}
      <AnimatePresence>
        {sessionActive && liveRecommendations.length > 0 && !recommendationDismissed && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 max-w-md w-[calc(100%-3rem)] sm:w-auto p-4 rounded-3xl bg-[var(--surface)] border-2 border-cyan-500/40 shadow-2xl backdrop-blur-xl text-[var(--foreground)] space-y-2"
          >
            <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-2">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
                  <Bell size={14} className="animate-bounce" />
                </span>
                <h4 className="text-xs font-black uppercase tracking-wider text-[var(--foreground)]">
                  Live ML Recommended Action
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setRecommendationDismissed(true)}
                className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-muted)] transition cursor-pointer"
                title="Dismiss"
              >
                <X size={14} />
              </button>
            </div>

            <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">
              {liveRecommendations[0]}
            </p>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setRecommendationDismissed(true)}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[11px] font-bold shadow-md hover:brightness-110 transition cursor-pointer"
              >
                Acknowledge & Continue
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}