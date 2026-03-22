function getThemeClasses(theme) {
  if (theme === "green") {
    return "border-emerald-500/40 bg-emerald-500/10";
  }
  if (theme === "yellow") {
    return "border-yellow-500/40 bg-yellow-500/10";
  }
  return "border-red-500/70 bg-red-500/20";
}

function getTitle(theme) {
  if (theme === "green") return "Peak Mode 🟢";
  if (theme === "yellow") return "Balanced Mode 🟡";
  return "Recovery Mode 🔴";
}

// ✅ Short line below mode (with perfect emoji)
function getDesc(theme) {
  if (theme === "green") return "High energy day focus on important tasks 🚀";
  if (theme === "yellow") return "Balanced day mix work breaks and routine 🌿";
  return "Low energy day keep tasks light and recover 🧘";
}

export default function ThemeBanner({ theme, plan }) {
  return (
    <div className={`rounded-2xl border p-5 md:p-6 ${getThemeClasses(theme)}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">{getTitle(theme)}</h2>

          {/* ✅ New description line */}
          <p className="mt-1 text-sm text-slate-300">{getDesc(theme)}</p>
        </div>

        <div className="text-sm bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2">
          {plan ? (
            <>
              <span className="text-slate-300">Energy Score: </span>
              <b>{plan.energy_score}</b>
            </>
          ) : (
            <span className="text-slate-300">No plan generated yet</span>
          )}
        </div>
      </div>
    </div>
  );
}
