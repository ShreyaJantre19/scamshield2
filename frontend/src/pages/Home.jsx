import React from "react";
import Navbar from "../components/navbar";
import Header from "../components/header";
import FeatureCard from "../components/featuredCard";
import StatsCard from "../components/statsCard";
import {
  FaQrcode,
  FaLink,
  FaFile,
  FaEnvelope
} from "react-icons/fa";

function Home() {
  return (
    <React.Fragment>
      <Navbar />

      <Header />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          padding: "20px",
        }}
      >
        <FeatureCard
          title="QR Code Scanner"
          description="Upload or scan QR codes."
          icon={<FaQrcode color="#9333ea" />}
          link="/qr-scanner"
        />

        <FeatureCard
          title="URL Checker"
          description="Verify website URLs."
          icon={<FaLink color="#2563eb" />}
          link="/url-checker"
        />

        <FeatureCard
          title="File Scanner"
          description="Scan files for malware."
          icon={<FaFile color="#16a34a" />}
          link="/file-scanner"
        />

        <FeatureCard
          title="Email Analyzer"
          description="Analyze suspicious emails."
          icon={<FaEnvelope color="#ea580c" />}
          link="/email-analyzer"
        />

      </div>
      <div style={{ padding: "20px" }}>
        <h2 style={{ textAlign: "center" }}>
          Security Stats
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "20px",
          }}
        >
          <StatsCard
            value="12,453"
            label="Threats Blocked"
            color="#dcfce7"
          />

          <StatsCard
            value="98.7%"
            label="Detection Rate"
            color="#dbeafe"
          />

          <StatsCard
            value="45,892"
            label="Scans Completed"
            color="#f3e8ff"
          />
        </div>
      </div>
    </React.Fragment>
  );
}

export default Home;