function StatsCard({
  value,
  label,
  color
}) {
  return (
    <div
      style={{
        backgroundColor: color,
        padding: "20px",
        borderRadius: "12px",
        textAlign: "center",
      }}
    >
      <h2>{value}</h2>
      <p>{label}</p>
    </div>
  );
}

export default StatsCard;