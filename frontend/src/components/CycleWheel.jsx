export default function CycleWheel({ plan }) {
  const day = Number(plan?.cycle_day ?? 0);
  const cycleLen = 28;

  // ✅ progress %
  const pct = Math.min(100, Math.max(0, (day / cycleLen) * 100));

  // ✅ 4 separate colors (your palette)
  const menstrual = "#ff006e"; // hot pink
  const follicular = "#ff4da6"; // strong pink
  const ovulation = "#ff85c2"; // soft pink
  const luteal = "#ffc2dd"; // pastel

  // ✅ 4 equal segments (25% each) — hard cut segments (no blending)
  const ring = `conic-gradient(
    ${menstrual} 0% 25%,
    ${follicular} 25% 50%,
    ${ovulation} 50% 75%,
    ${luteal} 75% 100%
  )`;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="text-lg font-semibold">Cycle Wheel</div>
      <p className="text-sm text-slate-400 mt-1">
        Visual cycle progress (day {day}/{cycleLen})
      </p>

      <div className="mt-4 flex items-center gap-4">
        {/* ✅ Outer ring (4 separate colors) */}
        <div
          className="h-24 w-24 rounded-full flex items-center justify-center"
          style={{ background: ring }}
        >
          {/* ✅ Progress overlay ring */}
          <div
            className="h-20 w-20 rounded-full flex items-center justify-center"
            style={{
              background: `conic-gradient(
                rgba(255,255,255,0.35) ${pct}%,
                rgba(0,0,0,0.55) 0%
              )`,
            }}
          >
            {/* ✅ Center circle */}
            <div className="h-14 w-14 rounded-full bg-slate-950 flex items-center justify-center">
              <div className="text-lg font-extrabold text-white">
                {Math.round(pct)}%
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm text-slate-300">
          <div>
            Phase: <b>{plan?.phase ?? "-"}</b>
          </div>
          <div>
            Risk: <b>{plan?.risk_level ?? "-"}</b>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            4-color ring → phase distribution
          </div>
        </div>
      </div>
    </div>
  );
}
