import { Link } from "react-router-dom";
import ShieldLogo from "./ShieldLogo";
import {
    FaGithub,
    FaLinkedin,
    FaTwitter,
    FaArrowUp,
} from "react-icons/fa";

export default function Footer() {
    return (
        <footer
            style={{
                background: "#020617",
                color: "white",
                padding: "80px 8% 30px",
                position: "relative",
                overflow: "hidden",
                borderTop: "1px solid rgba(255,255,255,.08)",
            }}
        >
            {/* Background Glow */}

            <div
                style={{
                    position: "absolute",
                    width: "400px",
                    height: "400px",
                    background: "#2563eb",
                    filter: "blur(180px)",
                    opacity: ".15",
                    borderRadius: "50%",
                    right: "-180px",
                    top: "-180px",
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
                {/* Main Footer */}

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "2fr 1fr 1fr 1fr",
                        gap: "50px",
                        marginBottom: "60px",
                    }}
                >
                    {/* Brand */}

                    <div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "14px",
                                marginBottom: "18px",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginTop: "-6px",
                                    marginRight: "6px",
                                }}
                            >
                                <ShieldLogo size={90} />
                            </div>
                        </div>

                        <div>
                            <h2
                                style={{
                                    margin: 0,
                                    fontSize: "34px",
                                    fontWeight: "800",
                                    lineHeight: 1,
                                }}
                            >
                                <span style={{ color: "white" }}>Scam</span>
                                <span style={{ color: "#3B82F6" }}>Shield</span>
                            </h2>

                            <span
                                style={{
                                    color: "#60A5FA",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    letterSpacing: "3px",
                                }}
                            >
                                AI CYBERSECURITY
                            </span>
                        </div>
                    </div>

                    <p
                        style={{
                            color: "#94a3b8",
                            lineHeight: "1.8",
                            maxWidth: "420px",
                        }}
                    >
                        ScamShield protects users against phishing websites,
                        malicious files, fake QR codes and email scams using
                        AI-powered cybersecurity technology.
                    </p>

                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "10px",
                            background: "rgba(34,197,94,.15)",
                            color: "#4ade80",
                            padding: "10px 18px",
                            borderRadius: "999px",
                            marginTop: "25px",
                            fontWeight: "600",
                        }}
                    >
                        🟢 AI Protection Active
                    </div>
                </div>

                {/* Security Tools */}

                <div>
                    <h3 style={{ marginBottom: "20px" }}>Security Tools</h3>

                    <Link
                        to="/url-checker"
                        style={{
                            display: "block",
                            color: "#94a3b8",
                            marginBottom: "14px",
                            textDecoration: "none",
                        }}
                    >
                        URL Scanner
                    </Link>

                    <Link
                        to="/file-scanner"
                        style={{
                            display: "block",
                            color: "#94a3b8",
                            marginBottom: "14px",
                            textDecoration: "none",
                        }}
                    >
                        File Scanner
                    </Link>

                    <Link
                        to="/qr-scanner"
                        style={{
                            display: "block",
                            color: "#94a3b8",
                            marginBottom: "14px",
                            textDecoration: "none",
                        }}
                    >
                        QR Scanner
                    </Link>

                    <Link
                        to="/email-analyzer"
                        style={{
                            display: "block",
                            color: "#94a3b8",
                            textDecoration: "none",
                        }}
                    >
                        Email Analyzer
                    </Link>
                </div>

                {/* Team */}

                <div>
                    <h3
                        style={{
                            marginBottom: "20px",
                        }}
                    >
                        Team
                    </h3>

                    <p
                        style={{
                            color: "#60a5fa",
                            fontWeight: "700",
                            fontSize: "18px",
                            marginBottom: "20px",
                        }}
                    >
                        🔥 CodeBlaze
                    </p>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                            color: "#94a3b8",
                            lineHeight: "1.7",
                        }}
                    >
                        <span>👩‍💻 <strong>Asmita Male</strong> — Team Leader</span>

                        <span>👩‍💻 <strong>Shreya Jantre</strong></span>

                        <span>👨‍💻 <strong>Parth Ingle</strong></span>

                        <span>👨‍💻 <strong>Pushkar Bhogaonkar</strong></span>
                    </div>

                    <div
                        style={{
                            marginTop: "22px",
                            display: "inline-block",
                            padding: "8px 16px",
                            borderRadius: "999px",
                            background: "rgba(37,99,235,.12)",
                            color: "#60a5fa",
                            fontSize: "14px",
                            fontWeight: "600",
                        }}
                    >
                        Hackathon Team 2026
                    </div>
                </div>

                {/* Connect */}

                <div>
                    <h3 style={{ marginBottom: "20px" }}>Connect</h3>

                    <div
                        style={{
                            display: "flex",
                            gap: "15px",
                            marginBottom: "30px",
                        }}
                    >
                        {[FaGithub, FaLinkedin, FaTwitter].map((Icon, i) => (
                            <div
                                key={i}
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    borderRadius: "14px",
                                    background: "rgba(255,255,255,.06)",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    cursor: "pointer",
                                    transition: ".3s",
                                }}
                            >
                                <Icon />
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() =>
                            window.scrollTo({
                                top: 0,
                                behavior: "smooth",
                            })
                        }
                        style={{
                            background:
                                "linear-gradient(135deg,#2563eb,#3b82f6)",
                            color: "white",
                            border: "none",
                            padding: "12px 20px",
                            borderRadius: "999px",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            cursor: "pointer",
                            fontWeight: "700",
                        }}
                    >
                        Back to Top
                        <FaArrowUp />
                    </button>
                </div>
            </div>

            {/* Bottom */}

            <div
                style={{
                    borderTop: "1px solid rgba(255,255,255,.08)",
                    paddingTop: "25px",
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    color: "#64748b",
                    fontSize: "15px",
                }}
            >
                <span>© 2026 ScamShield. All rights reserved.</span>

                <span>
                    Built with ❤️ by <strong>Team CodeBlaze</strong> | Hackathon
                    Project
                </span>
            </div>

        </footer>
    );
}