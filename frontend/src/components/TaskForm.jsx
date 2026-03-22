import { useState } from "react";
import { api } from "../api/api.js";

export default function TaskForm({ profileId, onAdded }) {
  const [title, setTitle] = useState("");
  const [taskType, setTaskType] = useState("light");
  const [duration, setDuration] = useState(30);
  const [priority, setPriority] = useState(1); // ✅ 1 = HIGH
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function addTask(e) {
    e.preventDefault();
    setErr("");

    if (!profileId) {
      setErr("Profile missing. Please complete setup.");
      return;
    }

    if (!title.trim()) {
      setErr("Task title is required.");
      return;
    }

    setLoading(true);
    try {
      await api.post(`/tasks/${profileId}`, {
        title: title.trim(),
        task_type: taskType,
        duration_min: Number(duration),
        priority: Number(priority),
      });

      setTitle("");
      setTaskType("light");
      setDuration(30);
      setPriority(1);

      if (onAdded) await onAdded();
    } catch (e2) {
      console.log(e2);
      setErr("Failed to add task.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={addTask} className="grid gap-3">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Eg: Coding"
        className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-3 py-2 text-white outline-none"
      />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-slate-300">Task Type</label>
          <select
            value={taskType}
            onChange={(e) => setTaskType(e.target.value)}
            className="mt-1 w-full rounded-2xl bg-slate-950 border border-slate-800 px-3 py-2 text-white outline-none"
          >
            <option value="light">Light</option>
            <option value="medium">Medium</option>
            <option value="deep">Deep</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-slate-300">Duration (mins)</label>
          <input
            type="number"
            min="5"
            max="300"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="mt-1 w-full rounded-2xl bg-slate-950 border border-slate-800 px-3 py-2 text-white outline-none"
          />
        </div>
      </div>

      {/* ✅ Priority 1 = High */}
      <div>
        <label className="text-sm text-slate-300">Priority (1–5)</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="mt-1 w-full rounded-2xl bg-slate-950 border border-slate-800 px-3 py-2 text-white outline-none"
        >
          <option value={1}>1 (High)</option>
          <option value={2}>2 (Important)</option>
          <option value={3}>3 (Medium)</option>
          <option value={4}>4 (Low)</option>
          <option value={5}>5 (Very Low)</option>
        </select>
      </div>

      {err ? (
        <div className="text-sm text-red-300 bg-red-950/30 border border-red-900 rounded-xl p-3">
          {err}
        </div>
      ) : null}

      <button
        disabled={loading}
        className="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-500 transition px-4 py-2 font-semibold disabled:opacity-60"
      >
        {loading ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
}
  