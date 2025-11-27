import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function getGreeting(date) {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function WelcomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000); // update every minute
    return () => clearInterval(id);
  }, []);

  const greeting = getGreeting(now);
  const formattedDate = now.toLocaleDateString();
  const formattedTime = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

  const initial = user?.name?.charAt(0)?.toUpperCase() || "?";
  const roleMessage =
    user?.role === "ADMIN"
      ? "You have full access to manage users and roles in the system."
      : "You can manage your account and stay updated with your access.";

  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <div className="welcome-header">
          <div className="avatar">
            <span>{initial}</span>
          </div>
          <div className="welcome-texts">
            <p className="welcome-greeting">
              {greeting}, <span>{user?.name}</span>
            </p>
            <p className="welcome-role-line">
              You are logged in as{" "}
              <span className="role-badge">{user?.role}</span>
            </p>
          </div>
        </div>

        <p className="welcome-message">{roleMessage}</p>

        <div className="welcome-datetime">
          <p>
            📅 <strong>{formattedDate}</strong>
          </p>
          <p>
            ⏰ <strong>{formattedTime}</strong>
          </p>
        </div>

        <div className="welcome-actions">
          <button
            className="btn secondary"
            onClick={() => navigate("/change-password")}
          >
            Change Password
          </button>
          <button className="btn danger" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
