import Navbar from "../components/Navbar";
import { analyzeFile } from "../services/api";
import { useState } from "react";

function FileScanner() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const handleScan = async () => {
    if (!file) {
      setResult("Please select a file first");
      return;
    }

    try {
      const data = await analyzeFile(file);

      setResult(
        `Filename: ${data.filename}
        Status: ${data.status}
        Risk Score: ${data.risk_score}
        Reasons: ${data.reasons.length > 0
          ? data.reasons.join(", ")
          : "No threats detected"
        }`
      );
    } catch (error) {
      setResult("Error: " + error.message);
    }
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
        <h1>File Scanner</h1>

        <p>
          Upload files to scan for malware, viruses,
          and suspicious content.
        </p>

        <div
          style={{
            border: "2px dashed #ccc",
            padding: "40px",
            marginTop: "20px",
            textAlign: "center",
            borderRadius: "10px",
          }}
        >
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <button
          onClick={handleScan}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
          }}
        >
          Scan File
        </button>

        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            backgroundColor: "#f3f4f6",
            borderRadius: "10px",
          }}
        >
          <h3>Scan Result</h3>
          <p>{result || "No file scanned yet."}</p>
        </div>
      </div>
    </>
  );
}

export default FileScanner; 