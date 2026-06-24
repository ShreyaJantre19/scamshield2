import Navbar from "../components/Navbar";
import { useState } from "react";
import jsQR from "jsqr";
import { analyzeURL } from "../services/api";
function QRScanner() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");
  const [urlResult, setUrlResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const handleScanQR = async () => {
    if (!image) {
      setResult("Please select an image first");
      return;
    }

    setLoading(true);

    const reader = new FileReader();

    reader.onload = async (event) => {
      const img = new Image();

      img.onload = async () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );

        const code = jsQR(
          imageData.data,
          imageData.width,
          imageData.height
        );

        if (code) {
          if (code) {
            const data = await analyzeURL(code.data);

            setResult(`
            URL: ${code.data}

            Status: ${data.status}
            Score: ${data.score}

            Reasons:
            ${data.reasons.length > 0
                ? data.reasons.join("\n")
                : "No suspicious indicators found"}
            `);
          } else {
            setResult("No QR code detected");
          }
          try {
            const data = await analyzeURL(code.data);
            console.log("Analysis Data: ", data)
            setUrlResult(data);
          } catch (error) {
            console.error("Error scanning QR code:", error);
          }

        } else {
          setResult("No QR code detected");
        }

        setLoading(false);
      };

      img.src = event.target.result;
    };

    reader.readAsDataURL(image);
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
        <h1>QR Code Scanner</h1>

        <p>
          Upload a QR code image to check for phishing
          links and malicious websites.
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
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <button
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
          onClick={handleScanQR}
        >
          Scan QR Code
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

          <p>
            {loading
              ? `Scanning...`
              : result || "No QR code detected"}
          </p>
          {analysis && (
            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#fff"
              }}
            >
              <h3>URL Analysis</h3>

              <p>
                <strong>Status:</strong> {analysis.status}
              </p>

              <p>
                <strong>Score:</strong> {analysis.score}
              </p>

              <p>
                <strong>Reasons:</strong>
              </p>

              <ul>
                {analysis.reasons?.map((reason, index) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>
            </div>
          )}
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {result}
          </pre>
        </div>
      </div>
    </>
  );
}

export default QRScanner;
