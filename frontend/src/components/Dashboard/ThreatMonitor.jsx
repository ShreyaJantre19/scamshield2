import { FaRobot, FaShieldAlt } from "react-icons/fa";

function ThreatMonitor() {
    return (
        <div>
            <div
                style={{
                    fontSize: "50px",
                    color: "white",
                    marginBottom: "20px",
                }}
            >
                <FaRobot />
            </div>

            <h2
                style={{
                    color: "white",
                    marginBottom: "15px",
                }}
            >
                AI Threat Monitor
            </h2>

            <p
                style={{
                    color: "#dbeafe",
                    lineHeight: "1.7",
                    marginBottom: "25px",
                }}
            >
                ScamShield AI continuously monitors your activity and instantly
                detects suspicious websites, phishing emails, malicious files,
                and fraudulent QR codes.
            </p>

            <button
                style={{
                    padding: "14px 24px",
                    border: "none",
                    borderRadius: "12px",
                    background: "white",
                    color: "#2563eb",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                }}
            >
                <FaShieldAlt />
                AI Protection Active
            </button>
        </div>
    );
}

export default ThreatMonitor;