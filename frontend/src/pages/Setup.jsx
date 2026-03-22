import { useState } from "react";
import { api } from "../api/api.js";

export default function Setup({ onCreated }) {
  const [name, setName] = useState("");
  const [lastPeriodDate, setLastPeriodDate] = useState("");
  const [cycleLength, setCycleLength] = useState(28);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function createProfile(e) {
    e.preventDefault();
    setErr("");

    if (!name.trim()) {
      setErr("Name is required.");
      return;
    }

    if (!lastPeriodDate) {
      setErr("Last period date is required.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: name.trim(),
        last_period_date: lastPeriodDate, // must be YYYY-MM-DD
        cycle_length: Number(cycleLength),
      };

      console.log("Creating profile payload:", payload);

      const res = await api.post("/profile/", payload);

      console.log("Profile created:", res.data);

      if (onCreated) onCreated(res.data);

    } catch (e2) {
      console.log("Create profile error:", e2);

      const msg =
        e2?.response?.data?.detail ||
        (typeof e2?.response?.data === "string"
          ? e2.response.data
          : JSON.stringify(e2?.response?.data || {})) ||
        "Failed to create profile.";

      setErr(msg);

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto px-4 md:px-6 py-8">
      <div className="rounded-3xl border border-pink-300/30 bg-pink-950/40 p-6 shadow-2xl shadow-pink-500/10">

        <h1 className="text-3xl font-extrabold text-pink-50 tracking-wide">
          🎀 She Pulse 💖
        </h1>

        <p className="text-pink-100/80 mt-2 text-sm leading-relaxed">
          💝 Let’s plan your day with balance, glow & confidence 💗
        </p>

        <form onSubmit={createProfile} className="mt-6 grid gap-4">

          <div>
            <label className="text-sm text-pink-100/90">Name</label>
            <input
              className="mt-1 w-full rounded-2xl bg-pink-950/40 border border-pink-300/20 px-4 py-3 text-pink-50 placeholder:text-pink-200/40 outline-none focus:border-pink-400/60"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Lia"
            />
          </div>

          <div>
            <label className="text-sm text-pink-100/90">
              Last Period Start Date
            </label>
            <input
              type="date"
              className="mt-1 w-full rounded-2xl bg-pink-950/40 border border-pink-300/20 px-4 py-3 text-pink-50 outline-none focus:border-pink-400/60"
              value={lastPeriodDate}
              onChange={(e) => setLastPeriodDate(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-pink-100/90">
              Cycle Length (days)
            </label>
            <input
              type="number"
              min="20"
              max="40"
              className="mt-1 w-full rounded-2xl bg-pink-950/40 border border-pink-300/20 px-4 py-3 text-pink-50 outline-none focus:border-pink-400/60"
              value={cycleLength}
              onChange={(e) => setCycleLength(Number(e.target.value))}
              placeholder="28"
            />
          </div>

          {err && (
            <div className="text-sm text-rose-200 bg-rose-950/30 border border-rose-500/30 rounded-2xl p-3">
              {err}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-pink-600 to-fuchsia-500 hover:from-pink-500 hover:to-fuchsia-400 transition px-4 py-3 font-bold text-white disabled:opacity-60 shadow-lg shadow-pink-500/20"
          >
            {loading ? "Creating..." : "Create Profile"}
          </button>

          <div className="text-xs text-pink-100/50 mt-1">
            💗 Your data stays safe. You can reset anytime.
          </div>

        </form>
      </div>
    </div>
  );
}
