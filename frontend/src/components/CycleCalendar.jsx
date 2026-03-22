import { useRef, useEffect } from "react";

function phaseColor(phase) {
  if (phase === "Menstrual") return "bg-red-600/20 border-red-500/40";
  if (phase === "Follicular") return "bg-emerald-600/15 border-emerald-500/30";
  if (phase === "Ovulation") return "bg-indigo-600/20 border-indigo-500/40";
  return "bg-yellow-600/15 border-yellow-500/30";
}

function phaseGradient(phase) {
  if (phase === "Menstrual") return "from-red-900/80 via-rose-800/60 to-red-900/40";
  if (phase === "Follicular") return "from-emerald-900/80 via-teal-800/60 to-emerald-900/40";
  if (phase === "Ovulation") return "from-indigo-900/80 via-violet-800/60 to-indigo-900/40";
  return "from-yellow-900/80 via-amber-800/60 to-yellow-900/40";
}

function phaseAccent(phase) {
  if (phase === "Menstrual") return { ring: "ring-red-400", text: "text-red-300", border: "border-red-400/60", glow: "shadow-red-500/40", dot: "bg-red-400", badge: "bg-red-500/20 border-red-400/50 text-red-200" };
  if (phase === "Follicular") return { ring: "ring-emerald-400", text: "text-emerald-300", border: "border-emerald-400/60", glow: "shadow-emerald-500/40", dot: "bg-emerald-400", badge: "bg-emerald-500/20 border-emerald-400/50 text-emerald-200" };
  if (phase === "Ovulation") return { ring: "ring-indigo-400", text: "text-indigo-300", border: "border-indigo-400/60", glow: "shadow-indigo-500/40", dot: "bg-indigo-400", badge: "bg-indigo-500/20 border-indigo-400/50 text-indigo-200" };
  return { ring: "ring-yellow-400", text: "text-yellow-300", border: "border-yellow-400/60", glow: "shadow-yellow-500/40", dot: "bg-yellow-400", badge: "bg-yellow-500/20 border-yellow-400/50 text-yellow-200" };
}

function phaseEmoji(phase) {
  if (phase === "Menstrual") return "🌑";
  if (phase === "Follicular") return "🌱";
  if (phase === "Ovulation") return "✨";
  return "🌕";
}

function phaseDescription(phase) {
  if (phase === "Menstrual") return "Rest & restore. Honor your body's renewal.";
  if (phase === "Follicular") return "Energy rising. Great time for new starts.";
  if (phase === "Ovulation") return "Peak energy. You're radiant & magnetic.";
  return "Wind down. Reflect, plan, and nurture yourself.";
}

export default function CycleCalendar({ days = [], loading = false }) {
  const todayData = days.find((d) => d.is_today === true || d.is_today === "true" || d.is_today === 1);
  const accent = todayData ? phaseAccent(todayData.phase) : null;
  const todayRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (todayRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const card = todayRef.current;
      const offset = card.offsetLeft - container.offsetWidth / 2 + card.offsetWidth / 2;
      container.scrollTo({ left: Math.max(0, offset), behavior: "smooth" });
    }
  }, [days]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 w-full">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Cycle Phase Calendar</h2>
          <p className="text-slate-300 text-sm mt-1">Next 28 days phase visualization</p>
        </div>
        <span className="px-2 py-1 rounded-full bg-slate-800 text-xs">Today</span>
      </div>

      {loading ? (
        <div className="mt-4 text-slate-400 text-sm">Loading cycle data...</div>
      ) : days.length === 0 ? (
        <div className="mt-4 text-slate-400 text-sm">
          No cycle data found. Please create profile and try again.
        </div>
      ) : (
        <>
          {/* ✨ TODAY HERO CARD */}
          {todayData && (
            <div
              className={`mt-5 relative overflow-hidden rounded-2xl border-2 ${accent.border} bg-gradient-to-br ${phaseGradient(todayData.phase)} shadow-2xl p-5`}
            >
              <div className={`absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-20 blur-2xl ${accent.dot}`} />
              <div className={`absolute -bottom-4 -left-4 w-24 h-24 rounded-full opacity-10 blur-2xl ${accent.dot}`} />

              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${accent.dot}`} />
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${accent.dot}`} />
                </span>
                <span className="text-xs text-white/60 font-medium tracking-widest uppercase">Live</span>
              </div>

              <div className="relative z-10 flex items-start gap-4">
                <div className="text-5xl leading-none select-none mt-1">
                  {phaseEmoji(todayData.phase)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-white/50 font-mono tracking-widest uppercase mb-1">
                    {todayData.date}
                  </div>
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-3xl font-extrabold text-white leading-none">
                      Day {todayData.cycle_day}
                    </span>
                    <span className={`text-sm font-bold px-3 py-1 rounded-full border ${accent.badge}`}>
                      {todayData.phase}
                    </span>
                  </div>
                  <p className={`mt-2 text-sm ${accent.text} leading-relaxed`}>
                    {phaseDescription(todayData.phase)}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-white/60">
                      <span className={`w-1.5 h-1.5 rounded-full ${accent.dot}`} />
                      Today's Phase
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-white/60">
                      <span className={`w-1.5 h-1.5 rounded-full ${accent.dot}`} />
                      Cycle Day {todayData.cycle_day} of 28
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Calendar grid — auto-scrolls to today */}
          <div ref={scrollRef} className="mt-5 overflow-x-auto">
            <div className="min-w-[700px] grid grid-cols-7 gap-4 py-2">
              {days.map((d) => {
                const isToday = d.is_today === true || d.is_today === "true" || d.is_today === 1;
                const a = phaseAccent(d.phase);

                return (
                  <div
                    key={d.date}
                    ref={isToday ? todayRef : null}
                    className={`rounded-xl border transition-all duration-200
                      ${isToday
                       ? `p-3 shadow-xl bg-gradient-to-b ${phaseGradient(d.phase)} border-2 ${a.border}`
                        : `p-2 ${phaseColor(d.phase)} hover:scale-[1.02] hover:opacity-90`}
                    `}
                  >
                    <div className={`text-[11px] ${isToday ? "text-white/70 font-semibold" : "text-slate-200"}`}>
                      {d.date.slice(5)}
                    </div>
                    <div className={`font-semibold mt-1 ${isToday ? "text-base text-white" : "text-sm"}`}>
                      Day {d.cycle_day}
                    </div>
                    <div className={`mt-1 ${isToday ? "text-xs font-bold " + a.text : "text-[10px]"}`}>
                      {isToday ? phaseEmoji(d.phase) + " " : ""}{d.phase}
                    </div>
                    {isToday && (
                      <>
                        <p className="mt-2 text-[10px] text-white/60 leading-relaxed">
                          {phaseDescription(d.phase)}
                        </p>
                        <div className={`mt-2 flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full border w-fit ${a.badge}`}>
                          <span className="relative flex h-1.5 w-1.5">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${a.dot}`} />
                            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${a.dot}`} />
                          </span>
                          Today
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-1 rounded-full bg-red-600/20 border border-red-500/40">🌑 Menstrual</span>
            <span className="px-2 py-1 rounded-full bg-emerald-600/15 border border-emerald-500/30">🌱 Follicular</span>
            <span className="px-2 py-1 rounded-full bg-indigo-600/20 border border-indigo-500/40">✨ Ovulation</span>
            <span className="px-2 py-1 rounded-full bg-yellow-600/15 border border-yellow-500/30">🌕 Luteal</span>
          </div>
        </>
      )}
    </div>
  );
}