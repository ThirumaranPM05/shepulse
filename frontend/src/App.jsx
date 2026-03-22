import { useState } from "react";
import Setup from "./pages/Setup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import WorkplaceDashboard from "./pages/WorkplaceDashboard.jsx";

export default function App() {
  const [profileId, setProfileId] = useState(null);
  const [view, setView] = useState("dashboard"); // "dashboard" | "workplace"

  return (
    <div>
      {!profileId ? (
        <Setup
          onCreated={(profile) => {
            console.log("✅ Profile received in App:", profile);
            setProfileId(profile.id);
          }}
        />
      ) : view === "workplace" ? (
        <WorkplaceDashboard
          profileId={profileId}
          onBack={() => setView("dashboard")}
        />
      ) : (
        <Dashboard
          profileId={profileId}
          onResetProfile={() => setProfileId(null)}
          onViewWorkplace={() => setView("workplace")}
        />
      )}
    </div>
  );
}