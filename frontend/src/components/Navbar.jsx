import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        gap: "20px",
        padding: "15px",
        backgroundColor: "#2563eb",
      }}
    >
      <Link
        to="/"
        style={{ color: "white", textDecoration: "none" }}
      >
        Home
      </Link>

      <Link
        to="/about"
        style={{ color: "white", textDecoration: "none" }}
      >
        About
      </Link>

      <Link
        to="/report-scam"
        style={{ color: "white", textDecoration: "none" }}
      >
        Report Scam
      </Link>
    </nav>
  );
}

export default Navbar;