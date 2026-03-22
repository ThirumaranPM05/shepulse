export default function PeriodCountdownCard({ plan }) {
  const day = plan?.cycle_day ?? null;
  const cycleLen = 28;

  let daysLeft = "-";
  if (typeof day === "number" && day > 0) {
    const mod = day % cycleLen;
    daysLeft = mod === 0 ? 0 : cycleLen - mod;
  }

  return (
    <div className="rounded-2xl border border-pink-500/25 bg-[#1a0012]/60 p-5 shadow-lg shadow-pink-500/10">
      <div className="text-lg font-semibold text-white">Next Period</div>
      <p className="text-sm text-white/70 mt-1">
        Countdown based on average cycle length
      </p>

      <div className="mt-4 rounded-2xl border border-pink-500/20 bg-[#0f000a]/60 p-4">
        <div className="text-sm text-white/60">Estimated in</div>

        <div className="text-3xl font-bold mt-1 text-white">
          {daysLeft} <span className="text-base font-semibold text-white/75">days</span>
        </div>

        <div className="text-xs text-white/50 mt-2">
          (Approximation for demo)
        </div>
      </div>
    </div>
  );
}
