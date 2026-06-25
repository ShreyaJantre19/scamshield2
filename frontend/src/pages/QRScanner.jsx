import Navbar from "../components/Navbar";
import { useState } from "react";
import { Link } from "react-router-dom";
import jsQR from "jsqr";
import { analyzeURL } from "../services/api";

import {
    FaArrowLeft,
    FaQrcode,
    FaUpload,
    FaShieldAlt,
    FaCheckCircle,
    FaExclamationTriangle,
    FaLock,
    FaGlobe,
} from "react-icons/fa";

function QRScanner() {

    const [image, setImage] = useState(null);

    const [loading, setLoading] = useState(false);

    const [decodedText, setDecodedText] = useState("");

    const [analysis, setAnalysis] = useState(null);

    const [error, setError] = useState("");

    const handleScanQR = async () => {

        if (!image) {

            setError("Please upload a QR image.");

            return;

        }

        setError("");

        setLoading(true);

        setAnalysis(null);

        setDecodedText("");

        const reader = new FileReader();

        reader.onload = (event) => {

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

                if (!code) {

                    setLoading(false);

                    setError("No QR Code detected.");

                    return;

                }

                setDecodedText(code.data);

                try {

                    const data = await analyzeURL(code.data);

                    setAnalysis(data);

                } catch (err) {

                    setError("Unable to analyze QR URL.");

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

            <div className="min-h-screen bg-slate-950">

                <section className="bg-gradient-to-r from-slate-950 via-blue-950 to-blue-700 text-white">

                    <div className="max-w-7xl mx-auto px-8 py-16">

                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-10"
                        >
                            <FaArrowLeft />

                            Back to Home

                        </Link>

                        <div className="grid lg:grid-cols-2 gap-16 items-center">

                            <div>

                                <div className="inline-flex gap-2 items-center bg-blue-600 rounded-full px-5 py-2 mb-8">

                                    <FaShieldAlt />

                                    AI QR Scanner

                                </div>

                                <h1 className="text-6xl font-black leading-tight">

                                    Scan QR Codes

                                    <br />

                                    Before You

                                    <span className="text-sky-300">

                                        {" "}Trust Them

                                    </span>

                                </h1>

                                <p className="mt-8 text-xl text-blue-100 leading-8">

                                    ScamShield extracts hidden links from QR
                                    codes and instantly checks them for phishing,
                                    malware and other online threats.

                                </p>

                            </div>

                            <div className="flex justify-center">

                                <div className="w-80 h-80 rounded-full bg-blue-500/20 backdrop-blur flex justify-center items-center shadow-[0_0_100px_rgba(59,130,246,.45)]">

                                    <FaQrcode className="text-8xl text-white" />

                                </div>

                            </div>

                        </div>

                    </div>

                </section>

                <section className="max-w-6xl mx-auto px-8 -mt-14 relative z-20">

                    <div className="bg-white rounded-3xl shadow-2xl p-8">

                        <h2 className="text-3xl font-bold">

                            Upload QR Image

                        </h2>

                        <p className="text-gray-500 mt-3">

                            Upload a screenshot or photo containing a QR Code.

                        </p>

                        <div className="mt-8 border-2 border-dashed border-blue-300 rounded-3xl p-12 text-center">

                            <FaUpload
                                className="mx-auto text-blue-600 mb-6"
                                size={55}
                            />

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files[0])}
                            />

                        </div>

                        <button

                            onClick={handleScanQR}

                            disabled={loading}

                            className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold"

                        >

                            {loading ? "Scanning..." : "Scan QR Code"}

                        </button>

                        {error && (

                            <div className="mt-6 bg-red-50 border border-red-300 rounded-xl p-4 text-red-700">

                                {error}

                            </div>

                        )}

                        {loading && (

                            <div className="mt-8">

                                <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">

                                    <div className="w-2/3 h-full bg-blue-600 animate-pulse"></div>

                                </div>

                                <p className="mt-4 text-gray-500">

                                    ScamShield AI is analyzing your QR code...

                                </p>

                            </div>

                        )}

                        {analysis && (

                            <><div className="mt-10">

                                <div className="grid md:grid-cols-3 gap-6">

                                    <div className="bg-slate-50 rounded-2xl p-6">

                                        <p className="text-gray-500">

                                            Risk Score

                                        </p>

                                        <h2 className="text-5xl font-black mt-3">

                                            {analysis.score}/100

                                        </h2>

                                    </div>

                                    <div className="bg-slate-50 rounded-2xl p-6">

                                        <p className="text-gray-500">

                                            QR Content

                                        </p>

                                        <p className="mt-4 break-all">

                                            {decodedText}

                                        </p>

                                    </div>

                                    <div className="bg-slate-50 rounded-2xl p-6">

                                        <p className="text-gray-500">

                                            Risk Level

                                        </p>

                                        <div className="mt-4"></div>
                                        {analysis.level === "SAFE" && (
                                            <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
                                                <FaCheckCircle />
                                                SAFE
                                            </span>
                                        )}

                                        {analysis.level === "SUSPICIOUS" && (
                                            <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-semibold">
                                                <FaExclamationTriangle />
                                                SUSPICIOUS
                                            </span>
                                        )}

                                        {analysis.level === "DANGEROUS" && (
                                            <span className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold">
                                                <FaExclamationTriangle />
                                                DANGEROUS
                                            </span>
                                        )}

                                    </div>

                                </div>

                            </div><div className="grid lg:grid-cols-2 gap-6 mt-6">

                                    <div className="bg-white border rounded-2xl p-6">

                                        <h3 className="text-2xl font-bold mb-4">
                                            AI Analysis
                                        </h3>

                                        <p className="text-gray-700 leading-8">
                                            {analysis.explanation}
                                        </p>

                                    </div>

                                    <div className="bg-white border rounded-2xl p-6">

                                        <h3 className="text-2xl font-bold mb-4">
                                            Website Information
                                        </h3>

                                        <div className="space-y-4">

                                            <div className="flex justify-between">
                                                <span>SSL Certificate</span>

                                                <span className="font-semibold flex items-center gap-2">

                                                    <FaLock className="text-blue-600" />

                                                    {analysis.ssl_info?.valid
                                                        ? "Valid"
                                                        : "Invalid"}

                                                </span>

                                            </div>

                                            <div className="flex justify-between">

                                                <span>Domain Age</span>

                                                <span className="font-semibold">

                                                    {analysis.domain_age !== null
                                                        ? `${analysis.domain_age} days`
                                                        : "Unknown"}

                                                </span>

                                            </div>

                                            <div className="flex justify-between">

                                                <span>Redirects</span>

                                                <span className="font-semibold">

                                                    {analysis.redirect_info?.redirect_count ?? 0}

                                                </span>

                                            </div>

                                            <div className="flex justify-between">

                                                <span>Typosquatting</span>

                                                <span className="font-semibold">

                                                    {analysis.typosquatting?.detected
                                                        ? `Possible ${analysis.typosquatting.brand}`
                                                        : "Not Detected"}

                                                </span>

                                            </div>

                                        </div>

                                    </div>

                                </div><div className="mt-6 bg-white border rounded-2xl p-6">

                                    <h3 className="text-2xl font-bold mb-5">
                                        Detection Reasons
                                    </h3>

                                    <div className="space-y-3">

                                        {analysis.reasons.map((reason, index) => (

                                            <div
                                                key={index}
                                                className="flex gap-3 items-start bg-slate-50 rounded-xl p-4"
                                            >

                                                {analysis.level === "SAFE" ? (

                                                    <FaCheckCircle className="text-green-600 mt-1" />

                                                ) : (

                                                    <FaExclamationTriangle className="text-red-500 mt-1" />

                                                )}

                                                <span>{reason}</span>

                                            </div>

                                        ))}

                                    </div>

                                </div><div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-6">

                                    <h3 className="text-2xl font-bold mb-4">
                                        ScamShield Recommendation
                                    </h3>

                                    {analysis.level === "SAFE" && (

                                        <p className="text-green-700 leading-8">

                                            This QR code appears safe. Continue carefully and always verify websites before entering passwords or payment information.

                                        </p>

                                    )}

                                    {analysis.level === "SUSPICIOUS" && (

                                        <p className="text-yellow-700 leading-8">

                                            This QR code contains suspicious characteristics. Verify the destination before opening the link.

                                        </p>

                                    )}

                                    {analysis.level === "DANGEROUS" && (

                                        <p className="text-red-700 leading-8">

                                            Avoid scanning or opening this QR code. It shows multiple phishing indicators and could lead to malicious websites.

                                        </p>

                                    )}

                                </div>
                            </>
                        )}
                    </div>
                </section>
            </div>
        </>

    );

}

export default QRScanner; 