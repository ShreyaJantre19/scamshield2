import {
    FaShieldAlt,
    FaBug,
    FaCheckCircle,
    FaChartLine,
} from "react-icons/fa";

const stats = [
    {
        number: "25K+",
        label: "Threats Blocked",
        desc: "Malicious links and phishing attacks stopped.",
        icon: <FaBug size={28} color="white" />,
        gradient: "linear-gradient(135deg,#ef4444,#dc2626)",
    },
    {
        number: "98.7%",
        label: "Detection Accuracy",
        desc: "AI-powered scam detection engine.",
        icon: <FaShieldAlt size={28} color="white" />,
        gradient: "linear-gradient(135deg,#2563eb,#3b82f6)",
    },
    {
        number: "50K+",
        label: "Scans Completed",
        desc: "URLs, files, QR codes and emails analyzed.",
        icon: <FaChartLine size={28} color="white" />,
        gradient: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
    },
    {
        number: "24/7",
        label: "AI Protection",
        desc: "Continuous real-time security monitoring.",
        icon: <FaCheckCircle size={28} color="white" />,
        gradient: "linear-gradient(135deg,#10b981,#059669)",
    },
];

export default function Statistics() {
    return (
        <section
            style={{
                background:
                    "linear-gradient(180deg,#111827 0%,#0f172a 60%,#020617 100%)",
                padding: "90px 8%",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Background Glow */}

            <div
                style={{
                    position: "absolute",
                    width: "420px",
                    height: "420px",
                    background: "#2563eb",
                    filter: "blur(160px)",
                    opacity: ".18",
                    borderRadius: "50%",
                    top: "-150px",
                    left: "-150px",
                }}
            />

            <div
                style={{
                    position: "absolute",
                    width: "420px",
                    height: "420px",
                    background: "#7c3aed",
                    filter: "blur(170px)",
                    opacity: ".15",
                    borderRadius: "50%",
                    bottom: "-180px",
                    right: "-150px",
                }}
            />

            <div
                style={{
                    maxWidth: "1300px",
                    margin: "auto",
                    position: "relative",
                    zIndex: 2,
                }}
            >
                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "70px",
                    }}
                >
                    <div
                        style={{
                            display: "inline-block",
                            padding: "10px 22px",
                            background: "rgba(37,99,235,.15)",
                            color: "#60a5fa",
                            borderRadius: "999px",
                            fontWeight: "700",
                            marginBottom: "20px",
                        }}
                    >
                        LIVE THREAT INTELLIGENCE
                    </div>

                    <h2
                        style={{
                            color: "white",
                            fontSize: "54px",
                            fontWeight: "800",
                            marginBottom: "18px",
                        }}
                    >
                        Security In Numbers
                    </h2>

                    <p
                        style={{
                            color: "#94a3b8",
                            fontSize: "20px",
                            maxWidth: "720px",
                            margin: "auto",
                            lineHeight: "1.8",
                        }}
                    >
                        ScamShield continuously analyzes online threats using advanced AI
                        models to keep users protected from phishing, malware and cyber
                        attacks.
                    </p>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
                        gap: "30px",
                    }}
                >
                    {stats.map((item, index) => (
                        <div
                            key={index}
                            style={{
                                background: "rgba(255,255,255,.06)",
                                backdropFilter: "blur(18px)",
                                border: "1px solid rgba(255,255,255,.08)",
                                borderRadius: "28px",
                                padding: "38px",
                                textAlign: "center",
                                transition: ".35s",
                                cursor: "pointer",
                                boxShadow: "0 20px 60px rgba(0,0,0,.35)",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform =
                                    "translateY(-10px) scale(1.03)";
                                e.currentTarget.style.boxShadow =
                                    "0 30px 80px rgba(37,99,235,.35)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow =
                                    "0 20px 60px rgba(0,0,0,.35)";
                            }}
                        >
                            <div
                                style={{
                                    width: "80px",
                                    height: "80px",
                                    borderRadius: "22px",
                                    background: item.gradient,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    margin: "0 auto 25px",
                                }}
                            >
                                {item.icon}
                            </div>

                            <h2
                                style={{
                                    color: "white",
                                    fontSize: "50px",
                                    marginBottom: "10px",
                                    fontWeight: "800",
                                }}
                            >
                                {item.number}
                            </h2>

                            <h3
                                style={{
                                    color: "#f8fafc",
                                    fontSize: "24px",
                                    marginBottom: "12px",
                                }}
                            >
                                {item.label}
                            </h3>

                            <p
                                style={{
                                    color: "#94a3b8",
                                    lineHeight: "1.7",
                                }}
                            >
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}