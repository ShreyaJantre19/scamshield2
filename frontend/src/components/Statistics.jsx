import {
    FaShieldAlt,
    FaBug,
    FaCheckCircle,
    FaChartLine,
} from "react-icons/fa";

const stats = [
    {
        number: "12,453",
        label: "Threats Blocked",
        desc: "AI Security Statistics",
        icon: <FaBug size={22} color="#16a34a" />,
        bg: "#dcfce7",
    },
    {
        number: "98.7%",
        label: "Detection Rate",
        desc: "AI Security Statistics",
        icon: <FaShieldAlt size={22} color="#2563eb" />,
        bg: "#dbeafe",
    },
    {
        number: "45,892",
        label: "Scans Completed",
        desc: "AI Security Statistics",
        icon: <FaChartLine size={22} color="#7c3aed" />,
        bg: "#ede9fe",
    },
    {
        number: "24/7",
        label: "AI Protection",
        desc: "Always Monitoring",
        icon: <FaCheckCircle size={22} color="#f59e0b" />,
        bg: "#fef3c7",
    },
];

export default function Statistics() {
    return (
        <section
            style={{
                background: "#f8fafc",
                padding: "30px 8% 100px",
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
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
                        gap: "25px",
                    }}
                >
                    {stats.map((item, index) => (
                        <div
                            key={index}
                            style={{
                                background: "white",
                                borderRadius: "22px",
                                padding: "35px",
                                textAlign: "center",
                                boxShadow: "0 12px 30px rgba(0,0,0,.08)",
                            }}
                        >
                            <div
                                style={{
                                    width: "65px",
                                    height: "65px",
                                    borderRadius: "50%",
                                    background: item.bg,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    margin: "0 auto 20px",
                                }}
                            >
                                {item.icon}
                            </div>

                            <h2
                                style={{
                                    fontSize: "42px",
                                    margin: "0",
                                    color: "#0f172a",
                                }}
                            >
                                {item.number}
                            </h2>

                            <h3
                                style={{
                                    marginTop: "10px",
                                    fontSize: "22px",
                                    color: "#1e293b",
                                }}
                            >
                                {item.label}
                            </h3>

                            <p
                                style={{
                                    color: "#64748b",
                                    marginTop: "8px",
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