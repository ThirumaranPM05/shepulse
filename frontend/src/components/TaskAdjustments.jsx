export default function TaskAdjustments({ adjustments, readiness }) {
  const config = {
    High: {
      icon: "⚡",
      title: "Task Recommendations",
      subtitle: "Employee is at full capacity — assign accordingly",
      border: "border-emerald-500/20",
      bg: "bg-emerald-950/20",
      headerBg: "bg-emerald-500/10",
      headerBorder: "border-emerald-500/30",
      text: "text-emerald-300",
      iconBg: "bg-emerald-500/20",
      iconBorder: "border-emerald-500/30",
      tickColor: "text-emerald-400",
      itemBorder: "border-emerald-500/10",
      itemBg: "bg-emerald-950/20",
    },
    Medium: {
      icon: "📋",
      title: "Task Recommendations",
      subtitle: "Standard workload with minor considerations",
      border: "border-yellow-500/20",
      bg: "bg-yellow-950/20",
      headerBg: "bg-yellow-500/10",
      headerBorder: "border-yellow-500/30",
      text: "text-yellow-300",
      iconBg: "bg-yellow-500/20",
      iconBorder: "border-yellow-500/30",
      tickColor: "text-yellow-400",
      itemBorder: "border-yellow-500/10",
      itemBg: "bg-yellow-950/20",
    },
    Low: {
      icon: "🛡️",
      title: "Task Recommendations",
      subtitle: "Reduced capacity — lighter workload advised",
      border: "border-red-500/20",
      bg: "bg-red-950/20",
      headerBg: "bg-red-500/10",
      headerBorder: "border-red-500/30",
      text: "text-red-300",
      iconBg: "bg-red-500/20",
      iconBorder: "border-red-500/30",
      tickColor: "text-red-400",
      itemBorder: "border-red-500/10",
      itemBg: "bg-red-950/20",
    },
  };

  const c = config[readiness] || config["Medium"];

  return (
    <div className={`rounded-2xl border ${c.border} ${c.bg} p-5`}>
      {/* Header */}
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${c.headerBorder} ${c.headerBg}`}>
        <div className={`w-9 h-9 rounded-xl border ${c.iconBorder} ${c.iconBg} flex items-center justify-center text-lg`}>
          {c.icon}
        </div>
        <div>
          <div className={`text-sm font-bold ${c.text}`}>{c.title}</div>
          <div className="text-xs text-white/40 mt-0.5">{c.subtitle}</div>
        </div>

        {/* Readiness pill */}
        <div className={`ml-auto px-3 py-1 rounded-full border ${c.headerBorder} ${c.headerBg}`}>
          <span className={`text-xs font-bold ${c.text}`}>{readiness} Readiness</span>
        </div>
      </div>

      {/* Adjustment items */}
      <div className="mt-4 grid gap-2">
        {adjustments.map((item, i) => (
          <div
            key={i}
            className={`
              flex items-start gap-3 px-4 py-3 rounded-xl
              border ${c.itemBorder} ${c.itemBg}
              transition-all duration-200 hover:bg-white/5
            `}
          >
            {/* Number badge */}
            <div className={`
              shrink-0 w-6 h-6 rounded-lg border ${c.iconBorder} ${c.iconBg}
              flex items-center justify-center
              text-[11px] font-bold ${c.text}
            `}>
              {i + 1}
            </div>

            {/* Text */}
            <div className="flex-1">
              <p className="text-sm text-white/80 leading-relaxed">{item}</p>
            </div>

            {/* Tick */}
            <div className={`shrink-0 text-base ${c.tickColor}`}>✓</div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/4 border border-white/8">
        <span className="text-sm">💡</span>
        <span className="text-[11px] text-white/40 leading-relaxed">
          These recommendations are generated without accessing any personal health data.
          They are based solely on the abstracted readiness level.
        </span>
      </div>
    </div>
  );
}