import { useNavigate } from "react-router-dom";

function QuickAction({ icon, title }) {
    const navigate = useNavigate();

    const handleClick = () => {
        switch (title) {
            case "Scan URL":
                navigate("/url-checker");
                break;

            case "Scan QR Code":
                navigate("/qr-scanner");
                break;

            case "Scan File":
                navigate("/file-scanner");
                break;

            case "Analyze Email":
                navigate("/email-analyzer");
                break;

            default:
                break;
        }
    };

    return (
        <button
            onClick={handleClick}
            style={{
                width: "100%",
                marginBottom: "15px",
                padding: "16px 18px",
                background: "#1e293b",
                border: "none",
                borderRadius: "14px",
                color: "white",
                display: "flex",
                alignItems: "center",
                gap: "15px",
                cursor: "pointer",
                fontSize: "16px",
                transition: "0.3s",
            }}
        >
            <span style={{ fontSize: "20px" }}>{icon}</span>
            <span>{title}</span>
        </button>
    );
}

export default QuickAction;