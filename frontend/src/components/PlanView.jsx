export default function PlanView({ plan }) {
  if (!plan) {
    return (
      <div className="text-slate-400 text-sm">
        Loading plan...
      </div>
    );
  }

  const blocks = Array.isArray(plan.blocks) ? plan.blocks : [];

  return (
    <div className="grid gap-3">
      {/* Top Info */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-200">
          Cycle Day: {plan.cycle_day ?? "-"}
        </span>

        <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-200">
          Phase: {plan.phase ?? "-"}
        </span>

        <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-200">
          Energy Score: {plan.energy_score ?? "-"}
        </span>

        <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-200">
          Risk: {plan.risk_level ?? "-"}
        </span>
      </div>

      {/* Warning */}
      {plan.warning ? (
        <div className="rounded-2xl border border-red-900 bg-red-950/30 text-red-200 p-3 text-sm">
          ⚠️ {plan.warning}
        </div>
      ) : null}

      {/* Blocks */}
      {blocks.length === 0 ? (
        <div className="text-slate-400 text-sm">
          No timeline blocks yet. Add tasks to generate a plan.
        </div>
      ) : (
        <div className="grid gap-2">
          {blocks.map((b, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800 bg-slate-950 p-3 flex items-center justify-between"
            >
              <div>
                <div className="text-slate-100 font-semibold">
                  {b.label || "Task"}
                </div>
                <div className="text-slate-400 text-xs">
                  {b.start} - {b.end}
                </div>
              </div>

              <span className="text-xs px-3 py-1 rounded-full border border-slate-700 bg-slate-900 text-slate-200">
                {String(b.block_type || "task").toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
