import { Link } from "react-router-dom";
import {
    FaGlobe,
    FaQrcode,
    FaFileAlt,
    FaEnvelope,
    FaArrowRight,
} from "react-icons/fa";

const tools = [
    {
        title: "URL Checker",
        description:
            "Analyze suspicious links and detect phishing websites instantly.",
        icon: <FaGlobe size={34} color="#2563eb" />,
        path: "/url-checker",
    },
    {
        title: "QR Scanner",
        description:
            "Scan QR codes safely before opening unknown destinations.",
        icon: <FaQrcode size={34} color="#2563eb" />,
        path: "/qr-scanner",
    },
    {
        title: "File Scanner",
        description:
            "Upload files and detect malware using AI-powered analysis.",
        icon: <FaFileAlt size={34} color="#2563eb" />,
        path: "/file-scanner",
    },
    {
        title: "Email Analyzer",
        description:
            "Identify phishing emails and suspicious attachments quickly.",
        icon: <FaEnvelope size={34} color="#2563eb" />,
        path: "/email-analyzer",
    },
];

export default function Tools() {
    return (
        <section
            style={{
                padding: "100px 8%",
                background: "#f8fafc",
            }}
        >
            <div
                style={{
                    maxWidth: "1280px",
                    margin: "auto",
                    textAlign: "center",
                }}
            >
                <h2
                    style={{
                        fontSize: "52px",
                        fontWeight: "800",
                        color: "#0f172a",
                        marginBottom: "12px",
                    }}
                >
                    Powerful Security Tools
                </h2>

                <p
                    style={{
                        color: "#64748b",
                        fontSize: "20px",
                        marginBottom: "70px",
                    }}
                >
                    Everything you need to stay protected from online scams.
                </p>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
                        gap: "30px",
                    }}
                >
                    {tools.map((tool, index) => (
                        <Link
                            key={index}
                            to={tool.path}
                            style={{
                                textDecoration: "none",
                                color: "#111827",
                            }}
                        >
                            <div
                                style={{
                                    background: "white",
                                    borderRadius: "22px",
                                    padding: "35px",
                                    minHeight: "300px",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    boxShadow: "0 12px 30px rgba(0,0,0,.08)",
                                    transition: ".3s",
                                }}
                            >
                                <div>
                                    <div
                                        style={{
                                            width: "70px",
                                            height: "70px",
                                            borderRadius: "50%",
                                            background: "#eff6ff",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginBottom: "25px",
                                        }}
                                    >
                                        {tool.icon}
                                    </div>

                                    <h3
                                        style={{
                                            fontSize: "32px",
                                            marginBottom: "18px",
                                        }}
                                    >
                                        {tool.title}
                                    </h3>

                                    <p
                                        style={{
                                            color: "#475569",
                                            lineHeight: "1.8",
                                            fontSize: "18px",
                                        }}
                                    >
                                        {tool.description}
                                    </p>
                                </div>

                                <div
                                    style={{
                                        marginTop: "30px",
                                        color: "#2563eb",
                                        fontWeight: "700",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        fontSize: "18px",
                                    }}
                                >
                                    Open Tool
                                    <FaArrowRight />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
} 