import Link from "next/link";
import { Activity, ShieldCheck, Lock, FileText, BookOpen, Scale, Sparkles, Cpu, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] transition-colors">
      <div className="max-w-[1500px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Column 1: Brand & Overview (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20">
                <Activity size={22} className="animate-pulse" />
              </span>
              <div>
                <h3 className="text-lg font-black tracking-tight text-[var(--foreground)]">
                  NeuroTrack<span className="text-cyan-500">.AI</span>
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Cognitive Load & Mental Fatigue Telemetry Platform
                </p>
              </div>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-sm">
              Multimodal mental fatigue inference combining high-frequency keyboard dynamics, cursor navigation, and 30-second privacy-safe OpenCV facial fatigue vision processing.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-[11px] font-mono font-semibold">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <span>ML Inference :5001 Live</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-[11px] font-mono font-semibold">
                <span>Spring Boot :8080</span>
              </div>
            </div>
          </div>

          {/* Column 2: Portals & Labs */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
              Role Portals
            </p>
            <ul className="space-y-2 text-xs font-medium text-[var(--text-secondary)]">
              <li>
                <Link href="/dashboard" className="hover:text-cyan-500 transition flex items-center gap-1.5">
                  <span>User Live Lab</span>
                </Link>
              </li>
              <li>
                <Link href="/org-dashboard" className="hover:text-cyan-500 transition flex items-center gap-1.5">
                  <span>Organisation Hub</span>
                </Link>
              </li>
              <li>
                <Link href="/admin-dashboard" className="hover:text-cyan-500 transition flex items-center gap-1.5">
                  <span>Admin Observability</span>
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-cyan-500 transition">
                  Operator Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-cyan-500 transition">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Documentation & Standards */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
              Documentation & Criteria
            </p>
            <ul className="space-y-2 text-xs font-medium text-[var(--text-secondary)]">
              <li>
                <Link href="/documentation" className="hover:text-cyan-500 transition flex items-center gap-1.5">
                  <BookOpen size={13} className="text-blue-500" />
                  <span>Platform Documentation</span>
                </Link>
              </li>
              <li>
                <Link href="/documentation" className="hover:text-cyan-500 transition flex items-center gap-1.5">
                  <Scale size={13} className="text-purple-500" />
                  <span>Judging & Evaluation Criteria</span>
                </Link>
              </li>
              <li>
                <Link href="/documentation" className="hover:text-cyan-500 transition flex items-center gap-1.5">
                  <Cpu size={13} className="text-cyan-500" />
                  <span>OpenCV Vision ML Specs</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-cyan-500 transition flex items-center gap-1.5">
                  <Sparkles size={13} className="text-amber-500" />
                  <span>Task Calibration Matrix</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Privacy */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
              Privacy & Legal
            </p>
            <ul className="space-y-2 text-xs font-medium text-[var(--text-secondary)]">
              <li>
                <Link href="/privacy-policy" className="hover:text-cyan-500 transition flex items-center gap-1.5">
                  <Lock size={13} className="text-emerald-500" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-cyan-500 transition flex items-center gap-1.5">
                  <FileText size={13} className="text-slate-400" />
                  <span>Terms & Conditions</span>
                </Link>
              </li>
              <li>
                <span className="text-[11px] text-[var(--text-muted)] block leading-relaxed mt-1">
                  🔒 Zero raw camera footage is stored on servers. Ephemeral local processing only.
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright bar */}
        <div className="mt-10 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-secondary)]">
          <p>© {new Date().getFullYear()} NeuroTrack AI. All rights reserved. Multimodal Cognitive Telemetry Engine.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-[var(--foreground)] transition">Privacy</Link>
            <Link href="/terms-and-conditions" className="hover:text-[var(--foreground)] transition">Terms</Link>
            <Link href="/documentation" className="hover:text-[var(--foreground)] transition">Criteria & Docs</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
