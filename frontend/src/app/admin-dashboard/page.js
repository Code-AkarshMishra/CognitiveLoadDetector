"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Activity, 
  ShieldCheck, 
  Cpu, 
  Server, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Database, 
  Terminal, 
  Users, 
  Layers, 
  Zap, 
  Eye,
  TrendingUp,
  Download,
  Trash2,
  Lock
} from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";

export default function AdminDashboardPage() {
  const [frontendStatus, setFrontendStatus] = useState("online");
  const [backendStatus, setBackendStatus] = useState("checking");
  const [mlStatus, setMlStatus] = useState("checking");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [logFilter, setLogFilter] = useState("ALL");
  const [backendMeta, setBackendMeta] = useState(null);

  // Real Sessions & Users (Zero Dummy Data)
  const [activeSessions, setActiveSessions] = useState(() => {
    if (typeof window === "undefined") return [];
    const stored = window.localStorage.getItem("neurotrack_sessions");
    return stored ? JSON.parse(stored) : [];
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    if (typeof window === "undefined") return [];
    const stored = window.localStorage.getItem("neurotrack_user");
    return stored ? [JSON.parse(stored)] : [];
  });

  const [systemLogs, setSystemLogs] = useState([
    { id: 1, time: new Date().toLocaleTimeString(), type: "SYSTEM", message: "Admin Observability Cluster ready. Awaiting telemetry streams." }
  ]);

  const checkHealth = async () => {
    setIsRefreshing(true);
    // Check Java Spring Boot Backend
    try {
      const bRes = await fetch("http://localhost:8080/api/health", { method: "GET", cache: "no-store" });
      if (bRes.ok) {
        setBackendStatus("online");
        const data = await bRes.json().catch(() => null);
        if (data) setBackendMeta(data);
      } else {
        setBackendStatus("error");
      }
    } catch {
      setBackendStatus("offline");
    }

    // Check Python ML Server directly
    try {
      const mlRes = await fetch("http://localhost:5001/health", { method: "GET", cache: "no-store" });
      setMlStatus(mlRes.ok ? "online" : "error");
    } catch {
      setMlStatus("offline");
    }

    // Fetch real sessions from backend if available
    try {
      const sessRes = await fetch("http://localhost:8080/api/sessions", { method: "GET", cache: "no-store" });
      if (sessRes.ok) {
        const data = await sessRes.json();
        if (Array.isArray(data) && data.length > 0) {
          setActiveSessions(data);
        }
      }
    } catch (e) {
      // Keep local session records
    }

    // Fetch real users from backend
    try {
      const usersRes = await fetch("http://localhost:8080/api/auth/users", { method: "GET", cache: "no-store" });
      if (usersRes.ok) {
        const data = await usersRes.json();
        if (Array.isArray(data) && data.length > 0) {
          setRegisteredUsers(data);
        }
      }
    } catch (e) {
      // Keep local user
    }

    setIsRefreshing(false);
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 12000);
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status) => {
    if (status === "online") {
      return (
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
          <CheckCircle2 size={12} /> ONLINE
        </span>
      );
    }
    if (status === "checking") {
      return (
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold animate-pulse">
          <RefreshCw size={12} className="animate-spin" /> CHECKING
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold">
        <XCircle size={12} /> STANDBY / OFFLINE
      </span>
    );
  };

  const filteredLogs = logFilter === "ALL" ? systemLogs : systemLogs.filter((l) => l.type === logFilter);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Header Hero */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
              <ShieldCheck size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-black text-[var(--foreground)]">Admin Observability & Cluster Gateway</h1>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 text-[11px] font-bold">
                  DATABASE AUDIT
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Real-time node telemetry, MongoDB Atlas persistence status, and live operator audits
              </p>
            </div>
          </div>

          <button
            onClick={checkHealth}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[var(--surface-muted)] hover:bg-[var(--surface-raised)] text-[var(--foreground)] text-xs font-bold border border-[var(--border)] transition cursor-pointer"
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin text-cyan-500" : ""} />
            <span>Ping Cluster Nodes</span>
          </button>
        </div>

        {/* 3 Infrastructure Node Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Node 1: Next.js Web Application */}
          <div className="p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  <Activity size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[var(--foreground)]">Next.js Web Client</h3>
                  <p className="text-[11px] text-[var(--text-secondary)]">Port 3000</p>
                </div>
              </div>
              {getStatusBadge(frontendStatus)}
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              Serves reactive UI, Page Visibility API observer, and Web Audio/Visual capture.
            </p>
          </div>

          {/* Node 2: Java Spring Boot Backend & MongoDB Atlas */}
          <div className="p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  <Server size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[var(--foreground)]">Spring Boot & MongoDB</h3>
                  <p className="text-[11px] text-[var(--text-secondary)]">Port 8080</p>
                </div>
              </div>
              {getStatusBadge(backendStatus)}
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              {backendMeta?.mongoDbConnected ? "MongoDB Atlas Connection Active." : "Spring Boot Gateway Active. Connect MongoDB Atlas via MONGODB_URI."}
            </p>
          </div>

          {/* Node 3: Python ML Inference Service */}
          <div className="p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  <Cpu size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[var(--foreground)]">Python ML Engine</h3>
                  <p className="text-[11px] text-[var(--text-secondary)]">Port 5001</p>
                </div>
              </div>
              {getStatusBadge(mlStatus)}
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              Evaluates OpenCV visual contrast, behavioral cognitive stress heuristics, and model predictions.
            </p>
          </div>

        </div>

        {/* Global Active Sessions Audit Table (Zero Dummy Data) */}
        <div className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Users size={18} className="text-cyan-500" />
              <h3 className="font-bold text-base text-[var(--foreground)]">Real Measured Telemetry Sessions</h3>
            </div>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              {activeSessions.length} recorded session(s)
            </span>
          </div>

          {activeSessions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[var(--foreground)]">
                <thead className="bg-[var(--surface-muted)] text-[11px] uppercase tracking-wider text-[var(--text-secondary)] border-b border-[var(--border)]">
                  <tr>
                    <th className="p-3">Session ID</th>
                    <th className="p-3">Organization</th>
                    <th className="p-3">Role / Task</th>
                    <th className="p-3">Cognitive Load</th>
                    <th className="p-3">Typing WPM</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3">Fatigue Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {activeSessions.map((s, idx) => (
                    <tr key={s.id || s.sessionId || idx} className="hover:bg-[var(--surface-muted)] transition">
                      <td className="p-3 font-mono text-[var(--text-secondary)]">{s.id || s.sessionId}</td>
                      <td className="p-3 font-bold">{s.organization || "Independent"}</td>
                      <td className="p-3 text-[var(--text-secondary)]">{s.role} • {s.task}</td>
                      <td className="p-3 font-black text-cyan-600 dark:text-cyan-400">
                        {s.cognitiveLoadScore || s.productivityScore || 0} / 100
                      </td>
                      <td className="p-3 font-medium">{s.wordsPerMinute || 0} WPM</td>
                      <td className="p-3 text-[var(--text-secondary)]">{s.durationFormatted || `${s.durationSeconds || 0}s`}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          s.fatigueRisk === "High" 
                            ? "bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30" 
                            : s.fatigueRisk === "Moderate"
                            ? "bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30"
                            : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30"
                        }`}>
                          {s.fatigueRisk || "Completed"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-[var(--surface-muted)] border border-dashed border-[var(--border)]">
              <Activity size={28} className="mx-auto text-[var(--text-muted)] mb-2" />
              <h4 className="text-sm font-bold text-[var(--foreground)]">No Recorded Telemetry Sessions Yet</h4>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Start an active session from the User Lab to populate real verified cognitive assessment data.
              </p>
              <Link href="/dashboard" className="btn-primary mt-4 text-xs">
                Go to User Live Lab
              </Link>
            </div>
          )}
        </div>

        {/* Live System Log Console */}
        <div className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-5 shadow-xl space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
            <div className="flex items-center gap-2">
              <Terminal size={17} className="text-indigo-500" />
              <h3 className="font-bold text-sm text-[var(--foreground)]">Live Cluster Stream & Inference Logs</h3>
            </div>

            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] text-[11px]">
              {["ALL", "ML_INFERENCE", "SYSTEM", "TELEMETRY"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setLogFilter(tab)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                    logFilter === tab ? "bg-indigo-600 text-white" : "text-[var(--text-secondary)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="h-44 overflow-y-auto font-mono text-xs space-y-1.5 p-3 rounded-2xl bg-slate-950 text-slate-200 border border-slate-800">
            {filteredLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-2.5">
                <span className="text-slate-500 select-none">[{log.time}]</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  log.type === "ML_INFERENCE" 
                    ? "bg-purple-500/20 text-purple-300"
                    : log.type === "SYSTEM"
                    ? "bg-cyan-500/20 text-cyan-300"
                    : "bg-emerald-500/20 text-emerald-300"
                }`}>
                  {log.type}
                </span>
                <span className="text-slate-200">{log.message}</span>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
