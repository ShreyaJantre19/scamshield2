import {
    FaBrain,
    FaBolt,
    FaLock,
    FaClock,
} from "react-icons/fa";

const features = [
    {
        icon: <FaBrain size={32} color="#2563eb" />,
        title: "AI Detection",
        text: "Advanced AI detects phishing, malware and online scams in real time.",
    },
    {
        icon: <FaBolt size={32} color="#2563eb" />,
        title: "Fast Analysis",
        text: "Instant scanning of URLs, QR codes, files and suspicious emails.",
    },
    {
        icon: <FaLock size={32} color="#2563eb" />,
        title: "Secure & Private",
        text: "Your data stays protected with secure processing and privacy-first design.",
    },
    {
        icon: <FaClock size={32} color="#2563eb" />,
        title: "24/7 Protection",
        text: "Continuous monitoring keeps you protected against emerging threats.",
    },
];

export default function WhyChoose() {
    return (
        <section
            style={{
                background: "#ffffff",
                padding: "90px 8%",
            }}
        >
            <div
                style={{
                    maxWidth: "1280px",
                    margin: "auto",
                }}
            >
                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "60px",
                    }}
                >
                    <h2
                        style={{
                            fontSize: "46px",
                            color: "#0f172a",
                            marginBottom: "15px",
                        }}
                    >
                        Why Choose ScamShield?
                    </h2>

                    <p
                        style={{
                            color: "#64748b",
                            fontSize: "18px",
                        }}
                    >
                        Built with AI-powered security to keep you safe from modern cyber threats.
                    </p>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
                        gap: "30px",
                    }}
                >
                    {features.map((item, index) => (
                        <div
                            key={index}
                            style={{
                                background: "#f8fafc",
                                borderRadius: "22px",
                                padding: "40px",
                                textAlign: "center",
                                transition: ".3s",
                                boxShadow: "0 10px 30px rgba(0,0,0,.05)",
                            }}
                        >
                            <div
                                style={{
                                    width: "75px",
                                    height: "75px",
                                    borderRadius: "50%",
                                    background: "#dbeafe",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    margin: "auto",
                                    marginBottom: "20px",
                                }}
                            >
                                {item.icon}
                            </div>

                            <h3
                                style={{
                                    fontSize: "24px",
                                    color: "#0f172a",
                                    marginBottom: "15px",
                                }}
                            >
                                {item.title}
                            </h3>

                            <p
                                style={{
                                    color: "#64748b",
                                    lineHeight: "1.7",
                                }}
                            >
                                {item.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
} 