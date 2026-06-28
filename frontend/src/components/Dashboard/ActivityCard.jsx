function ActivityCard({ icon, title, value }) {
  return (
    <div
      style={{
        background: "#1e293b",
        borderRadius: "16px",
        padding: "20px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
      }}
    >
      <div
        style={{
          width: "55px",
          height: "55px",
          borderRadius: "14px",
          background: "#0f172a",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "22px",
        }}
      >
        {icon}
      </div>

      <div>
        <p
          style={{
            color: "#94a3b8",
            margin: 0,
            fontSize: "14px",
          }}
        >
          {title}
        </p>

        <h2
          style={{
            margin: "6px 0 0",
            color: "white",
            fontSize: "28px",
          }}
        >
          {value}
        </h2>
      </div>
    </div>
  );
}

export default ActivityCard;