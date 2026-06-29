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
                padding: "60px 8% 25px",
                borderTop: "1px solid rgba(255,255,255,.08)",
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
                    right: "-180px",
                    top: "-180px",
                    borderRadius: "50%",
                    background: "#2563eb",
                    filter: "blur(180px)",
                    opacity: ".15",
                }}
            />

            <div
                style={{
                    maxWidth: "1400px",
                    margin: "auto",
                    position: "relative",
                    zIndex: 2,
                }}
            >
                {/* Main Grid */}

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "2fr 1fr 1fr 1fr",
                        gap: "60px",
                        marginBottom: "50px",
                        alignItems: "start",
                    }}
                >
                    {/* Column 1 */}

                    <div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "18px",
                                marginBottom: "25px",
                            }}
                        >
                            <ShieldLogo size={75} />

                            <div>
                                <h2
                                    style={{
                                        margin: 0,
                                        fontSize: "38px",
                                        fontWeight: "800",
                                        lineHeight: 1,
                                    }}
                                >
                                    <span style={{ color: "white" }}>Scam</span>
                                    <span style={{ color: "#3B82F6" }}>Shield</span>
                                </h2>

                                <div
                                    style={{
                                        color: "#60A5FA",
                                        fontSize: "13px",
                                        letterSpacing: "3px",
                                        marginTop: "8px",
                                        fontWeight: "600",
                                    }}
                                >
                                    AI CYBERSECURITY
                                </div>
                            </div>
                        </div>

                        <p
                            style={{
                                color: "#94a3b8",
                                lineHeight: "1.9",
                                fontSize: "16px",
                                marginBottom: "28px",
                            }}
                        >
                            ScamShield protects users against phishing websites,
                            malicious files, fake QR codes, fraudulent emails,
                            and emerging cyber threats using intelligent,
                            AI-powered cybersecurity technology.
                        </p>

                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "10px",
                                background: "rgba(34,197,94,.15)",
                                color: "#4ade80",
                                padding: "12px 20px",
                                borderRadius: "999px",
                                fontWeight: "700",
                                fontSize: "15px",
                            }}
                        >
                            🟢 AI Protection Active
                        </div>
                    </div>

                    {/* Column 2 */}
                    <div>
                        <h3
                            style={{
                                marginBottom: "22px",
                                fontSize: "22px",
                                fontWeight: "700",
                            }}
                        >
                            Security Tools
                        </h3>

                        {[
                            { name: "URL Scanner", path: "/url-checker" },
                            { name: "QR Scanner", path: "/qr-scanner" },
                            { name: "File Scanner", path: "/file-scanner" },
                            { name: "Email Analyzer", path: "/email-analyzer" },
                        ].map((tool) => (
                            <Link
                                key={tool.name}
                                to={tool.path}
                                style={{
                                    display: "block",
                                    color: "#94a3b8",
                                    textDecoration: "none",
                                    marginBottom: "18px",
                                    transition: ".3s",
                                    fontSize: "16px",
                                }}
                            >
                                {tool.name}
                            </Link>
                        ))}
                    </div>

                    {/* Column 3 */}

                    <div>
                        <h3
                            style={{
                                marginBottom: "22px",
                                fontSize: "22px",
                                fontWeight: "700",
                            }}
                        >
                            Team
                        </h3>

                        <div
                            style={{
                                display: "inline-block",
                                background: "rgba(37,99,235,.15)",
                                color: "#60A5FA",
                                padding: "8px 18px",
                                borderRadius: "999px",
                                marginBottom: "24px",
                                fontWeight: "700",
                            }}
                        >
                            🔥 CodeBlaze
                        </div>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "15px",
                                color: "#cbd5e1",
                                lineHeight: "1.7",
                            }}
                        >
                            <span>
                                👩‍💻 <strong>Asmita Male</strong>
                                <br />
                                <span
                                    style={{
                                        color: "#64748b",
                                        fontSize: "14px",
                                    }}
                                >
                                    Team Leader
                                </span>
                            </span>

                            <span>👩‍💻 <strong>Shreya Jantre</strong></span>

                            <span>👨‍💻 <strong>Parth Ingle</strong></span>

                            <span>👨‍💻 <strong>Pushkar Bhogaonkar</strong></span>
                        </div>

                        <div
                            style={{
                                marginTop: "25px",
                                color: "#60A5FA",
                                fontWeight: "600",
                                fontSize: "14px",
                            }}
                        >
                            Hackathon 2026
                        </div>
                    </div>

                    {/* Column 4 */}

                    <div>
                        <h3
                            style={{
                                marginBottom: "22px",
                                fontSize: "22px",
                                fontWeight: "700",
                            }}
                        >
                            Connect
                        </h3>

                        <div
                            style={{
                                display: "flex",
                                gap: "16px",
                                marginBottom: "30px",
                            }}
                        >
                            {[FaGithub, FaLinkedin, FaTwitter].map((Icon, index) => (
                                <div
                                    key={index}
                                    style={{
                                        width: "50px",
                                        height: "50px",
                                        borderRadius: "15px",
                                        background: "rgba(255,255,255,.06)",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        cursor: "pointer",
                                        transition: ".3s",
                                    }}
                                >
                                    <Icon size={20} />
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
                                padding: "14px 24px",
                                borderRadius: "999px",
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                cursor: "pointer",
                                fontWeight: "700",
                                fontSize: "15px",
                            }}
                        >
                            Back to Top
                            <FaArrowUp />
                        </button>
                    </div>
                </div>

                {/* Bottom Bar */}

                <div
                    style={{
                        borderTop: "1px solid rgba(255,255,255,.08)",
                        paddingTop: "25px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "15px",
                        color: "#64748b",
                        fontSize: "15px",
                    }}
                >
                    <span>
                        © 2026 <strong style={{ color: "#ffffff" }}>ScamShield</strong>. All
                        rights reserved.
                    </span>

                    <div
                        style={{
                            display: "flex",
                            gap: "25px",
                            alignItems: "center",
                            flexWrap: "wrap",
                        }}
                    >
                        <span>Built with ❤️ by <strong>Team CodeBlaze</strong></span>

                        <span
                            style={{
                                color: "#3B82F6",
                                fontWeight: "600",
                            }}
                        >
                            Hackathon Project 2026
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}