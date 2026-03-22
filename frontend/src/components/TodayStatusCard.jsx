export default function TodayStatusCard({ plan }) {
  return (
    <div className="rounded-2xl border border-pink-500/25 bg-[#1a0012]/60 p-5 shadow-lg shadow-pink-500/10">
      <div className="text-lg font-semibold text-white">Today Status</div>
      <p className="text-sm text-white/70 mt-1">
        Quick summary of today’s condition
      </p>

      <div className="mt-4 grid gap-2 text-sm">
        <div className="rounded-xl border border-pink-500/20 bg-[#0f000a]/60 p-3 flex items-center justify-between">
          <span className="text-white/75">Energy Score</span>
          <b className="text-white">{plan?.energy_score ?? "-"}</b>
        </div>

        <div className="rounded-xl border border-pink-500/20 bg-[#0f000a]/60 p-3 flex items-center justify-between">
          <span className="text-white/75">Risk Level</span>
          <b className="text-white">{plan?.risk_level ?? "-"}</b>
        </div>

        <div className="rounded-xl border border-pink-500/20 bg-[#0f000a]/60 p-3 flex items-center justify-between">
          <span className="text-white/75">Phase</span>
          <b className="text-white">{plan?.phase ?? "-"}</b>
        </div>
      </div>
    </div>
  );
}
