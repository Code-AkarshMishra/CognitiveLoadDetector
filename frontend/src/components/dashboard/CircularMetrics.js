"use client";

import { Brain, Flame, Activity, ShieldAlert, Sparkles } from "lucide-react";

export default function CircularMetrics({
  sessionActive,
  productivityScore = 100,
  fatigueRisk = "Pending",
  wpm = 0,
  activeWorkingTime = 0,
  accumulatedIdleTime = 0,
  standards = {},
}) {
  // 1. Focus Strength Metric
  const focusPercentage = sessionActive ? productivityScore : 0;

  // 2. Typing Pace Metric
  const targetWpm = Math.max(12, standards?.minWpm || 15);
  const wpmPercentage = sessionActive ? Math.min(100, Math.round((wpm / targetWpm) * 100)) : 0;

  // 3. Flow Efficiency Metric
  const totalTime = activeWorkingTime + accumulatedIdleTime;
  const flowPercentage = sessionActive && totalTime > 0 
    ? Math.min(100, Math.round((activeWorkingTime / totalTime) * 100)) 
    : 0;

  // 4. Fatigue Index Metric
  const fatigueLevels = {
    Normal: { percentage: 20, text: "Low Risk", colorClass: "text-emerald-500", glow: "shadow-emerald-500/10" },
    Watch: { percentage: 45, text: "Watch", colorClass: "text-sky-500", glow: "shadow-sky-500/10" },
    Elevated: { percentage: 70, text: "Elevated", colorClass: "text-amber-500", glow: "shadow-amber-500/10" },
    High: { percentage: 100, text: "High Risk", colorClass: "text-rose-500", glow: "shadow-rose-500/10" },
    Pending: { percentage: 0, text: "Pending", colorClass: "text-slate-400", glow: "shadow-transparent" },
  };
  
  const currentFatigue = sessionActive ? (fatigueLevels[fatigueRisk] || fatigueLevels.Normal) : fatigueLevels.Pending;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="text-emerald-600 dark:text-emerald-400 animate-pulse" size={18} />
        <h3 className="text-lg font-extrabold text-[var(--foreground)]">Real-time Signal Visualizers</h3>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Ring 1: Focus Strength */}
        <MetricRingCard
          title="Focus Strength"
          value={sessionActive ? `${focusPercentage}%` : "0%"}
          percentage={focusPercentage}
          icon={Activity}
          gradientId="focusGrad"
          startColor="#06b6d4"
          endColor="#10b981"
          subText={sessionActive ? "Current focus level" : "Session standby"}
          colorClass="text-emerald-600 dark:text-emerald-400"
        />

        {/* Ring 2: Typing Pace */}
        <MetricRingCard
          title="Typing Rhythm"
          value={`${wpm} WPM`}
          percentage={wpmPercentage}
          icon={Flame}
          gradientId="wpmGrad"
          startColor="#f59e0b"
          endColor="#ef4444"
          subText={`Target: ${targetWpm} WPM`}
          colorClass="text-amber-600 dark:text-amber-400"
        />

        {/* Ring 3: Flow Ratio */}
        <MetricRingCard
          title="Flow Efficiency"
          value={sessionActive ? `${flowPercentage}%` : "0%"}
          percentage={flowPercentage}
          icon={Brain}
          gradientId="flowGrad"
          startColor="#3b82f6"
          endColor="#6366f1"
          subText={sessionActive ? `Active vs idle ratio` : "Waiting for flow"}
          colorClass="text-blue-600 dark:text-blue-400"
        />

        {/* Ring 4: Fatigue Level */}
        <MetricRingCard
          title="Cognitive Strain"
          value={currentFatigue.text}
          percentage={currentFatigue.percentage}
          icon={ShieldAlert}
          gradientId="fatGrad"
          startColor="#a855f7"
          endColor="#ec4899"
          subText={sessionActive ? "Fatigue snap indicators" : "Ready to check"}
          colorClass={currentFatigue.colorClass}
        />
      </div>
    </section>
  );
}

function MetricRingCard({
  title,
  value,
  percentage,
  icon: Icon,
  gradientId,
  startColor,
  endColor,
  subText,
  colorClass,
}) {
  const radius = 38;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius; // Approx 238.76
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, percentage)) / 100) * circumference;

  return (
    <article className="surface-card p-5 flex items-center justify-between transition-all duration-300 hover:-translate-y-1">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className={`p-1.5 rounded-lg bg-[var(--surface-muted)] dark:bg-slate-800 ${colorClass}`}>
            <Icon size={14} />
          </span>
          <p className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">
            {title}
          </p>
        </div>
        <div>
          <p className="text-2xl font-black text-[var(--foreground)] tracking-tight">
            {value}
          </p>
          <p className="text-[10px] font-medium text-[var(--text-muted)] mt-0.5">
            {subText}
          </p>
        </div>
      </div>

      <div className="relative h-20 w-20 flex items-center justify-center shrink-0">
        <svg width="80" height="80" className="-rotate-90">
          {/* Base Background Track Circle */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="var(--border)"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="opacity-30 dark:opacity-20"
          />
          {/* Animated Progress Ring */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)" }}
          />
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={startColor} />
              <stop offset="100%" stopColor={endColor} />
            </linearGradient>
          </defs>
        </svg>
        <span className={`absolute text-[11px] font-extrabold ${colorClass}`}>
          {percentage}%
        </span>
      </div>
    </article>
  );
}
