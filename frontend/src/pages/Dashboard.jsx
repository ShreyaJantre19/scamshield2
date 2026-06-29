import Navbar from "../components/Navbar";
import DashboardCard from "../components/Dashboard/DashboardCard";
import ActivityCard from "../components/Dashboard/ActivityCard";
import QuickAction from "../components/Dashboard/QuickAction";
import ScanItem from "../components/Dashboard/ScanItem";
import ThreatMonitor from "../components/Dashboard/ThreatMonitor";
import SecurityGauge from "../components/Dashboard/SecurityGauge";

import {
  FaExclamationTriangle,
  FaGlobe,
  FaQrcode,
  FaFileAlt,
  FaEnvelope,
  FaRobot,
} from "react-icons/fa";

function Dashboard() {
  return (
    <>
      <Navbar />

      <div
        style={{
          minHeight: "100vh",
          background: "#020617",
          padding: "50px 8%",
          color: "white",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "auto",
          }}
        >
          {/* Header */}

          <div style={{ marginBottom: "40px" }}>
            <h1
              style={{
                fontSize: "46px",
                fontWeight: "800",
                marginBottom: "10px",
              }}
            >
              Security Dashboard
            </h1>

            <p
              style={{
                color: "#94a3b8",
                fontSize: "18px",
              }}
            >
              Monitor your scans and AI protection in one place.
            </p>
          </div>

          {/* Top Cards */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
              gap: "25px",
              marginBottom: "30px",
            }}
          >
            <SecurityGauge />

            <DashboardCard
              icon={<FaExclamationTriangle size={34} color="#22c55e" />}
              title="Threat Level"
              value="LOW"
              color="#22c55e"
              borderColor="rgba(34,197,94,.2)"
            />

            <DashboardCard
              icon={<FaRobot size={34} color="#8b5cf6" />}
              title="AI Protection"
              value="ACTIVE"
              color="#8b5cf6"
              borderColor="rgba(139,92,246,.2)"
            />
          </div>

          {/* Bottom Section */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: "30px",
            }}
          >
            {/* Left Side */}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "25px",
              }}
            >
              {/* Activity */}

              <div
                style={{
                  background: "#0f172a",
                  borderRadius: "20px",
                  padding: "30px",
                }}
              >
                <h2 style={{ marginBottom: "25px" }}>
                  Today's Activity
                </h2>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2,1fr)",
                    gap: "20px",
                  }}
                >
                  <ActivityCard
                    icon={<FaGlobe color="#3b82f6" />}
                    title="URL Scans"
                    value="18"
                  />

                  <ActivityCard
                    icon={<FaQrcode color="#06b6d4" />}
                    title="QR Scans"
                    value="7"
                  />

                  <ActivityCard
                    icon={<FaFileAlt color="#8b5cf6" />}
                    title="Files"
                    value="11"
                  />

                  <ActivityCard
                    icon={<FaEnvelope color="#f59e0b" />}
                    title="Emails"
                    value="5"
                  />
                </div>
              </div>

              {/* Recent Scans */}

              <div
                style={{
                  background: "#0f172a",
                  borderRadius: "20px",
                  padding: "30px",
                }}
              >
                <h2 style={{ marginBottom: "25px" }}>
                  Recent Scans
                </h2>

                <ScanItem title="Google.com" status="Safe" />
                <ScanItem title="Invoice.pdf" status="Safe" />
                <ScanItem title="QR Payment" status="Verified" />
                <ScanItem title="Email Analysis" status="Safe" />
              </div>
            </div>

            {/* Right Side */}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "25px",
              }}
            >
              {/* Quick Actions */}

              <div
                style={{
                  background: "#0f172a",
                  borderRadius: "20px",
                  padding: "30px",
                }}
              >
                <h2 style={{ marginBottom: "25px" }}>
                  Quick Actions
                </h2>

                <QuickAction
                  title="Scan URL"
                  icon={<FaGlobe />}
                />

                <QuickAction
                  title="Scan QR Code"
                  icon={<FaQrcode />}
                />

                <QuickAction
                  title="Scan File"
                  icon={<FaFileAlt />}
                />

                <QuickAction
                  title="Analyze Email"
                  icon={<FaEnvelope />}
                />
              </div>

              {/* AI Threat Monitor */}

              <div
                style={{
                  background:
                    "linear-gradient(135deg,#2563eb,#1e3a8a)",
                  borderRadius: "20px",
                  padding: "30px",
                }}
              >
                <ThreatMonitor />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;