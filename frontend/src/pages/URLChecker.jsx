import { useState } from "react";
import Navbar from "../components/Navbar";
import {
    FaLink,
    FaSearch,
    FaShieldAlt,
    FaGlobe,
    FaCheckCircle,
    FaExclamationTriangle,
} from "react-icons/fa";

function URLChecker() {

    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    async function handleScan() {

        if (!url.trim()) return;

        setLoading(true);
        setResult(null);

        try {

            const response = await fetch(
                "/api/scan/url",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        url,
                    }),
                }
            );

            const data = await response.json();

            setResult(data);

        } catch {

            alert("Cannot connect to backend");

        }

        setLoading(false);

    }

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-slate-100">

                <section className="bg-gradient-to-r from-slate-900 via-blue-900 to-blue-600 text-white py-20">

                    <div className="max-w-6xl mx-auto px-6">

                        <div className="max-w-3xl">

                            <span className="bg-blue-500 px-4 py-2 rounded-full text-sm font-semibold">

                                AI URL Detection

                            </span>

                            <h1 className="text-5xl font-black mt-6 leading-tight">

                                Scan Any Website
                                <br />
                                Before You Click

                            </h1>

                            <p className="text-blue-100 mt-6 text-lg">

                                Detect phishing websites, fake domains,
                                malicious redirects and suspicious links
                                using ScamShield AI.

                            </p>

                        </div>

                    </div>

                </section>

                <section className="max-w-6xl mx-auto px-6 -mt-12 pb-20">

                    <div className="bg-white rounded-3xl shadow-xl p-8">

                        <h2 className="text-3xl font-bold mb-8">

                            URL Security Scanner

                        </h2>

                        <div className="flex gap-4">

                            <div className="relative flex-1">

                                <FaLink className="absolute left-5 top-5 text-blue-500" />

                                <input
                                    type="text"
                                    placeholder="https://example.com"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="w-full border-2 rounded-xl pl-14 pr-4 py-4 text-lg focus:border-blue-500 outline-none"
                                />

                            </div>

                            <button
                                onClick={handleScan}
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-xl font-bold flex items-center gap-3 transition"
                            >
                                <FaSearch />

                                {loading ? "Scanning..." : "Scan URL"}
                            </button>

                        </div>

                        {result && (

                            <div className="mt-12">

                                <div className="grid md:grid-cols-3 gap-6">

                                    <div className="bg-slate-50 rounded-2xl p-6">

                                        <p className="text-gray-500">

                                            Threat Score

                                        </p>

                                        <h2 className="text-5xl font-black mt-3 text-blue-600">

                                            {result.score}/100

                                        </h2>

                                    </div>

                                    <div className="bg-slate-50 rounded-2xl p-6">

                                        <p className="text-gray-500">

                                            Threat Level

                                        </p>

                                        <div className="mt-5">

                                            {result.level === "SAFE" && (

                                                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">

                                                    🟢 SAFE

                                                </span>

                                            )}

                                            {result.level === "SUSPICIOUS" && (

                                                <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-bold">

                                                    🟡 SUSPICIOUS

                                                </span>

                                            )}

                                            {result.level === "DANGEROUS" && (

                                                <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-bold">

                                                    🔴 DANGEROUS

                                                </span>

                                            )}

                                        </div>

                                    </div>

                                    <div className="bg-slate-50 rounded-2xl p-6">

                                        <p className="text-gray-500">

                                            Domain Age

                                        </p>

                                        <div className="flex items-center gap-3 mt-5">

                                            <FaGlobe className="text-blue-600 text-2xl" />

                                            <span className="text-2xl font-bold">

                                                {result.domain_age ?? "Unknown"} days

                                            </span>

                                        </div>

                                    </div>

                                </div>

                                <div className="mt-8 bg-white border rounded-2xl p-6 shadow">

                                    <h3 className="text-2xl font-bold mb-5">

                                        AI Explanation

                                    </h3>

                                    <p className="text-gray-700 leading-8">

                                        {result.explanation}

                                    </p>

                                </div>

                                <div className="mt-8 bg-white border rounded-2xl p-6 shadow">

                                    <h3 className="text-2xl font-bold mb-5">

                                        Threat Indicators

                                    </h3>

                                    <div className="space-y-3">

                                        {result.reasons?.length > 0 ? (

                                            result.reasons.map((reason, index) => (

                                                <div
                                                    key={index}
                                                    className="flex items-start gap-3 bg-slate-50 rounded-xl p-4"
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

                                            <div className="bg-green-50 text-green-700 rounded-xl p-4">

                                                No suspicious indicators detected.

                                            </div>

                                        )}

                                    </div>

                                </div>

                                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">

                                    <h3 className="text-2xl font-bold mb-5">

                                        ScamShield Recommendation

                                    </h3>

                                    {result.level === "SAFE" && (

                                        <p className="text-green-700 leading-8">

                                            This website appears safe to visit. No major phishing indicators were detected.

                                        </p>

                                    )}

                                    {result.level === "SUSPICIOUS" && (

                                        <p className="text-yellow-700 leading-8">

                                            Proceed carefully. Double-check the URL and avoid entering passwords or payment information unless you trust the website.

                                        </p>

                                    )}

                                    {result.level === "DANGEROUS" && (

                                        <p className="text-red-700 leading-8">

                                            This website appears highly dangerous. Do not visit it or provide any personal information.

                                        </p>

                                    )}

                                </div>

                            </div>

                        )}

                    </div>

                </section>

            </div>

        </>

    );

}

export default URLChecker; 