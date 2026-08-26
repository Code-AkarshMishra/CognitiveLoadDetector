"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { BarChart3, LineChart as LucideLineChart, PieChart as LucidePieChart, Info, Play } from "lucide-react";

// Custom tooltips component defined statically outside render to satisfy react-hooks/static-components
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] dark:border-slate-700 dark:bg-slate-950/90 p-3 shadow-xl backdrop-blur-md">
        <p className="text-xs font-bold text-[var(--text-secondary)]">{label}</p>
        {payload.map((p, idx) => (
          <p key={idx} className="mt-1 text-sm font-black" style={{ color: p.color }}>
            {p.name}: {p.value}
            {p.name.includes("Score") || p.name.includes("Ratio") ? "%" : p.name.includes("WPM") ? " WPM" : ""}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardCharts({ history, chartHistory, sessionActive }) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("productivity");

  const chartData = history || chartHistory || [];

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <div className="h-96 rounded-3xl bg-[var(--surface-muted)] border border-[var(--border)] dark:bg-slate-900/50 dark:border-slate-800 animate-pulse" />;
  }

  // Handle empty state
  if (!chartData || chartData.length === 0) {
    return (
      <div className="surface-card p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-blue-600 dark:bg-slate-800/80 dark:text-blue-400">
          <BarChart3 size={24} />
        </div>
        <h3 className="mt-4 text-lg font-bold text-[var(--foreground)]">No active session data</h3>
        <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
          Graphs require live session metrics. Start a session and begin typing, clicking, scrolling, or switching tabs to collect and visualize your focus analytics.
        </p>
        {!sessionActive && (
          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl max-w-xs mx-auto">
            <Play size={12} className="fill-amber-650 dark:fill-amber-400" />
            <span>Click <strong>Start Analysis</strong> above to begin</span>
          </div>
        )}
      </div>
    );
  }

  // Prepare Pie Chart data (Active vs Idle)
  const lastSample = chartData[chartData.length - 1];
  const activeSeconds = Math.max(0, (lastSample?.sessionSeconds ?? 0) - (lastSample?.idleSeconds ?? 0));
  const idleSeconds = lastSample?.idleSeconds ?? 0;

  const pieData = [
    { name: "Active working time", value: activeSeconds, color: "#10b981" },
    { name: "Idle thinking time", value: idleSeconds, color: "#f59e0b" },
  ];

  return (
    <div className="surface-card p-6">
      
      {/* Tabs / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[var(--border)] dark:border-slate-850 pb-5">
        <div>
          <h3 className="text-lg font-extrabold text-[var(--foreground)] flex items-center gap-2">
            <BarChart3 className="text-emerald-600 dark:text-emerald-400" size={20} />
            Live Focus Analytics
          </h3>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Real-time charts feed directly from your interaction and distraction data
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-1.5 rounded-xl bg-[var(--surface-muted)] p-1 border border-[var(--border)] dark:bg-slate-950/50 dark:border-slate-850">
          <button
            onClick={() => setActiveTab("productivity")}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
              activeTab === "productivity"
                ? "bg-[var(--surface)] text-[var(--foreground)] shadow-sm dark:bg-slate-800 dark:text-white"
                : "text-[var(--text-secondary)] hover:text-[var(--foreground)] dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <LucideLineChart size={13} />
            Focus & Productivity
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
              activeTab === "activity"
                ? "bg-[var(--surface)] text-[var(--foreground)] shadow-sm dark:bg-slate-800 dark:text-white"
                : "text-[var(--text-secondary)] hover:text-[var(--foreground)] dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <BarChart3 size={13} />
            Inputs Timeline
          </button>
          <button
            onClick={() => setActiveTab("distractions")}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
              activeTab === "distractions"
                ? "bg-[var(--surface)] text-[var(--foreground)] shadow-sm dark:bg-slate-800 dark:text-white"
                : "text-[var(--text-secondary)] hover:text-[var(--foreground)] dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <Info size={13} />
            Distractions
          </button>
          <button
            onClick={() => setActiveTab("time")}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
              activeTab === "time"
                ? "bg-[var(--surface)] text-[var(--foreground)] shadow-sm dark:bg-slate-800 dark:text-white"
                : "text-[var(--text-secondary)] hover:text-[var(--foreground)] dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <LucidePieChart size={13} />
            Time Balance
          </button>
        </div>
      </div>

      {/* Chart Panel */}
      <div className="mt-6 min-h-[300px]">
        {activeTab === "productivity" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span>Focus trends over the session duration</span>
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Productivity Score</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-sky-500" /> Distraction Score</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> WPM</span>
              </span>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="prodColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="distColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                  <XAxis dataKey="timeLabel" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={10} domain={[0, 100]} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" name="Productivity" dataKey="productivityScore" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#prodColor)" />
                  <Area type="monotone" name="Distraction Score" dataKey="distractionScore" stroke="#f43f5e" strokeWidth={1.5} fillOpacity={1} fill="url(#distColor)" />
                  <Line type="monotone" name="Typing WPM" dataKey="wpm" stroke="#f59e0b" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span>Keystrokes and mouse interactions per sample interval</span>
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-550" /> Keystrokes</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-sky-550" /> Mouse Moves</span>
              </span>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                  <XAxis dataKey="timeLabel" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" name="Keystrokes" dataKey="keystrokes" stroke="#34d399" strokeWidth={2} dot={true} />
                  <Line type="monotone" name="Mouse Moves" dataKey="mouseEvents" stroke="#60a5fa" strokeWidth={2} dot={true} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "distractions" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span>Tab switches and window focus losses over time</span>
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500" /> Tab Switches</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Window Focus Changes</span>
              </span>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                  <XAxis dataKey="timeLabel" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar name="Tab Switches" dataKey="tabSwitches" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  <Bar name="Window Blurs" dataKey="windowFocusChanges" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "time" && (
          <div className="flex flex-col md:flex-row items-center justify-around gap-6 py-4">
            <div className="w-[200px] h-[200px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}s`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-[var(--foreground)]">
                  {Math.round((activeSeconds / Math.max(1, activeSeconds + idleSeconds)) * 100)}%
                </span>
                <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Active working</span>
              </div>
            </div>

            <div className="space-y-4 w-full max-w-sm">
              <h4 className="text-sm font-bold text-[var(--foreground)]">Session Time Breakdown</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] dark:bg-slate-950/30 dark:border-slate-850">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-semibold text-[var(--text-secondary)]">Active Working Time</span>
                  </div>
                  <span className="text-xs font-extrabold text-[var(--foreground)]">{activeSeconds}s</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] dark:bg-slate-950/30 dark:border-slate-850">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-amber-500" />
                    <span className="text-xs font-semibold text-[var(--text-secondary)]">Idle / Thinking Time</span>
                  </div>
                  <span className="text-xs font-extrabold text-[var(--foreground)]">{idleSeconds}s</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] dark:bg-slate-950/30 dark:border-slate-850">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    <span className="text-xs font-semibold text-[var(--text-secondary)]">Total Duration</span>
                  </div>
                  <span className="text-xs font-extrabold text-[var(--foreground)]">{activeSeconds + idleSeconds}s</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
}
