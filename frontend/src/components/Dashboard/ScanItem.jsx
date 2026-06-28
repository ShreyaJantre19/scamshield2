import { FaCheckCircle } from "react-icons/fa";

function ScanItem({ title, status }) {
    return (
        <div
            style={{
                background: "#1e293b",
                borderRadius: "14px",
                padding: "16px 20px",
                marginBottom: "15px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <div>
                <h4
                    style={{
                        margin: 0,
                        color: "white",
                    }}
                >
                    {title}
                </h4>

                <p
                    style={{
                        margin: "6px 0 0",
                        color: "#94a3b8",
                        fontSize: "14px",
                    }}
                >
                    Scan Completed
                </p>
            </div>

            <div
                style={{
                    color: "#22c55e",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontWeight: "600",
                }}
            >
                <FaCheckCircle />
                {status}
            </div>
        </div>
    );
}

export default ScanItem;