import Navbar from "../components/Navbar";
import { analyzeEmail } from "../services/api";
import { useState } from "react";

function EmailAnalyzer() {
  const [sender, setSender] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);

    try {
      const response = await analyzeEmail({
        sender,
        subject,
        body,
      });
      setResult(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const verdictColor =
    result?.verdict === "High Risk"
      ? "red"
      : result?.verdict === "Medium Risk"
        ? "orange"
        : "green";

  return (
    <>
      <Navbar />

      <div
        style={{
          maxWidth: "800px",
          margin: "40px auto",
          padding: "20px",
        }}
      >
        <h1>Email Analyzer</h1>
        <input
          type="text"
          placeholder="Sender Email"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "10px",
            borderRadius: "8px",
          }}
        />
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "10px",
            borderRadius: "8px",
          }}
        />

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows="10"
          placeholder="Paste email body here..."
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "10px",
            borderRadius: "8px",
          }}
        />

        <button
          onClick={() => handleAnalyze()}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
          }}
        >{loading ? "Analyzing..." : "Analyze Email"}
        </button>

        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            backgroundColor: "#f3f4f6",
            borderRadius: "10px",
          }}
        >
          <div
            style={{
              marginTop: "30px",
              padding: "20px",
              backgroundColor: "#f3f4f6",
              borderRadius: "10px",
            }}
          >
            {result && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "15px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                }}>
                <h3 style={{ marginTop: "20px" }}>Analysis Result</h3>

                <p style={{ color: verdictColor, fontWeight: "bold" }}>
                  Verdict: {result.verdict}
                </p>

                <p>
                  <strong>Risk Score:</strong> {result.risk_score}
                </p>

                <ul>
                  {result.reasons.map((reason, index) => (
                    <li key={index}>{reason}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export default EmailAnalyzer;