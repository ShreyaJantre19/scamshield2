import { Link } from "react-router-dom";

function FeatureCard({
  title,
  description,
  icon,
  link
}) {
  return (
    <Link
      to={link}
      style={{
        textDecoration: "none",
        color: "black",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "15px",
          boxShadow: "0 0 12px rgba(0,0,0,0.1)",
          transition: "0.3s",
        }}
      >
        <div style={{ fontSize: "35px" }}>
          {icon}
        </div>

        <h2>{title}</h2>

        <p>{description}</p>
      </div>
    </Link>
  );
}

export default FeatureCard;