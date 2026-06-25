import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import ReportScam from "./pages/ReportScam";
import QRScanner from "./pages/QRScanner";
import URLChecker from "./pages/URLChecker";
import FileScanner from "./pages/FileScanner";
import EmailAnalyzer from "./pages/EmailAnalyzer";
import Dashboard from "./pages/Dashboard";
import ChatBot from "./components/ChatBot";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/report-scam" element={<ReportScam />} />

        <Route path="/qr-scanner" element={<QRScanner />} />

        <Route path="/url-checker" element={<URLChecker />} />

        <Route path="/file-scanner" element={<FileScanner />} />

        <Route path="/email-analyzer" element={<EmailAnalyzer />} />

        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>

      <ChatBot />

    </BrowserRouter>
  );
}

export default App;  