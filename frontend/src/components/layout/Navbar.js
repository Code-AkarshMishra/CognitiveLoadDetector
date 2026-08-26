"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Activity, 
  ShieldCheck, 
  Building2, 
  User, 
  Sun, 
  Moon, 
  LogIn, 
  UserPlus, 
  Play,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar({ rightExtra = null }) {
  const pathname = usePathname();
  const [theme, setTheme] = useState("dark");
  const [backendAlive, setBackendAlive] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("neurotrack_theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);

    // Periodic ping to verify backend/ML status
    const checkHealth = async () => {
      try {
        const res = await fetch("http://localhost:5001/health", { method: "GET", cache: "no-store" });
        if (res.ok) {
          setBackendAlive(true);
        } else {
          setBackendAlive(false);
        }
      } catch {
        setBackendAlive(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("neurotrack_theme", nextTheme);
  };

  const navItems = [
    { label: "User Live Lab", href: "/dashboard", icon: User },
    { label: "Organisation Hub", href: "/org-dashboard", icon: Building2 },
    { label: "Admin Observability", href: "/admin-dashboard", icon: ShieldCheck },
  ];

  const isHomePage = pathname === "/";

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-xl transition-colors">
      <div className="max-w-[1500px] w-full mx-auto px-4 sm:px-8 lg:px-12 flex min-h-16 items-center justify-between gap-4 py-2.5">

        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Activity size={22} className="animate-pulse" />
              <div className="absolute inset-0 rounded-2xl bg-cyan-400 opacity-0 group-hover:opacity-30 blur transition-opacity" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-[var(--foreground)]">
                  NeuroTrack<span className="text-cyan-600 dark:text-cyan-400">.AI</span>
                </span>
                <span className="hidden sm:inline-flex px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
                  v3.2 ML
                </span>
              </div>
              <p className="hidden text-[10px] font-medium text-[var(--text-secondary)] sm:block">
                Cognitive Load & Mental Fatigue Telemetry
              </p>
            </div>
          </Link>
        </div>

        {/* Right Section: Actions & Theme Controls */}
        <div className="flex items-center gap-2.5">
          {/* Backend & ML Live Health Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--surface-muted)] border border-[var(--border)] text-[11px] font-medium text-[var(--text-secondary)]">
            <span className={`h-2 w-2 rounded-full ${backendAlive ? "bg-emerald-500 animate-ping" : "bg-cyan-500"}`} />
            <span className="text-[10px] text-[var(--text-secondary)] font-mono">
              {backendAlive ? "OpenCV ML :5001 Live" : "OpenCV ML Standby"}
            </span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--surface-muted)] text-[var(--foreground)] hover:bg-[var(--surface-raised)] border border-[var(--border)] transition cursor-pointer shadow-sm"
            aria-label="Toggle theme"
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* If on Home Page: Show Login, Register & Launch buttons */}
          {isHomePage && !rightExtra && (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[var(--foreground)] hover:bg-[var(--surface-muted)] border border-transparent hover:border-[var(--border)] transition"
              >
                <LogIn size={14} />
                <span>Sign In</span>
              </Link>

              <Link
                href="/register"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[var(--foreground)] bg-[var(--surface-muted)] hover:bg-[var(--surface-raised)] border border-[var(--border)] transition shadow-sm"
              >
                <UserPlus size={14} />
                <span>Create Account</span>
              </Link>

              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 transition hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Play size={13} />
                <span>Start Session</span>
                <ArrowRight size={13} className="hidden sm:inline" />
              </Link>
            </div>
          )}

          {/* If rightExtra passed (e.g. on Dashboard): render rightExtra (HamburgerMenu) */}
          {rightExtra}
        </div>
      </div>
    </header>
  );
}
