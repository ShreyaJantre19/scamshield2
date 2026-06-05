import { useState } from "react";
function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleScan = () => {
    setLoading(true);
    // Simulate scanning delay
    setTimeout(() => {
      setLoading(false);
      // Here you could add actual scanning logic and update UI accordingly
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold mb-4">ScamShield AI</h1>
      <p className="text-gray-400 mb-8">Scan URLs and QR Codes for threats</p>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL"
        className="mb-4 p-2 rounded bg-gray-800 text-white"
      />
      <button
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
        onClick={handleScan}
      >
        {loading ? "Scanning..." : "Scan URL"}
      </button>
      <div className="mt-8 bg-gray-800 p-6 rounded-lg">
        <h2>Risk Score: 0</h2>
        <p>No scan performed</p>
      </div>
    </div>
  );
}

export default Home;