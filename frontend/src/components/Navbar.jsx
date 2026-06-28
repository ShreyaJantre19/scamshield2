import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  FaArrowRight,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import ShieldLogo from "./ShieldLogo";
import QuickScanModal from "./QuickScanModal";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();

  const [showQuickScan, setShowQuickScan] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Report Scam", path: "/report-scam" },
    { name: "Dashboard", path: "/dashboard" },
  ];

  return (
    <>
      <nav className="navbar">

        <div className="navbar-container">

          {/* Logo */}

          <Link to="/" className="logo">

            <ShieldLogo size={58} />

              <div>

                <h2 className="brand-title">
                  Scam<span>Shield</span>
                </h2>

                <div className="logo-subtitle">
                  AI CYBERSECURITY
                </div>

              </div>

          </Link>

          {/* Desktop Navigation */}

          <div className="desktop-nav">

            {links.map((link) => (

              <Link
                key={link.path}
                to={link.path}
                className={
                  location.pathname === link.path
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                {link.name}
              </Link>

            ))}

            <button
              className="scan-btn"
              onClick={() => setShowQuickScan(true)}
            >
              Start Scan
              <FaArrowRight />
            </button>

          </div>

          {/* Mobile Hamburger */}

          <button
            className="menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
          {/* Mobile Menu */}

          {menuOpen && (
            <div className="mobile-menu">

              {links.map((link) => (

                <Link
                  key={link.path}
                  to={link.path}
                  className={
                    location.pathname === link.path
                      ? "mobile-link active"
                      : "mobile-link"
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {link.name}
                </Link>

              ))}

              <button
                className="mobile-scan-btn"
                onClick={() => {
                  setMenuOpen(false);
                  setShowQuickScan(true);
                }}
              >
                Start Scan
                <FaArrowRight />
              </button>

            </div>
          )}

        </div>

      </nav>

      <QuickScanModal
        open={showQuickScan}
        onClose={() => setShowQuickScan(false)}
      />

    </>
  );
}

export default Navbar;