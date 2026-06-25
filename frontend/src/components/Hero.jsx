import { FaShieldAlt, FaArrowRight, FaPlay } from "react-icons/fa";

export default function Hero() {
    return (
        <section
            style={{
                background:
                    "linear-gradient(135deg,#0f172a 0%,#1e3a8a 45%,#2563eb 100%)",
                color: "white",
                minHeight: "88vh",
                display: "flex",
                alignItems: "center",
                padding: "70px 8%",
            }}
        >
            <div
                style={{
                    maxWidth: "1300px",
                    width: "100%",
                    margin: "auto",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "60px",
                    alignItems: "center",
                }}
            >
                {/* LEFT */}

                <div>
                    <div
                        style={{
                            display: "inline-block",
                            background: "#2563eb",
                            padding: "8px 18px",
                            borderRadius: "999px",
                            fontWeight: 600,
                            marginBottom: "25px",
                            fontSize: "14px",
                        }}
                    >
                        AI POWERED PROTECTION
                    </div>

                    <h1
                        style={{
                            fontSize: "68px",
                            lineHeight: "1.05",
                            fontWeight: 800,
                            marginBottom: "25px",
                        }}
                    >
                        Stay Safe from
                        <br />
                        Scams,
                        <br />
                        Phishing &
                        <br />
                        <span style={{ color: "#7dd3fc" }}>
                            Malicious Threats
                        </span>
                    </h1>

                    <p
                        style={{
                            fontSize: "21px",
                            color: "#dbeafe",
                            maxWidth: "600px",
                            lineHeight: "1.8",
                        }}
                    >
                        ScamShield uses advanced AI technology to detect phishing
                        websites, malicious QR codes, dangerous files and fraudulent
                        emails before they can harm you.
                    </p>

                    <div
                        style={{
                            display: "flex",
                            gap: "18px",
                            marginTop: "45px",
                        }}
                    >
                        <button
                            style={{
                                background: "#3b82f6",
                                color: "white",
                                border: "none",
                                borderRadius: "14px",
                                padding: "16px 30px",
                                fontSize: "18px",
                                fontWeight: "600",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                            }}
                        >
                            <FaShieldAlt />
                            Start Scanning
                        </button>

                        <button
                            style={{
                                background: "transparent",
                                color: "white",
                                border: "2px solid white",
                                borderRadius: "14px",
                                padding: "16px 30px",
                                fontSize: "18px",
                                fontWeight: "600",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                            }}
                        >
                            <FaPlay />
                            Learn More
                        </button>
                    </div>
                </div>

                {/* RIGHT */}

                <div
                    style={{
                        position: "relative",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <div
                        style={{
                            width: "340px",
                            height: "340px",
                            borderRadius: "50%",
                            background:
                                "radial-gradient(circle,#60a5fa 0%,#2563eb 100%)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            boxShadow: "0 0 120px rgba(59,130,246,.5)",
                        }}
                    >
                        <FaShieldAlt color="white" size={150} />
                    </div>

                    {[
                        {
                            title: "URL Protection",
                            status: "Safe ✓",
                            top: "40px",
                            left: "-30px",
                        },
                        {
                            title: "QR Scanner",
                            status: "Secure ✓",
                            top: "80px",
                            right: "-30px",
                        },
                        {
                            title: "File Scanner",
                            status: "No Threats ✓",
                            bottom: "80px",
                            left: "0px",
                        },
                        {
                            title: "Email Analyzer",
                            status: "Protected ✓",
                            bottom: "30px",
                            right: "-10px",
                        },
                    ].map((card, i) => (
                        <div
                            key={i}
                            style={{
                                position: "absolute",
                                ...card,
                                background: "#111827",
                                borderRadius: "16px",
                                padding: "16px 22px",
                                minWidth: "180px",
                                boxShadow: "0 20px 40px rgba(0,0,0,.3)",
                            }}
                        >
                            <div style={{ fontWeight: 700 }}>{card.title}</div>
                            <div style={{ color: "#4ade80", marginTop: "6px" }}>
                                {card.status}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
} 