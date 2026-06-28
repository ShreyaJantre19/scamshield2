export default function DashboardCard({
    icon,
    title,
    value,
    color,
    borderColor,
}) {
    return (
        <div
            style={{
                background: "#0f172a",
                borderRadius: "22px",
                padding: "30px",
                border: `1px solid ${borderColor}`,
                transition: "0.3s",
                cursor: "pointer",
                boxShadow: "0 12px 30px rgba(0,0,0,.25)",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow =
                    "0 20px 45px rgba(37,99,235,.25)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0px)";
                e.currentTarget.style.boxShadow =
                    "0 12px 30px rgba(0,0,0,.25)";
            }}
        >
            <div
                style={{
                    width: "65px",
                    height: "65px",
                    borderRadius: "18px",
                    background: "rgba(255,255,255,.05)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "22px",
                }}
            >
                {icon}
            </div>

            <h2
                style={{
                    fontSize: "52px",
                    margin: 0,
                    color,
                    fontWeight: "800",
                }}
            >
                {value}
            </h2>

            <p
                style={{
                    color: "#94a3b8",
                    marginTop: "10px",
                    fontSize: "18px",
                }}
            >
                {title}
            </p>
        </div>
    );
}