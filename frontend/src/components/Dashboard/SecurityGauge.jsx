import { FaShieldAlt } from "react-icons/fa";

function SecurityGauge() {
    return (
        <div
            style={{
                background: "#0f172a",
                borderRadius: "20px",
                padding: "30px",
                textAlign: "center",
            }}
        >
            <div
                style={{
                    width: "110px",
                    height: "110px",
                    borderRadius: "50%",
                    margin: "0 auto 20px",
                    border: "8px solid #22c55e",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#22c55e",
                    fontSize: "40px",
                }}
            >
                <FaShieldAlt />
            </div>

            <h2
                style={{
                    marginBottom: "8px",
                    color: "white",
                }}
            >
                Security Score
            </h2>

            <h1
                style={{
                    fontSize: "48px",
                    color: "#22c55e",
                    margin: "10px 0",
                }}
            >
                96%
            </h1>

            <p
                style={{
                    color: "#94a3b8",
                }}
            >
                Your device is highly protected.
            </p>
        </div>
    );
}

export default SecurityGauge;