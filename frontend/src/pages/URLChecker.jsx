import Navbar from "../components/Navbar";
import { analyzeURL } from "../services/api";
import { useState } from "react";
function URLChecker() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleCheckUrl = async () => {
    setLoading(true);
    const data = await analyzeURL(url);
    console.log(data);
    setResult(data);
    setLoading(false);
  };
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
        <h1>URL Checker</h1>

        <p>
          Enter a website URL to check if it is safe,
          suspicious, or malicious.
        </p>

        <input
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "20px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={handleCheckUrl}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
          }}
        >
          {loading ? "Checking..." : "Check URL"}
        </button>

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
              }}
            >
              <h3>Analysis Result</h3>

              <p>
                <strong>Status:</strong> {result.status.replace("_", " ").toUpperCase()}
              </p>

              <p>
                <strong>Score:</strong> {result.score}
              </p>

              <p>
                <strong>Reasons:</strong>
              </p>

              <ul>
                {result.reasons?.map((reason, index) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default URLChecker;