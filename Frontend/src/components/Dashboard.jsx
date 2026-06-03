import React from "react";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="dashboard">
      <div className="topbar">
        <h2>Dashboard</h2>
        <div className="settings-wrap">
          <Settings
            className="icon"
            size={28}
            onClick={() => navigate("/change-password")}
            style={{ cursor: "pointer" }}
            title="Change Password"
          />
        </div>
      </div>

      <div className="center-content">
        <p>
          You are logged in as <strong>{user?.email}</strong>
        </p>

        <button
          onClick={() => navigate("/change-password")}
          style={{
            marginTop: "24px",
            padding: "10px 24px",
            background: "#0d2318",
            color: "#4ade80",
            border: "1px solid #1a3d28",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
