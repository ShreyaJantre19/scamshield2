import { Link } from "react-router-dom";
import {
    FaGlobe,
    FaQrcode,
    FaFileAlt,
    FaEnvelope,
    FaArrowRight,
    FaCheckCircle,
} from "react-icons/fa";

const tools = [
    {
        title: "URL Scanner",
        badge: "🟢 LIVE",
        scans: "25K+ URLs Checked",
        features: [
            "Real-time Detection",
            "Phishing Detection",
            "Domain Reputation",
        ],
        description:
            "Detect phishing websites, shortened URLs and malicious domains before opening them.",
        icon: <FaGlobe size={36} color="white" />,
        path: "/url-checker",
        gradient: "linear-gradient(135deg,#3b82f6,#2563eb)",
    },
    {
        title: "QR Scanner",
        badge: "⚡ FAST",
        scans: "18K+ QR Codes",
        features: [
            "Safe Preview",
            "Redirect Analysis",
            "Threat Detection",
        ],
        description:
            "Scan QR codes safely and reveal hidden destinations before visiting them.",
        icon: <FaQrcode size={36} color="white" />,
        path: "/qr-scanner",
        gradient: "linear-gradient(135deg,#14b8a6,#0d9488)",
    },
    {
        title: "File Scanner",
        badge: "🔒 SECURE",
        scans: "12K+ Files Scanned",
        features: [
            "Malware Detection",
            "Virus Analysis",
            "AI File Inspection",
        ],
        description:
            "Upload files and let ScamShield AI inspect them for malware and suspicious behaviour.",
        icon: <FaFileAlt size={36} color="white" />,
        path: "/file-scanner",
        gradient: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
    },
    {
        title: "Email Analyzer",
        badge: "🤖 AI",
        scans: "8K+ Emails Analyzed",
        features: [
            "Spam Detection",
            "Attachment Analysis",
            "Phishing Detection",
        ],
        description:
            "Identify phishing emails, fake senders and dangerous attachments in seconds.",
        icon: <FaEnvelope size={36} color="white" />,
        path: "/email-analyzer",
        gradient: "linear-gradient(135deg,#ec4899,#db2777)",
    },
];

export default function Tools() {
    return (
        <section
            style={{
                position: "relative",
                overflow: "hidden",
                padding: "120px 8%",
                background:
                    "linear-gradient(180deg,#020617 0%,#0f172a 50%,#111827 100%)",
            }}
        >
            {/* Background Glow */}
            <div
                style={{
                    position: "absolute",
                    width: "500px",
                    height: "500px",
                    background: "#2563eb",
                    filter: "blur(170px)",
                    opacity: ".18",
                    borderRadius: "50%",
                    top: "-180px",
                    left: "-150px",
                }}
            />

            <div
                style={{
                    position: "absolute",
                    width: "450px",
                    height: "450px",
                    background: "#7c3aed",
                    filter: "blur(170px)",
                    opacity: ".15",
                    borderRadius: "50%",
                    bottom: "-200px",
                    right: "-100px",
                }}
            />

            <div
                style={{
                    position: "relative",
                    maxWidth: "1300px",
                    margin: "auto",
                    zIndex: 2,
                }}
            >
                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "80px",
                    }}
                >
                    <div
                        style={{
                            display: "inline-block",
                            padding: "10px 22px",
                            borderRadius: "999px",
                            background: "rgba(59,130,246,.15)",
                            color: "#60a5fa",
                            fontWeight: "700",
                            marginBottom: "25px",
                        }}
                    >
                        SECURITY SUITE
                    </div>

                    <h2
                        style={{
                            color: "white",
                            fontSize: "56px",
                            fontWeight: "800",
                            marginBottom: "18px",
                        }}
                    >
                        AI-Powered Security Tools
                    </h2>

                    <p
                        style={{
                            color: "#94a3b8",
                            fontSize: "20px",
                            maxWidth: "760px",
                            margin: "auto",
                            lineHeight: "1.8",
                        }}
                    >
                        Protect yourself against phishing websites, malware, fake QR codes,
                        suspicious emails and online scams using ScamShield's intelligent
                        detection engine.
                    </p>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
                        gap: "35px",
                    }}
                >
                    {tools.map((tool, index) => (
                        <Link
                            key={index}
                            to={tool.path}
                            style={{
                                textDecoration: "none",
                            }}
                        >
                            <div
                                style={{
                                    height: "100%",
                                    background: "rgba(255,255,255,.06)",
                                    backdropFilter: "blur(18px)",
                                    border: "1px solid rgba(255,255,255,.08)",
                                    borderRadius: "28px",
                                    padding: "34px",
                                    transition: ".35s",
                                    boxShadow: "0 20px 60px rgba(0,0,0,.35)",
                                    cursor: "pointer",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform =
                                        "translateY(-12px) scale(1.03)";
                                    e.currentTarget.style.boxShadow =
                                        "0 35px 90px rgba(37,99,235,.40)";
                                    e.currentTarget.style.borderColor =
                                        "#3b82f6";
                                }}

                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow =
                                        "0 20px 60px rgba(0,0,0,.35)";
                                    e.currentTarget.style.borderColor =
                                        "rgba(255,255,255,.08)";
                                }}
                            >
                                <div
                                    style={{
                                        display: "inline-block",
                                        background: "rgba(255,255,255,.08)",
                                        color: "#60a5fa",
                                        padding: "8px 18px",
                                        borderRadius: "999px",
                                        fontWeight: "700",
                                        fontSize: "14px",
                                        marginBottom: "22px",
                                    }}
                                >
                                    {tool.badge}
                                </div>

                                <div
                                    style={{
                                        width: "78px",
                                        height: "78px",
                                        transition: ".35s",
                                        borderRadius: "22px",
                                        background: tool.gradient,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginBottom: "28px",
                                        boxShadow: "0 15px 35px rgba(0,0,0,.35)",
                                    }}
                                >
                                    {tool.icon}
                                </div>

                                <h3
                                    style={{
                                        color: "white",
                                        fontSize: "30px",
                                        fontWeight: "700",
                                        marginBottom: "16px",
                                    }}
                                >
                                    {tool.title}
                                </h3>

                                <p
                                    style={{
                                        color: "#cbd5e1",
                                        lineHeight: "1.8",
                                        marginBottom: "28px",
                                    }}
                                >
                                    {tool.description}
                                </p>

                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "12px",
                                    }}
                                >
                                    {tool.features.map((feature, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "10px",
                                                color: "#e2e8f0",
                                            }}
                                        >
                                            <FaCheckCircle color="#22c55e" />
                                            {feature}
                                        </div>
                                    ))}
                                </div>

                                <div
                                    style={{
                                        marginTop: "32px",
                                        paddingTop: "24px",
                                        borderTop: "1px solid rgba(255,255,255,.08)",
                                    }}
                                >
                                    <div
                                        style={{
                                            color: "#60a5fa",
                                            fontWeight: "700",
                                            fontSize: "15px",
                                            marginBottom: "18px",
                                        }}
                                    >
                                        {tool.scans}
                                    </div>

                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <span
                                            style={{
                                                color: "white",
                                                fontWeight: "700",
                                                fontSize: "18px",
                                            }}
                                        >
                                            Launch Scanner
                                        </span>

                                        <div
                                            style={{
                                                width: "46px",
                                                height: "46px",
                                                borderRadius: "50%",
                                                background: tool.gradient,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "white",
                                                transition: ".3s",
                                            }}
                                        >
                                            <FaArrowRight />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Bottom Stats */}

                <div
                    style={{
                        marginTop: "90px",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                        gap: "25px",
                    }}
                >
                    {[
                        {
                            value: "25K+",
                            label: "Threats Blocked",
                        },
                        {
                            value: "98.7%",
                            label: "Detection Accuracy",
                        },
                        {
                            value: "<2 Sec",
                            label: "Average Scan Time",
                        },
                        {
                            value: "24/7",
                            label: "AI Protection",
                        },
                    ].map((item, i) => (
                        <div
                            key={i}
                            style={{
                                background: "rgba(255,255,255,.05)",
                                backdropFilter: "blur(18px)",
                                border: "1px solid rgba(255,255,255,.08)",
                                borderRadius: "22px",
                                padding: "32px",
                                textAlign: "center",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "42px",
                                    fontWeight: "800",
                                    color: "#60a5fa",
                                    marginBottom: "10px",
                                }}
                            >
                                {item.value}
                            </div>

                            <div
                                style={{
                                    color: "#cbd5e1",
                                    fontSize: "18px",
                                }}
                            >
                                {item.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}