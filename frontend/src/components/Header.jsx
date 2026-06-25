import { Shield, Play, Globe, QrCode, FileText, Mail } from "lucide-react";

function Header() {
  return (
    <section
      style={{
        background:
          "linear-gradient(135deg, #081B3A 0%, #0F3D91 50%, #2563EB 100%)",
        color: "white",
        padding: "70px 60px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "50px",
          flexWrap: "wrap",
        }}
      >
        {/* Left Side */}

        <div style={{ flex: 1, minWidth: "400px" }}>
          <span
            style={{
              background: "#1e40af",
              padding: "8px 18px",
              borderRadius: "30px",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            AI POWERED PROTECTION
          </span>

          <h1
            style={{
              fontSize: "60px",
              lineHeight: "1.2",
              marginTop: "25px",
              marginBottom: "20px",
            }}
          >
            Stay Safe from Scams,
            <br />
            Phishing &
            <br />
            <span style={{ color: "#60a5fa" }}>Malicious Threats</span>
          </h1>

          <p
            style={{
              fontSize: "20px",
              color: "#d1d5db",
              lineHeight: "1.7",
              maxWidth: "650px",
            }}
          >
            ScamShield uses AI technology to detect phishing links,
            suspicious QR codes, malware and fraudulent emails before
            they can harm you.
          </p>

          <div
            style={{
              display: "flex",
              gap: "20px",
              marginTop: "35px",
            }}
          >
            <button
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "16px 30px",
                borderRadius: "12px",
                fontSize: "17px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              <Shield size={18} style={{ marginRight: "8px" }} />
              Start Scanning
            </button>

            <button
              style={{
                background: "transparent",
                color: "white",
                border: "2px solid white",
                padding: "16px 30px",
                borderRadius: "12px",
                fontSize: "17px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              <Play size={18} style={{ marginRight: "8px" }} />
              Learn More
            </button>
          </div>
        </div>

        {/* Right Side */}

        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minWidth: "350px",
          }}
        >
          <div
            style={{
              width: "280px",
              height: "280px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, #3b82f6 0%, #1d4ed8 100%)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 0 80px rgba(37,99,235,.6)",
            }}
          >
            <Shield size={130} color="white" />
          </div>
        </div>
      </div>

      {/* Feature Cards */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "20px",
          marginTop: "70px",
        }}
      >
        <Card icon={<Globe />} title="URL Protection" />
        <Card icon={<QrCode />} title="QR Scanner" />
        <Card icon={<FileText />} title="File Scanner" />
        <Card icon={<Mail />} title="Email Analyzer" />
      </div>
    </section>
  );
}

function Card({ icon, title }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,.12)",
        backdropFilter: "blur(10px)",
        borderRadius: "18px",
        padding: "20px",
        textAlign: "center",
        border: "1px solid rgba(255,255,255,.15)",
      }}
    >
      <div
        style={{
          marginBottom: "10px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>

      <h3>{title}</h3>

      <p style={{ color: "#d1d5db" }}>
        Protected
      </p>
    </div>
  );
}

export default Header;