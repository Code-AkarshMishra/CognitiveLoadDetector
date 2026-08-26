import { BrainCircuit, Activity, Zap, ShieldAlert, CheckCircle2, RefreshCw, BarChart2, Radio } from "lucide-react";

export default function FatigueAnalysis({ cognitiveLoadData, liveStreamStats, sessionActive }) {
  const isAnalyzing = sessionActive;
  const hasResults = !sessionActive && cognitiveLoadData;

  const getRiskBadgeColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case "low":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "moderate":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "high":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      case "critical":
        return "bg-rose-500/10 text-rose-600 border-rose-500/20";
      default:
        return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
  };

  return (
    <section className="surface-card overflow-hidden p-0 border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl">
      <div className="grid gap-0 lg:grid-cols-[0.88fr_1.12fr]">
        {/* Left Side Header Card */}
        <div className="bg-[linear-gradient(135deg,var(--warning-soft),#ffffff)] dark:bg-[linear-gradient(135deg,rgba(245,158,11,0.08),rgba(15,23,42,0.6))] p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 text-[var(--warning)] shadow-sm">
                <BrainCircuit size={26} aria-hidden="true" />
              </span>

              {isAnalyzing && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-300 animate-pulse border border-amber-500/30">
                  <Radio size={14} className="animate-spin text-amber-500" />
                  Streaming 5 Hz Data
                </span>
              )}

              {hasResults && (
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${getRiskBadgeColor(cognitiveLoadData.fatigueRisk)}`}>
                  <CheckCircle2 size={13} />
                  Session Analysis Complete
                </span>
              )}
            </div>

            <p className="mt-6 section-kicker text-[var(--warning)] font-bold tracking-wider uppercase text-xs">
              AI Analysis Engine
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-black text-[var(--foreground)] tracking-tight">
              Cognitive Load Assessment
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
              {isAnalyzing
                ? "Continuously transmitting 5 interaction feature frames per second (5 Hz) to the cognitive load prediction backend..."
                : hasResults
                ? "Backend engine processed all 5 Hz feature stream samples and generated cognitive load & fatigue predictions."
                : "Start a session to stream 5 Hz interaction feature frames and receive cognitive load results."}
            </p>
          </div>

          {/* Cognitive Load Score Highlight Callout if results available */}
          {hasResults && cognitiveLoadData.cognitiveLoadScore !== undefined && (
            <div className="mt-6 pt-6 border-t border-amber-500/20 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide font-bold text-slate-500">Calculated Score</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-black text-amber-600 dark:text-amber-400">
                    {cognitiveLoadData.cognitiveLoadScore}%
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    Fatigue Risk: <strong className="text-slate-800 dark:text-slate-200">{cognitiveLoadData.fatigueRisk}</strong>
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-500">Frames Analyzed</p>
                <p className="text-lg font-black text-slate-700 dark:text-slate-300">
                  {cognitiveLoadData.totalFramesAnalyzed || 0} <span className="text-xs font-normal text-slate-500">@ 5 Hz</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Side Stats & Output Cards */}
        <div className="p-6 sm:p-8 flex flex-col justify-center bg-white dark:bg-slate-900/40">
          {isAnalyzing ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-amber-500/10 text-amber-600">
                  <Activity size={24} className="animate-bounce" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                    Active 5 Hz Feature Stream
                  </h4>
                  <p className="text-xs text-slate-500">
                    Sending 5 feature samples per second to backend <code className="text-amber-600 bg-amber-100 dark:bg-amber-950 px-1 py-0.5 rounded text-[11px]">http://localhost:8080/api/predict</code>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="metric-card p-4">
                  <p className="text-xs font-semibold text-slate-500">Streamed Frames</p>
                  <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">
                    {liveStreamStats?.frameCount || 0}
                  </p>
                  <p className="text-[11px] text-amber-600 font-medium mt-1">5 samples / sec</p>
                </div>
                <div className="metric-card p-4">
                  <p className="text-xs font-semibold text-slate-500">Target Server</p>
                  <p className="text-base font-bold text-slate-800 dark:text-slate-100 mt-1 truncate">
                    localhost:8080
                  </p>
                  <p className="text-[11px] text-emerald-600 font-medium mt-1">Connected (5 Hz)</p>
                </div>
              </div>
            </div>
          ) : hasResults ? (
            <div className="space-y-4">
              {/* Detailed calculated sub-metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="metric-card p-3 text-center">
                  <p className="text-[11px] font-semibold text-slate-500">Attention Index</p>
                  <p className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1">
                    {cognitiveLoadData.attentionIndex || "--"}%
                  </p>
                </div>
                <div className="metric-card p-3 text-center">
                  <p className="text-[11px] font-semibold text-slate-500">Typing Stability</p>
                  <p className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1">
                    {cognitiveLoadData.typingStability || "--"}%
                  </p>
                </div>
                <div className="metric-card p-3 text-center">
                  <p className="text-[11px] font-semibold text-slate-500">Mouse Efficiency</p>
                  <p className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1">
                    {cognitiveLoadData.mouseEfficiency || "--"}%
                  </p>
                </div>
              </div>

              {/* Insights */}
              {cognitiveLoadData.insights && cognitiveLoadData.insights.length > 0 && (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                    <BarChart2 size={14} className="text-amber-500" />
                    5 Hz Stream Insights
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                    {cognitiveLoadData.insights.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {cognitiveLoadData.recommendations && cognitiveLoadData.recommendations.length > 0 && (
                <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1.5 flex items-center gap-1.5">
                    <Zap size={14} />
                    Backend Recommendation
                  </h4>
                  <p className="text-xs text-amber-900 dark:text-amber-200 font-medium leading-relaxed">
                    {cognitiveLoadData.recommendations[0]}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 text-center space-y-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 mb-1">
                <BrainCircuit size={24} />
              </span>
              <h4 className="text-base font-bold text-[var(--foreground)]">AI Cognitive Assessment Ready</h4>
              <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto leading-relaxed">
                Start an active session to analyze interaction telemetry, evaluate typing stability, and receive real-time fatigue recommendations.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
