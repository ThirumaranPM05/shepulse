export default function Accommodations({ accommodations, readiness }) {
  const config = {
    High: {
      icon: "🏢",
      title: "Workplace Accommodations",
      subtitle: "No special accommodations required today",
      border: "border-emerald-500/20",
      bg: "bg-emerald-950/20",
      headerBg: "bg-emerald-500/10",
      headerBorder: "border-emerald-500/30",
      text: "text-emerald-300",
      iconBg: "bg-emerald-500/20",
      iconBorder: "border-emerald-500/30",
      itemBorder: "border-emerald-500/10",
      itemBg: "bg-emerald-950/20",
      dot: "bg-emerald-400",
      icons: ["✅", "🤝", "💼", "🚀"],
    },
    Medium: {
      icon: "🏠",
      title: "Workplace Accommodations",
      subtitle: "Minor flexibility support recommended",
      border: "border-yellow-500/20",
      bg: "bg-yellow-950/20",
      headerBg: "bg-yellow-500/10",
      headerBorder: "border-yellow-500/30",
      text: "text-yellow-300",
      iconBg: "bg-yellow-500/20",
      iconBorder: "border-yellow-500/30",
      itemBorder: "border-yellow-500/10",
      itemBg: "bg-yellow-950/20",
      dot: "bg-yellow-400",
      icons: ["🕐", "☕", "💻", "🔕"],
    },
    Low: {
      icon: "💙",
      title: "Workplace Accommodations",
      subtitle: "Flexibility and support strongly recommended",
      border: "border-red-500/20",
      bg: "bg-red-950/20",
      headerBg: "bg-red-500/10",
      headerBorder: "border-red-500/30",
      text: "text-red-300",
      iconBg: "bg-red-500/20",
      iconBorder: "border-red-500/30",
      itemBorder: "border-red-500/10",
      itemBg: "bg-red-950/20",
      dot: "bg-red-400",
      icons: ["🏡", "🔇", "⏰", "🛋️"],
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

        {/* Engine tag */}
        <div className={`ml-auto px-3 py-1 rounded-full border ${c.headerBorder} ${c.headerBg}`}>
          <span className={`text-xs font-bold ${c.text}`}>Engine 2.1</span>
        </div>
      </div>

      {/* Accommodation cards */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {accommodations.map((item, i) => (
          <div
            key={i}
            className={`
              flex items-start gap-3 px-4 py-3 rounded-xl
              border ${c.itemBorder} ${c.itemBg}
              transition-all duration-200 hover:bg-white/5
            `}
          >
            {/* Icon */}
            <div className={`
              shrink-0 w-8 h-8 rounded-xl border ${c.iconBorder} ${c.iconBg}
              flex items-center justify-center text-base
            `}>
              {c.icons[i] || "📌"}
            </div>

            {/* Text */}
            <div className="flex-1">
              <p className="text-sm text-white/80 leading-relaxed">{item}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Dignity statement */}
      <div className={`
        mt-4 flex items-start gap-3 px-4 py-3 rounded-xl
        border ${c.headerBorder} ${c.headerBg}
      `}>
        <span className="text-lg shrink-0">⚖️</span>
        <div>
          <div className={`text-xs font-bold ${c.text}`}>
            Dignity-First Policy
          </div>
          <p className="text-[11px] text-white/40 mt-1 leading-relaxed">
            These accommodations are suggested to support employee wellbeing
            and productivity. No reason or health explanation is required
            from the employee to receive these adjustments.
          </p>
        </div>
      </div>
    </div>
  );
}