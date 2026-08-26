"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Download,
  FileText,
  ShieldCheck,
  Sliders,
  Building2,
  User,
  LogOut,
  Activity,
  HelpCircle,
  BarChart2,
  Lock,
  ExternalLink,
  Puzzle,
  BookOpen,
  Scale,
  Sparkles,
  ChevronRight,
  Database
} from "lucide-react";
import Link from "next/link";
import InstallExtensionModal from "@/components/dashboard/InstallExtensionModal";

export default function HamburgerMenu({
  onDownloadReport,
  onDownloadCSV,
  onOpenEvaluationCriteria,
  onOpenSetupWizard,
  onOpenInstallExtension,
  currentRole = "developer",
  currentTask = "coding",
  currentUser,
  onLogout
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [installModalOpen, setInstallModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleOpenExtensionGuide = () => {
    setIsOpen(false);
    if (onOpenInstallExtension) {
      onOpenInstallExtension();
    } else {
      setInstallModalOpen(true);
    }
  };

  const drawerContent = (
    <>
      {/* Backdrop overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[9998] bg-slate-950/75 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Slide-over Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed right-0 top-0 bottom-0 h-screen z-[9999] w-full max-w-sm sm:max-w-md bg-[var(--surface)] border-l border-[var(--border)] text-[var(--foreground)] p-5 sm:p-6 shadow-2xl flex flex-col justify-between overflow-y-auto"
          >
            <div className="space-y-4">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20">
                    <Activity size={20} className="animate-pulse" />
                  </span>
                  <div>
                    <h3 className="font-black text-[var(--foreground)] text-base">Quick Menu & Controls</h3>
                    <p className="text-[11px] text-[var(--text-secondary)]">All actions, tools & navigation</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl p-2 text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)] border border-[var(--border)] transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* User Profile Pill */}
              <div className="p-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-black text-white text-xs shadow-md">
                    {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[var(--foreground)]">{currentUser?.name || "Active Operator"}</p>
                    <p className="text-[10px] text-[var(--text-secondary)]">{currentUser?.email || "user@neurotrack.ai"}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 uppercase">
                  {currentUser?.role || currentRole || "USER"}
                </span>
              </div>

              {/* SECTION 1: ESSENTIAL TOOLS & INSTALLATION */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider px-1">
                  Extension & Session Setup
                </p>

                {/* 1. HOW TO INSTALL EXTENSION */}
                <button
                  type="button"
                  onClick={handleOpenExtensionGuide}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-transparent border border-cyan-500/40 text-[var(--foreground)] hover:border-cyan-400 hover:bg-cyan-500/20 transition group cursor-pointer shadow-sm text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500 text-slate-950 shadow-md group-hover:scale-105 transition-transform">
                      <Puzzle size={16} />
                    </span>
                    <div>
                      <p className="font-black text-xs text-[var(--foreground)] flex items-center gap-1.5">
                        How to Install Extension
                        <span className="px-1.5 py-0.2 rounded bg-cyan-500 text-slate-950 text-[9px] font-bold uppercase">Click Here</span>
                      </p>
                      <p className="text-[10px] text-[var(--text-secondary)]">Step-by-step browser setup guide & ZIP download</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-cyan-500 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* 2. TASK CALIBRATION & WIZARD */}
                {onOpenSetupWizard && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      onOpenSetupWizard();
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--surface-raised)] hover:border-cyan-500/40 transition text-xs font-semibold cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Sliders size={16} className="text-cyan-500 shrink-0" />
                      <div>
                        <p className="font-bold">Task Calibration & Setup Wizard</p>
                        <p className="text-[10px] text-[var(--text-secondary)]">Set role baselines & idle thresholds</p>
                      </div>
                    </div>
                    <ChevronRight size={15} className="text-[var(--text-muted)]" />
                  </button>
                )}

                {/* 3. JUDGING & EVALUATION CRITERIA */}
                {onOpenEvaluationCriteria && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      onOpenEvaluationCriteria();
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--surface-raised)] hover:border-purple-500/40 transition text-xs font-semibold cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Scale size={16} className="text-purple-500 shrink-0" />
                      <div>
                        <p className="font-bold">Judging & Evaluation Criteria</p>
                        <p className="text-[10px] text-[var(--text-secondary)]">How productivity & fatigue are judged</p>
                      </div>
                    </div>
                    <ChevronRight size={15} className="text-[var(--text-muted)]" />
                  </button>
                )}
              </div>

              {/* SECTION 2: EXPORTS & REPORTS */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider px-1">
                  Exports & Data
                </p>

                {/* 4. DOWNLOAD PDF REPORT */}
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onDownloadReport && onDownloadReport();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--surface-raised)] hover:border-blue-500/40 transition text-xs font-semibold cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <FileText size={16} className="text-blue-500 shrink-0" />
                    <div>
                      <p className="font-bold">Download PDF Audit Report</p>
                      <p className="text-[10px] text-[var(--text-secondary)]">Formatted executive summary report</p>
                    </div>
                  </div>
                  <Download size={14} className="text-blue-500" />
                </button>

                {/* 5. EXPORT CSV DATA */}
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onDownloadCSV && onDownloadCSV();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--surface-raised)] hover:border-emerald-500/40 transition text-xs font-semibold cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <Database size={16} className="text-emerald-500 shrink-0" />
                    <div>
                      <p className="font-bold">Export Raw CSV Telemetry</p>
                      <p className="text-[10px] text-[var(--text-secondary)]">Keystrokes, mouse & switch matrix</p>
                    </div>
                  </div>
                  <Download size={14} className="text-emerald-500" />
                </button>
              </div>

              {/* SECTION 3: MULTI-ROLE PORTALS */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider px-1">
                  Multi-Role Dashboards
                </p>

                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--surface-raised)] transition text-xs font-semibold"
                >
                  <div className="flex items-center gap-3">
                    <User size={16} className="text-cyan-500 shrink-0" />
                    <div>
                      <p className="font-bold text-[var(--foreground)]">User Live Lab</p>
                      <p className="text-[10px] text-[var(--text-secondary)]">Personal telemetry & 15s vision scan</p>
                    </div>
                  </div>
                  <ExternalLink size={14} className="text-[var(--text-muted)]" />
                </Link>

                <Link
                  href="/org-dashboard"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--surface-raised)] transition text-xs font-semibold"
                >
                  <div className="flex items-center gap-3">
                    <Building2 size={16} className="text-teal-500 shrink-0" />
                    <div>
                      <p className="font-bold text-[var(--foreground)]">Organisation Hub</p>
                      <p className="text-[10px] text-[var(--text-secondary)]">Team burnout & fatigue trends</p>
                    </div>
                  </div>
                  <ExternalLink size={14} className="text-[var(--text-muted)]" />
                </Link>

                <Link
                  href="/admin-dashboard"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--surface-raised)] transition text-xs font-semibold"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={16} className="text-indigo-500 shrink-0" />
                    <div>
                      <p className="font-bold text-[var(--foreground)]">Admin Observability</p>
                      <p className="text-[10px] text-[var(--text-secondary)]">Cluster node pings & server logs</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-700 dark:text-indigo-300">
                    System
                  </span>
                </Link>
              </div>

              {/* SECTION 4: DOCUMENTATION & LEGAL */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider px-1">
                  Documentation & Legal
                </p>

                <Link
                  href="/documentation"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--surface-raised)] transition text-xs font-semibold"
                >
                  <div className="flex items-center gap-2.5">
                    <BookOpen size={15} className="text-blue-500" />
                    <span>System Documentation & APIs</span>
                  </div>
                  <ChevronRight size={14} className="text-[var(--text-muted)]" />
                </Link>

                <Link
                  href="/privacy-policy"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--surface-raised)] transition text-xs font-semibold"
                >
                  <div className="flex items-center gap-2.5">
                    <Lock size={15} className="text-emerald-500" />
                    <span>Privacy Policy (Zero Raw Video)</span>
                  </div>
                  <ChevronRight size={14} className="text-[var(--text-muted)]" />
                </Link>
              </div>

            </div>

            {/* Footer & Auth Actions */}
            <div className="pt-4 border-t border-[var(--border)] mt-4 space-y-2">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 text-xs font-bold transition"
              >
                <LogOut size={15} />
                <span>Sign Out / Switch Profile</span>
              </Link>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Embedded Extension Modal */}
      <InstallExtensionModal
        open={installModalOpen}
        onDismiss={() => setInstallModalOpen(false)}
      />
    </>
  );

  return (
    <>
      {/* Floating Hamburger Toggle Button */}
      <button
        type="button"
        onClick={toggleMenu}
        aria-label="Toggle Menu"
        className="relative z-40 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/20 border border-cyan-400/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mount Drawer to document.body so it never gets clipped by navbar */}
      {mounted && typeof document !== "undefined" ? createPortal(drawerContent, document.body) : null}
    </>
  );
}
