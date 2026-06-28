import {
    FaBrain,
    FaBolt,
    FaLock,
    FaClock,
    FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const features = [
    {
        icon: <FaBrain size={34} color="white" />,
        title: "AI Threat Detection",
        text: "Advanced AI instantly detects phishing websites, fake emails, malicious QR codes and suspicious files.",
        gradient: "linear-gradient(135deg,#2563eb,#3b82f6)",
    },
    {
        icon: <FaBolt size={34} color="white" />,
        title: "Lightning Fast",
        text: "Analyze URLs, files and emails within seconds using our optimized scanning engine.",
        gradient: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
    },
    {
        icon: <FaLock size={34} color="white" />,
        title: "Privacy First",
        text: "Your uploaded data is processed securely with privacy-focused architecture.",
        gradient: "linear-gradient(135deg,#10b981,#059669)",
    },
    {
        icon: <FaClock size={34} color="white" />,
        title: "24/7 Protection",
        text: "Continuous monitoring helps protect you from the latest online scams and cyber threats.",
        gradient: "linear-gradient(135deg,#f59e0b,#ea580c)",
    },
];

export default function WhyChoose() {
    return (
        <section
            style={{
                background:
                    "linear-gradient(180deg,#020617,#0f172a,#111827)",
                padding: "100px 8%",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Background Glow */}

            <div
                style={{
                    position: "absolute",
                    width: "450px",
                    height: "450px",
                    background: "#2563eb",
                    borderRadius: "50%",
                    filter: "blur(180px)",
                    opacity: ".18",
                    top: "-200px",
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
                            background: "rgba(37,99,235,.15)",
                            color: "#60a5fa",
                            padding: "10px 24px",
                            borderRadius: "999px",
                            fontWeight: "700",
                            marginBottom: "20px",
                        }}
                    >
                        WHY SCAMSHIELD?
                    </div>

                    <h2
                        style={{
                            fontSize: "54px",
                            color: "white",
                            fontWeight: "800",
                            marginBottom: "20px",
                        }}
                    >
                        Built For Modern Cybersecurity
                    </h2>

                    <p
                        style={{
                            color: "#94a3b8",
                            maxWidth: "760px",
                            margin: "auto",
                            fontSize: "20px",
                            lineHeight: "1.8",
                        }}
                    >
                        ScamShield combines Artificial Intelligence with real-time threat
                        intelligence to help individuals detect scams before they become
                        victims.
                    </p>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
                        gap: "30px",
                        marginBottom: "80px",
                    }}
                >
                    {features.map((item, index) => (
                        <div
                            key={index}
                            style={{
                                background: "rgba(255,255,255,.06)",
                                backdropFilter: "blur(18px)",
                                border: "1px solid rgba(255,255,255,.08)",
                                borderRadius: "28px",
                                padding: "35px",
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
                                    width: "82px",
                                    height: "82px",
                                    borderRadius: "22px",
                                    background: item.gradient,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginBottom: "25px",
                                }}
                            >
                                {item.icon}
                            </div>

                            <h3
                                style={{
                                    color: "white",
                                    fontSize: "28px",
                                    marginBottom: "18px",
                                }}
                            >
                                {item.title}
                            </h3>

                            <p
                                style={{
                                    color: "#cbd5e1",
                                    lineHeight: "1.8",
                                    fontSize: "17px",
                                }}
                            >
                                {item.text}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}

                <div
                    style={{
                        background:
                            "linear-gradient(135deg,rgba(37,99,235,.25),rgba(124,58,237,.25))",
                        border: "1px solid rgba(255,255,255,.08)",
                        borderRadius: "30px",
                        padding: "55px",
                        textAlign: "center",
                        backdropFilter: "blur(18px)",
                    }}
                >
                    <h2
                        style={{
                            color: "white",
                            fontSize: "42px",
                            marginBottom: "18px",
                        }}
                    >
                        Ready to Stay Protected?
                    </h2>

                    <p
                        style={{
                            color: "#cbd5e1",
                            fontSize: "18px",
                            maxWidth: "650px",
                            margin: "0 auto 35px",
                            lineHeight: "1.8",
                        }}
                    >
                        Start scanning suspicious links, emails, QR codes and files with
                        ScamShield's AI-powered protection platform.
                    </p>

                    <Link
                        to="/"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "18px 38px",
                            background: "linear-gradient(135deg,#2563eb,#3b82f6)",
                            borderRadius: "999px",
                            color: "white",
                            textDecoration: "none",
                            fontWeight: "700",
                            fontSize: "18px",
                            boxShadow: "0 20px 45px rgba(37,99,235,.35)",
                        }}
                    >
                        Explore Security Tools
                        <FaArrowRight />
                    </Link>
                </div>
            </div>
        </section>
    );
}