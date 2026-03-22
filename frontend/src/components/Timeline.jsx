function chipClass(theme, blockType) {
  if (blockType === "break") return "bg-slate-800 text-slate-200";

  if (theme === "green") return "bg-emerald-600/20 text-emerald-200 border-emerald-500/40";
  if (theme === "yellow") return "bg-yellow-600/20 text-yellow-200 border-yellow-500/40";
  return "bg-red-600/25 text-red-200 border-red-500/60"; // strong contrast for weak energy
}

export default function Timeline({ blocks = [], theme = "yellow" }) {
  if (!blocks.length) {
    return (
      <div className="text-slate-400 text-sm">
        No timeline blocks yet. Add tasks to generate a plan.
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      {blocks.map((b, idx) => (
        <div
          key={idx}
          className={`rounded-xl border border-slate-800 bg-slate-950 p-3 flex items-center justify-between gap-4`}
        >
          <div>
            <div className="font-semibold">{b.label}</div>
            <div className="text-xs text-slate-400 mt-1">
              {b.start} - {b.end}
            </div>
          </div>

          <span
            className={`text-xs px-3 py-1 rounded-full border ${chipClass(theme, b.block_type)}`}
          >
            {b.block_type.toUpperCase()}
          </span>
        </div>
      ))}
    </div>
  );
}
