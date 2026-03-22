export default function RiskAlert({ warning }) {
  if (!warning) return null;

  return (
    <div className="mt-3 rounded-2xl border border-red-500/60 bg-red-500/15 p-4">
      <div className="font-semibold text-red-200">🚨 Warning</div>
      <div className="text-sm text-red-100/90 mt-1">{warning}</div>
    </div>
  );
}
