import { useState } from "react";
import { api } from "../api/api.js";

export default function CheckIn({ profileId, onSaved }) {
  const [energy, setEnergy] = useState(3);
  const [mood, setMood] = useState(3);
  const [sleep, setSleep] = useState("");

  const [cramps, setCramps] = useState(false);
  const [headache, setHeadache] = useState(false);
  const [stress, setStress] = useState(false);
  const [bloating, setBloating] = useState(false);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  function todayISODate() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  async function saveCheckin(e) {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (!profileId) {
      setErr("Profile ID missing. Please complete Setup first.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        date: todayISODate(),
        energy_level: Number(energy),
        mood_level: Number(mood),
        sleep_hours: sleep === "" ? null : Number(sleep),
        cramps: Boolean(cramps),
        headache: Boolean(headache),
        stress: Boolean(stress),
        bloating: Boolean(bloating),
      };

      const res = await api.post(`/checkin/${profileId}`, payload);

      setMsg(
        `✅ Saved | Risk: ${res.data?.risk_level} | Energy Score: ${res.data?.energy_score}`
      );
setErr("");
      if (onSaved) await onSaved();
    } catch (e2) {
      console.log(e2);

      const backendDetail = e2?.response?.data?.detail;
      const backendRaw = e2?.response?.data;

      const readable =
        typeof backendDetail === "string"
          ? backendDetail
          : backendDetail
          ? JSON.stringify(backendDetail)
          : backendRaw
          ? JSON.stringify(backendRaw)
          : e2?.message || "Failed to save check-in.";

      setErr(readable);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white">Daily Check-in</h3>
            <p className="text-sm text-slate-400">
              30 seconds check-in → better plan + better health
            </p>
          </div>

          <span className="text-xs px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-200">
            Today
          </span>
        </div>

        <form onSubmit={saveCheckin} className="mt-5 grid gap-4">
          {/* Energy */}
          <div>
            <label className="text-sm text-slate-300">Energy Level (1–5)</label>
            <select
              value={energy}
              onChange={(e) => setEnergy(e.target.value)}
              className="mt-1 w-full rounded-2xl bg-slate-900 border border-slate-700 px-3 py-2 text-white outline-none"
            >
              <option value={1}>1 (Very Low)</option>
              <option value={2}>2 (Low)</option>
              <option value={3}>3 (Normal)</option>
              <option value={4}>4 (Good)</option>
              <option value={5}>5 (Very High)</option>
            </select>
          </div>

          {/* Mood */}
          <div>
            <label className="text-sm text-slate-300">Mood Level (1–5)</label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="mt-1 w-full rounded-2xl bg-slate-900 border border-slate-700 px-3 py-2 text-white outline-none"
            >
              <option value={1}>1 (Bad)</option>
              <option value={2}>2 (Low)</option>
              <option value={3}>3 (Okay)</option>
              <option value={4}>4 (Good)</option>
              <option value={5}>5 (Great)</option>
            </select>
          </div>

          {/* Sleep */}
          <div>
            <label className="text-sm text-slate-300">
              Sleep Hours (optional)
            </label>
            <input
              type="number"
              min="0"
              max="24"
              value={sleep}
              onChange={(e) => setSleep(e.target.value)}
              placeholder="e.g., 6"
              className="mt-1 w-full rounded-2xl bg-slate-900 border border-slate-700 px-3 py-2 text-white outline-none"
            />
          </div>

          {/* Symptoms */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
            <div className="font-semibold text-slate-200 text-sm">Symptoms</div>

            <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-slate-300">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={cramps}
                  onChange={(e) => setCramps(e.target.checked)}
                />
                Cramps
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={headache}
                  onChange={(e) => setHeadache(e.target.checked)}
                />
                Headache
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={stress}
                  onChange={(e) => setStress(e.target.checked)}
                />
                Stress
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={bloating}
                  onChange={(e) => setBloating(e.target.checked)}
                />
                Bloating
              </label>
            </div>
          </div>

          {/* Save Button */}
          <button
            disabled={loading}
            className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-500 transition px-4 py-3 font-semibold disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Check-in"}
          </button>

          {/* Message */}
          {msg ? (
            <div className="text-sm text-emerald-300 bg-emerald-950/30 border border-emerald-900 rounded-2xl p-3">
              {msg}
            </div>
          ) : null}

          {err ? (
            <div className="text-sm text-red-300 bg-red-950/30 border border-red-900 rounded-2xl p-3">
              {err}
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
}
