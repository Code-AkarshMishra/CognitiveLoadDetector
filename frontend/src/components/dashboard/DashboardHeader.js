"use client";

import { useEffect, useState } from "react";
import { Activity, Clock3, ShieldCheck, Sun, Moon } from "lucide-react";

export default function DashboardHeader({ 
  sessionActive, 
  formattedTime,
  extensionConnected,
  onOpenExtensionModal,
  onDownloadReport,
  onDownloadCSV,
  onOpenEvaluationCriteria,
  currentUser
}) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("neurotrack_theme") || "light";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("neurotrack_theme", nextTheme);
  };

  return (
    <section className="overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#0f766e_0%,#2563eb_58%,#5b5ce2_100%)] p-6 text-white shadow-[var(--shadow-lg)] sm:p-8 lg:p-10 relative">
      <div className="grid gap-8 lg:grid-cols-[1fr_330px] lg:items-end">
        <div className="max-w-3xl">
          <div className="flex items-center justify-between sm:justify-start sm:gap-4 flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/16 px-4 py-2 text-sm font-bold backdrop-blur">
              <Activity size={16} aria-hidden="true" />
              Focus & Fatigue Check
            </span>
            <button
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 rounded-full bg-white/16 px-4 py-2 text-sm font-bold backdrop-blur text-white hover:bg-white/28 border border-white/10 hover:scale-[1.03] transition duration-300 cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <>
                  <Moon size={14} aria-hidden="true" />
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun size={14} aria-hidden="true" />
                  <span>Light Mode</span>
                </>
              )}
            </button>
          </div>


          <h1 className="mt-5 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
            Your calm focus companion
          </h1>

          <p className="mt-5 max-w-2xl text-base text-white/86 sm:text-lg">
            We gently track your focus patterns and highlight when a short reset could help you feel better.
          </p>
        </div>

        <div className="rounded-[24px] border border-white/18 bg-white/14 p-5 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-bold uppercase tracking-wide text-white/72">
              Session Status
            </p>
            <span className="flex items-center gap-2 rounded-full bg-white/16 px-3 py-1 text-sm font-bold">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  sessionActive ? "bg-emerald-300" : "bg-white/45"
                }`}
              />
              {sessionActive ? "Active" : "Ready"}
            </span>
          </div>

          <div className="mt-7 border-t border-white/18 pt-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-white/72">
              <Clock3 size={16} aria-hidden="true" />
              Time in session
            </p>
            <h2 className="mt-2 text-4xl font-black text-white">{formattedTime}</h2>
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white/12 p-3 text-sm text-white/82">
            <ShieldCheck size={18} aria-hidden="true" />
            <span>Private, lightweight support while you work</span>
          </div>
        </div>
      </div>
    </section>
  );
}
