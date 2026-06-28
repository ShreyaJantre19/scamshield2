import { useState } from "react";
import { Link } from "react-router-dom";
import { analyzeURL } from "../services/api";

import {
    FaArrowLeft,
    FaShieldAlt,
    FaSearch,
    FaLock,
    FaGlobe,
    FaExclamationTriangle,
    FaCheckCircle,
    FaCopy,
} from "react-icons/fa";

export default function URLChecker() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const handleAnalyze = async () => {
        if (!url.trim()) {
            setError("Please enter a URL.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setResult(null);

            const response = await analyzeURL(url);
            setResult(response);
        } catch (err) {
            setError(err?.message || "Unable to analyze URL.");
        } finally {
            setLoading(false);
        }
    };

    const copyURL = async () => {
        try {
            await navigator.clipboard.writeText(url);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950">

            {/* HERO */}

            <section className="bg-gradient-to-r from-slate-950 via-blue-950 to-blue-700 text-white">

                <div className="max-w-7xl mx-auto px-8 py-16">

                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-10"
                    >
                        <FaArrowLeft />
                        Back to Home
                    </Link>

                    <div className="grid lg:grid-cols-2 gap-14 items-center">

                        <div>

                            <div className="inline-flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-full mb-6">
                                <FaShieldAlt />
                                AI URL Protection
                            </div>

                            <h1 className="text-6xl font-black leading-tight">
                                Scan URLs
                                <br />
                                Before You
                                <span className="text-sky-300"> Click</span>
                            </h1>

                            <p className="mt-8 text-blue-100 text-xl leading-8">
                                Detect phishing websites, fake login pages,
                                malicious redirects and suspicious domains
                                using ScamShield AI.
                            </p>

                        </div>

                        <div className="flex justify-center">

                            <div className="w-80 h-80 rounded-full bg-blue-500/20 backdrop-blur flex items-center justify-center shadow-[0_0_100px_rgba(59,130,246,.5)]">

                                <FaGlobe className="text-8xl text-white" />

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* SCANNER */}

            <section className="max-w-6xl mx-auto px-8 -mt-16 relative z-10">

                <div className="bg-white rounded-3xl shadow-2xl p-8">

                    <h2 className="text-3xl font-bold mb-6">
                        URL Scanner
                    </h2>

                    <div className="flex gap-4">

                        <input
                            type="text"
                            placeholder="https://example.com"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="flex-1 border-2 border-gray-200 rounded-xl px-5 py-4 outline-none focus:border-blue-500"
                        />

                        <button
                            onClick={handleAnalyze}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-xl flex items-center gap-3"
                        >
                            <FaSearch />
                            {loading ? "Scanning..." : "Scan"}
                        </button>

                    </div>

                    <div className="flex gap-3 mt-4">

                        <button
                            onClick={copyURL}
                            className="border rounded-lg px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                        >
                            <FaCopy />
                            Copy URL
                        </button>

                    </div>

                    {error && (
                        <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                            {error}
                        </div>
                    )}

                    {loading && (
                        <div className="mt-10">

                            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 animate-pulse w-2/3"></div>
                            </div>

                            <p className="mt-4 text-gray-500">
                                ScamShield AI is analyzing the website...
                            </p>

                        </div>
                    )}

                    {result && (

                        <div className="mt-10 space-y-6">

                            <div className="grid md:grid-cols-3 gap-6">

                                <div className="bg-slate-50 rounded-2xl p-6">

                                    <p className="text-gray-500">
                                        Risk Score
                                    </p>

                                    <h2 className="text-5xl font-black mt-3">
                                        {result.score ?? 0}/100
                                    </h2>

                                </div>

                                <div className="bg-slate-50 rounded-2xl p-6">

                                    <p className="text-gray-500">
                                        Risk Level
                                    </p>

                                    <div className="mt-4">

                                        {result.level === "SAFE" && (
                                            <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
                                                <FaCheckCircle />
                                                SAFE
                                            </span>
                                        )}

                                        {result.level === "SUSPICIOUS" && (
                                            <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-semibold">
                                                <FaExclamationTriangle />
                                                SUSPICIOUS
                                            </span>
                                        )}

                                        {result.level === "DANGEROUS" && (
                                            <span className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold">
                                                <FaExclamationTriangle />
                                                DANGEROUS
                                            </span>
                                        )}

                                    </div>

                                </div>

                                <div className="bg-slate-50 rounded-2xl p-6">

                                    <p className="text-gray-500">
                                        SSL Certificate
                                    </p>

                                    <div className="mt-4 flex items-center gap-3 text-xl font-semibold">

                                        <FaLock className="text-blue-600" />

                                        {result.ssl_info?.valid
                                            ? "Valid SSL Certificate"
                                            : "Invalid / Missing SSL"}

                                    </div>

                                </div>

                            </div>

                            <div className="grid lg:grid-cols-2 gap-6">

                                <div className="bg-white border rounded-2xl p-6">

                                    <h3 className="text-2xl font-bold mb-5">
                                        Explanation
                                    </h3>

                                    <p className="text-gray-700 leading-8">
                                        {result.explanation || "No explanation available."}
                                    </p>

                                </div>

                                <div className="bg-white border rounded-2xl p-6">

                                    <h3 className="text-2xl font-bold mb-5">
                                        Domain Information
                                    </h3>

                                    <div className="space-y-3">

                                        <div className="flex justify-between">
                                            <span>Domain Age</span>
                                            <strong>
                                                {result.domain_age != null
                                                    ? `${result.domain_age} days`
                                                    : "Unknown"}
                                            </strong>
                                        </div>

                                        <div className="flex justify-between">
                                            <span>Redirects</span>
                                            <strong>
                                                {result.redirect_info?.redirect_count ?? "Unknown"}
                                            </strong>
                                        </div>

                                        <div className="flex justify-between">
                                            <span>Typosquatting</span>
                                            <strong>
                                                {result.typosquatting?.detected
                                                    ? `Possible ${result.typosquatting.brand}`
                                                    : "Not Detected"}
                                            </strong>
                                        </div>

                                    </div>

                                </div>

                            </div>
                            <div className="bg-white border rounded-2xl p-6">

                                <h3 className="text-2xl font-bold mb-6">
                                    Detection Reasons
                                </h3>

                                <div className="space-y-3">

                                    {(result.reasons || []).length > 0 ? (
                                        result.reasons.map((reason, index) => (

                                            <div
                                                key={index}
                                                className="flex gap-3 items-start bg-slate-50 rounded-xl p-4"
                                            >

                                                {result.level === "SAFE" ? (
                                                    <FaCheckCircle className="text-green-600 mt-1" />
                                                ) : (
                                                    <FaExclamationTriangle className="text-red-500 mt-1" />
                                                )}

                                                <span>{reason}</span>

                                            </div>

                                        ))
                                    ) : (

                                        <div className="text-gray-500">
                                            No detection reasons available.
                                        </div>

                                    )}

                                </div>

                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">

                                <h3 className="text-2xl font-bold mb-4">
                                    ScamShield Recommendation
                                </h3>

                                {result.level === "SAFE" && (
                                    <p className="text-green-700 leading-8">
                                        This website appears to be safe based on our current
                                        analysis. Continue browsing, but always stay alert.
                                    </p>
                                )}

                                {result.level === "SUSPICIOUS" && (
                                    <p className="text-yellow-700 leading-8">
                                        Exercise caution. This website has several suspicious
                                        characteristics. Verify the sender or domain before
                                        entering personal information.
                                    </p>
                                )}

                                {result.level === "DANGEROUS" && (
                                    <p className="text-red-700 leading-8">
                                        Avoid visiting or interacting with this website.
                                        It exhibits multiple phishing indicators and could put
                                        your credentials or personal data at risk.
                                    </p>
                                )}

                            </div>

                        </>
                    )}

                </div>

            </section>
        </div>
    );
}