import { useEffect, useMemo, useState } from "react";
import { api } from "../api/api.js";
import ThemeBanner from "../components/ThemeBanner.jsx";
import RiskAlert from "../components/RiskAlert.jsx";
import TaskForm from "../components/TaskForm.jsx";
import Timeline from "../components/Timeline.jsx";
import CheckIn from "./CheckIn.jsx";
import CycleCalendar from "../components/CycleCalendar.jsx";
import CareChat from "../components/CareChat.jsx";
import CycleWheel from "../components/CycleWheel.jsx";
import PeriodCountdownCard from "../components/PeriodCountdownCard.jsx";
import TodayStatusCard from "../components/TodayStatusCard.jsx";

import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function Dashboard({ profileId, onResetProfile, onViewWorkplace }) {
  const [plan, setPlan] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [cycleDays, setCycleDays] = useState([]);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [loadingCycle, setLoadingCycle] = useState(false);
  const [agentErr, setAgentErr] = useState("");
  const [err, setErr] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [trend, setTrend] = useState([]);

  const theme = useMemo(() => plan?.theme || "yellow", [plan]);

  async function fetchTasks() {
    const res = await api.get(`/tasks/${profileId}`);
    setTasks(res.data || []);
  }

  async function fetchPlan() {
    setAgentErr("");
    setLoadingPlan(true);
    try {
      const res = await api.get(`/plan/${profileId}`);
      setPlan(res.data);
    } catch (e) {
      setAgentErr("Failed to load plan.");
      console.log(e);
    } finally {
      setLoadingPlan(false);
    }
  }

  async function fetchCycleChart() {
    if (!profileId) {
      setCycleDays([]);
      return;
    }
    setLoadingCycle(true);
    try {
      const res = await api.get(`/calendar/${profileId}?days=28`);
      setCycleDays(res.data || []);
    } catch (e) {
      console.log("Cycle chart fetch failed:", e);
      setCycleDays([]);
    } finally {
      setLoadingCycle(false);
    }
  }

  async function fetchTrend() {
    try {
      const res = await api.get(`/metrics/last/${profileId}?days=7`);
      if (!res.data || res.data.length === 0) {
        setTrend([]);
        return;
      }
      setTrend(
        res.data.map((r) => ({
          day: r.date.slice(5),
          energy: Number(r.energy_score),
        }))
      );
    } catch (e) {
      console.log("Trend fetch failed:", e);
      setTrend([]);
    }
  }

  async function runRescheduleAgent() {
    setAgentErr("");
    setLoadingPlan(true);
    try {
      const res = await api.post(`/agent/replan/${profileId}`);
      setPlan(res.data);
      setAgentErr("");
    } catch (e) {
      console.error(e);
      setAgentErr("Agent failed to replan.");
    } finally {
      setLoadingPlan(false);
    }
  }

  async function refreshAll() {
    if (!profileId) return;
    setAgentErr("");
    await fetchTasks();
    await fetchCycleChart();
    await fetchTrend();
    await fetchPlan();
  }

  useEffect(() => {
    if (!profileId) return;
    refreshAll();
  }, [profileId]);

  async function deleteTask(taskId) {
    if (!taskId) return;
    const ok = confirm("Delete this task?");
    if (!ok) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      await refreshAll();
    } catch (e) {
      console.log(e);
      alert("Failed to delete task");
    }
  }

  function openEdit(t) {
    setEditTask({
      id: t.id,
      title: t.title,
      duration_min: t.duration_min,
      priority: t.priority,
      task_type: t.task_type,
    });
    setEditOpen(true);
  }

  async function saveEdit() {
    try {
      await api.put(`/tasks/${editTask.id}`, {
        title: editTask.title,
        duration_min: Number(editTask.duration_min),
        priority: Number(editTask.priority),
        task_type: editTask.task_type,
      });
      setEditOpen(false);
      setEditTask(null);
      await refreshAll();
    } catch (e) {
      console.log(e);
      alert("Failed to update task");
    }
  }

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="w-full min-h-screen px-3 sm:px-6 lg:px-10 py-6 grid gap-4">

      {/* ── Sticky Navigation ── */}
      <div className="sticky top-3 z-40">
        <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md px-4 py-3 flex items-center justify-between gap-3">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="text-xl sm:text-2xl font-extrabold text-white whitespace-nowrap">
              🎀 She Pulse 💖
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {[
              ["Overview",    "sec-banner"],
              ["Calendar",    "sec-calendar"],
              ["Status",      "sec-widgets"],
              ["Energy Trend","sec-trend"],
              ["Plan",        "sec-plan"],
              ["Check-in",    "sec-checkin"],
              ["Chat",        "sec-chat"],
              ["Tasks",       "sec-tasks"],
            ].map(([label, id]) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 transition text-sm font-semibold"
              >
                {label}
              </button>
            ))}
          </div>

          {/* Right buttons */}
          <div className="flex items-center gap-2">
            {/* ✅ Workplace View button */}
            <button
              onClick={onViewWorkplace}
              className="px-4 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/40 hover:bg-emerald-600/30 transition text-sm font-semibold text-emerald-300 whitespace-nowrap"
            >
              🏢 Workplace View
            </button>
            <button
              onClick={onResetProfile}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition text-sm font-semibold whitespace-nowrap"
            >
              Reset Profile
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="mt-2 md:hidden w-full rounded-2xl border border-slate-800 bg-slate-900/75 backdrop-blur-md p-2 flex gap-2 overflow-x-auto">
          {[
            ["Overview",    "sec-banner"],
            ["Calendar",    "sec-calendar"],
            ["Status",      "sec-widgets"],
            ["Energy Trend","sec-trend"],
            ["Plan",        "sec-plan"],
            ["Check-in",    "sec-checkin"],
            ["Chat",        "sec-chat"],
            ["Tasks",       "sec-tasks"],
          ].map(([label, id]) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition text-xs font-semibold whitespace-nowrap"
            >
              {label}
            </button>
          ))}
          {/* ✅ Mobile workplace button */}
          <button
            onClick={onViewWorkplace}
            className="px-3 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/40 hover:bg-emerald-600/30 transition text-xs font-semibold whitespace-nowrap text-emerald-300"
          >
            🏢 Workplace
          </button>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="w-full max-w-[1400px] mx-auto grid gap-4">

        {/* Banner */}
        <section id="sec-banner" className="scroll-mt-28">
          <ThemeBanner theme={theme} plan={plan} />
        </section>

        {/* Calendar */}
        <section id="sec-calendar" className="scroll-mt-28">
          <CycleCalendar days={cycleDays} loading={loadingCycle} />
        </section>

        {/* Widgets */}
        <section id="sec-widgets" className="scroll-mt-28">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CycleWheel plan={plan} />
            <PeriodCountdownCard plan={plan} />
            <TodayStatusCard plan={plan} />
          </div>
        </section>

        {/* Energy Trend */}
        <section id="sec-trend" className="scroll-mt-28">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">Energy Trend</h2>
                <p className="text-slate-300 text-sm mt-1">
                  Previous days energy score visualization
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-800 text-xs">
                Last 7 Days
              </span>
            </div>
            <div className="mt-4 h-44">
              {trend.length === 0 ? (
                <div className="text-slate-300 text-sm">No trend data yet.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trend}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="day" />
                    <YAxis
                      domain={[
                        (min) => Math.max(0, min - 10),
                        (max) => Math.min(100, max + 10),
                      ]}
                    />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="energy"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">

          {/* Plan */}
          <section id="sec-plan" className="scroll-mt-28 lg:col-span-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">Today Plan</h2>
                  <p className="text-slate-300 text-sm">
                    Auto-generated from cycle + check-in + energy score
                  </p>
                </div>
                <button
                  onClick={runRescheduleAgent}
                  className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 transition font-semibold w-full sm:w-auto shadow-lg shadow-pink-500/30"
                >
                  Reschedule Agent
                </button>
              </div>

              <div className="mt-4">
                {loadingPlan ? (
                  <div className="text-slate-300">Loading plan...</div>
                ) : plan ? (
                  <>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="px-3 py-1 rounded-full bg-slate-800">
                        Cycle Day: <b>{plan.cycle_day}</b>
                      </span>
                      <span className="px-3 py-1 rounded-full bg-slate-800">
                        Phase: <b>{plan.phase}</b>
                      </span>
                      <span className="px-3 py-1 rounded-full bg-slate-800">
                        Energy Score: <b>{plan.energy_score}</b>
                      </span>
                      <span className="px-3 py-1 rounded-full bg-slate-800">
                        Risk: <b>{plan.risk_level}</b>
                      </span>
                    </div>
                    <RiskAlert warning={plan.warning} />
                    <div className="mt-4">
                      <Timeline blocks={plan.blocks || []} theme={theme} />
                    </div>
                  </>
                ) : (
                  <div className="text-slate-300">
                    No plan data found. Add tasks and check-in to generate a plan.
                  </div>
                )}
                {agentErr && !loadingPlan ? (
                  <div className="mt-3 text-sm text-red-300 bg-red-950/40 border border-red-900 rounded-xl p-3">
                    {agentErr}
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          {/* Right stack */}
          <div className="grid gap-4">

            {/* Check-in */}
            <section id="sec-checkin" className="scroll-mt-28">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <h2 className="text-xl font-semibold">Daily Check-in</h2>
                <p className="text-slate-300 text-sm mt-1">
                  Save check-in → plan updates instantly
                </p>
                <div className="mt-4">
                  <CheckIn
                    profileId={profileId}
                    onSaved={async () => { await refreshAll(); }}
                  />
                </div>
              </div>
            </section>

            {/* Chat */}
            <section id="sec-chat" className="scroll-mt-28">
              <CareChat profileId={profileId} />
            </section>

            {/* Tasks */}
            <section id="sec-tasks" className="scroll-mt-28">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold">Tasks</h2>
                    <p className="text-slate-300 text-sm mt-1">
                      Add tasks and the planner will schedule them.
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <TaskForm
                    profileId={profileId}
                    onAdded={async () => { await refreshAll(); }}
                  />
                </div>
                <div className="mt-4 grid gap-2">
                  {tasks.length === 0 ? (
                    <div className="text-slate-400 text-sm">No tasks added yet.</div>
                  ) : (
                    tasks.map((t) => (
                      <div
                        key={t.id}
                        className="rounded-xl border border-slate-800 bg-slate-950 p-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-semibold">{t.title}</div>
                            <div className="text-xs text-slate-400 mt-1">
                              {t.task_type.toUpperCase()} • {t.duration_min} mins • Priority {t.priority}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEdit(t)}
                              className="px-3 py-1 rounded-lg bg-pink-600 hover:bg-pink-500 text-xs font-semibold"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteTask(t.id)}
                              className="px-3 py-1 rounded-lg bg-rose-700 hover:bg-rose-600 text-xs font-semibold"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* ── Edit Modal ── */}
      {editOpen && editTask ? (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-5">
            <div className="text-lg font-semibold">Edit Task</div>
            <p className="text-sm text-slate-400 mt-1">
              Update title, duration, priority and type
            </p>
            <div className="mt-4 grid gap-3">
              <input
                value={editTask.title}
                onChange={(e) => setEditTask((p) => ({ ...p, title: e.target.value }))}
                className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-white outline-none"
                placeholder="Task title"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  min="5"
                  value={editTask.duration_min}
                  onChange={(e) => setEditTask((p) => ({ ...p, duration_min: e.target.value }))}
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-white outline-none"
                  placeholder="Minutes"
                />
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={editTask.priority}
                  onChange={(e) => setEditTask((p) => ({ ...p, priority: e.target.value }))}
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-white outline-none"
                  placeholder="Priority"
                />
              </div>
              <select
                value={editTask.task_type}
                onChange={(e) => setEditTask((p) => ({ ...p, task_type: e.target.value }))}
                className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-white outline-none"
              >
                <option value="light">Light</option>
                <option value="medium">Medium</option>
                <option value="deep">Deep</option>
              </select>
            </div>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => { setEditOpen(false); setEditTask(null); }}
                className="flex-1 rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="flex-1 rounded-xl bg-pink-600 hover:bg-pink-500 px-4 py-2 font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}