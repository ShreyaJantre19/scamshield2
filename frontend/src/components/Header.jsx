import { FaShieldAlt } from "react-icons/fa";

function Header() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "40px",
      }}
    >
      <div
        style={{
          width: "90px",
          height: "90px",
          backgroundColor: "#2563eb",
          borderRadius: "50%",
          margin: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FaShieldAlt color="white" size={40} />
      </div>

      <h1 style={{ marginTop: "15px" }}>
        ScamShield
      </h1>

      <p>
        Protect yourself from phishing, scams and malicious content
      </p>
    </div>
  );
}

export default Header;