import { Link } from "react-router-dom";
import { FaShieldAlt } from "react-icons/fa";

function Navbar() {
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: "#0f172a",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "auto",
          padding: "18px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo */}

        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "white",
            textDecoration: "none",
            fontWeight: "700",
            fontSize: "32px",
          }}
        >
          <FaShieldAlt color="#3b82f6" size={34} />
          ScamShield
        </Link>

        {/* Navigation */}

        <div
          style={{
            display: "flex",
            gap: "40px",
            alignItems: "center",
          }}
        >
          <Link
            to="/"
            style={{
              color: "white",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Home
          </Link>

          <Link
            to="/about"
            style={{
              color: "white",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            About
          </Link>

          <Link
            to="/report-scam"
            style={{
              color: "white",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Report Scam
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;  