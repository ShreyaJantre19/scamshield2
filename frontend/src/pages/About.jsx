import Navbar from "../components/navbar";

function About() {
  return (
    <>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h1>About ScamShield</h1>

        <p>
          ScamShield helps users detect phishing
          websites, malicious files and scam emails.
        </p>
      </div>
    </>
  );
}

export default About;