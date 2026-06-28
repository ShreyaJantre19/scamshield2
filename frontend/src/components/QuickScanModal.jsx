import { Link } from "react-router-dom";
import {
    FaTimes,
    FaGlobe,
    FaQrcode,
    FaFileAlt,
    FaEnvelope,
} from "react-icons/fa";

function QuickScanModal({ open, onClose }) {
    if (!open) return null;

    const scans = [
        {
            title: "URL Scanner",
            icon: <FaGlobe />,
            path: "/url-checker",
            color: "#2563eb",
        },
        {
            title: "QR Scanner",
            icon: <FaQrcode />,
            path: "/qr-scanner",
            color: "#14b8a6",
        },
        {
            title: "File Scanner",
            icon: <FaFileAlt />,
            path: "/file-scanner",
            color: "#7c3aed",
        },
        {
            title: "Email Analyzer",
            icon: <FaEnvelope />,
            path: "/email-analyzer",
            color: "#ec4899",
        },
    ];

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.65)",
                backdropFilter: "blur(6px)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: "90%",
                    maxWidth: "650px",
                    background: "#0f172a",
                    borderRadius: "24px",
                    padding: "35px",
                    border: "1px solid rgba(255,255,255,.08)",
                    boxShadow: "0 30px 80px rgba(0,0,0,.45)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "30px",
                    }}
                >
                    <div>
                        <h2
                            style={{
                                color: "white",
                                margin: 0,
                            }}
                        >
                            🚀 Quick Scan
                        </h2>

                        <p
                            style={{
                                color: "#94a3b8",
                                marginTop: "8px",
                            }}
                        >
                            Choose what you'd like to scan.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "white",
                            fontSize: "22px",
                            cursor: "pointer",
                        }}
                    >
                        <FaTimes />
                    </button>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2,1fr)",
                        gap: "20px",
                    }}
                >
                    {scans.map((scan) => (
                        <Link
                            key={scan.title}
                            to={scan.path}
                            onClick={onClose}
                            style={{
                                textDecoration: "none",
                            }}
                        >
                            <div
                                style={{
                                    background: "#1e293b",
                                    borderRadius: "18px",
                                    padding: "25px",
                                    textAlign: "center",
                                    cursor: "pointer",
                                    transition: ".3s",
                                }}
                            >
                                <div
                                    style={{
                                        width: "65px",
                                        height: "65px",
                                        borderRadius: "18px",
                                        margin: "auto",
                                        marginBottom: "18px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        background: scan.color,
                                        color: "white",
                                        fontSize: "28px",
                                    }}
                                >
                                    {scan.icon}
                                </div>

                                <h3
                                    style={{
                                        color: "white",
                                        marginBottom: "8px",
                                    }}
                                >
                                    {scan.title}
                                </h3>

                                <p
                                    style={{
                                        color: "#94a3b8",
                                        fontSize: "14px",
                                    }}
                                >
                                    Open Scanner
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default QuickScanModal;