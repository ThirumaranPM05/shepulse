export default function ReadinessBadge({ readiness }) {
  const config = {
    High: {
      label: "High Readiness",
      emoji: "🟢",
      bg: "bg-emerald-900/40",
      border: "border-emerald-500/50",
      text: "text-emerald-300",
      glow: "shadow-emerald-500/30",
      ring: "ring-emerald-500/40",
      bar: "bg-emerald-400",
      barWidth: "w-full",
      dot: "bg-emerald-400",
      description: "Fully available and operating at peak performance.",
      percent: 95,
    },
    Medium: {
      label: "Medium Readiness",
      emoji: "🟡",
      bg: "bg-yellow-900/40",
      border: "border-yellow-500/50",
      text: "text-yellow-300",
      glow: "shadow-yellow-500/30",
      ring: "ring-yellow-500/40",
      bar: "bg-yellow-400",
      barWidth: "w-2/3",
      dot: "bg-yellow-400",
      description: "Moderately available. Standard workload is appropriate.",
      percent: 60,
    },
    Low: {
      label: "Low Readiness",
      emoji: "🔴",
      bg: "bg-red-900/40",
      border: "border-red-500/50",
      text: "text-red-300",
      glow: "shadow-red-500/30",
      ring: "ring-red-500/40",
      bar: "bg-red-400",
      barWidth: "w-1/3",
      dot: "bg-red-400",
      description: "Reduced capacity today. Lighter workload recommended.",
      percent: 25,
    },
  };

  const c = config[readiness] || config["Medium"];

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl border-2 ${c.border}
        ${c.bg} shadow-2xl ${c.glow} p-6
      `}
    >
      {/* Glowing orb background */}
      <div className={`absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10 blur-3xl ${c.dot}`} />
      <div className={`absolute -bottom-6 -left-6 w-28 h-28 rounded-full opacity-10 blur-2xl ${c.dot}`} />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-widest uppercase text-white/40">
              Engine 2 Output
            </span>
          </div>
          {/* Pulsing live dot */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${c.dot}`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${c.dot}`} />
            </span>
            <span className="text-xs text-white/50 tracking-widest uppercase">Live</span>
          </div>
        </div>

        {/* Big readiness label */}
        <div className="mt-4 flex items-center gap-4">
          <div
            className={`
              w-20 h-20 rounded-2xl border-2 ${c.border} ${c.bg}
              flex items-center justify-center text-4xl
              ring-4 ${c.ring} shadow-xl
            `}
          >
            {c.emoji}
          </div>
          <div>
            <div className="text-xs text-white/40 uppercase tracking-widest mb-1">
              Today's Readiness
            </div>
            <div className={`text-4xl font-extrabold ${c.text}`}>
              {readiness}
            </div>
            <div className="text-sm text-white/50 mt-1">{c.label}</div>
          </div>
        </div>

        {/* Description */}
        <p className={`mt-4 text-sm ${c.text} leading-relaxed`}>
          {c.description}
        </p>

        {/* Progress bar */}
        <div className="mt-5">
          <div className="flex justify-between text-xs text-white/40 mb-2">
            <span>Readiness Score</span>
            <span>{c.percent}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-white/10">
            <div
              className={`h-2.5 rounded-full ${c.bar} transition-all duration-700`}
              style={{ width: `${c.percent}%` }}
            />
          </div>
        </div>

        {/* Privacy guarantee */}
        <div className="mt-5 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
          <span className="text-base">🔒</span>
          <span className="text-xs text-white/40">
            No health data was used to generate this indicator
          </span>
        </div>
      </div>
    </div>
  );
}