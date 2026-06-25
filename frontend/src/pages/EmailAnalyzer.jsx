import Navbar from "../components/Navbar";
import { useState } from "react";
import { Link } from "react-router-dom";

import {
    FaArrowLeft,
    FaEnvelope,
    FaShieldAlt,
    FaPaperPlane,
    FaUser,
} from "react-icons/fa";

function EmailAnalyzer() {

    const [fromEmail, setFromEmail] = useState("");

    const [replyTo, setReplyTo] = useState("");

    const [subject, setSubject] = useState("");

    const [body, setBody] = useState("");

    const [loading, setLoading] = useState(false);

    const [result, setResult] = useState(null);

    const [error, setError] = useState("");

    async function handleAnalyze() {

        setLoading(true);

        setError("");

        setResult(null);

        try {

            const response = await fetch(

                "http://127.0.0.1:8000/scan/email",

                {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify({

                        from_email: fromEmail,

                        reply_to: replyTo,

                        subject: subject,

                        body: body

                    })

                }

            );

            const data = await response.json();

            setResult(data);

        }

        catch {

            setError("Cannot connect to backend.");

        }

        finally {

            setLoading(false);

        }

    }

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

                                <div className="inline-flex items-center gap-2 bg-blue-600 rounded-full px-5 py-2 mb-8">

                                    <FaShieldAlt />

                                    AI Email Analyzer

                                </div>

                                <h1 className="text-6xl font-black leading-tight">

                                    Detect

                                    <br />

                                    Phishing

                                    <br />

                                    Emails

                                </h1>

                                <p className="mt-8 text-xl text-blue-100 leading-8">

                                    Analyze suspicious emails using

                                    ScamShield AI and detect phishing,

                                    spoofing and social engineering attacks.

                                </p>

                            </div>

                            <div className="flex justify-center">

                                <div className="w-80 h-80 rounded-full bg-blue-500/20 backdrop-blur flex justify-center items-center shadow-[0_0_100px_rgba(59,130,246,.45)]">

                                    <FaEnvelope

                                        className="text-8xl text-white"

                                    />

                                </div>

                            </div>

                        </div>

                    </div>

                </section>

                <section className="max-w-6xl mx-auto px-8 -mt-14 relative z-20">

                    <div className="bg-white rounded-3xl shadow-2xl p-8">

                        <h2 className="text-3xl font-bold">

                            Email Scanner

                        </h2>

                        <p className="text-gray-500 mt-2">

                            Paste email details below.

                        </p>

                        <div className="grid md:grid-cols-2 gap-6 mt-8">

                            <div>

                                <label className="font-semibold">

                                    From Email

                                </label>

                                <input

                                    value={fromEmail}

                                    onChange={(e) => setFromEmail(e.target.value)}

                                    className="w-full border rounded-xl p-4 mt-2"

                                    placeholder="sender@example.com"

                                />

                            </div>

                            <div>

                                <label className="font-semibold">

                                    Reply To

                                </label>

                                <input

                                    value={replyTo}

                                    onChange={(e) => setReplyTo(e.target.value)}

                                    className="w-full border rounded-xl p-4 mt-2"

                                    placeholder="reply@example.com"

                                />

                            </div>

                            <div className="md:col-span-2">

                                <label className="font-semibold">

                                    Subject

                                </label>

                                <input

                                    value={subject}

                                    onChange={(e) => setSubject(e.target.value)}

                                    className="w-full border rounded-xl p-4 mt-2"

                                    placeholder="Urgent! Verify your account"

                                />

                            </div>

                            <div className="md:col-span-2">

                                <label className="font-semibold">

                                    Email Body

                                </label>

                                <textarea

                                    rows="10"

                                    value={body}

                                    onChange={(e) => setBody(e.target.value)}

                                    className="w-full border rounded-xl p-4 mt-2"

                                    placeholder="Paste complete email..."

                                />

                            </div>

                        </div>

                        <button

                            onClick={handleAnalyze}

                            className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl flex items-center gap-3"

                        >

                            <FaPaperPlane />

                            {loading ? "Analyzing..." : "Analyze Email"}

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

                                    ScamShield AI is analyzing the email...

                                </p>

                            </div>

                        )}

                        {result && (
                            <>
                                <div className="mt-10">

                                    <div className="grid md:grid-cols-3 gap-6">

                                        <div className="bg-slate-50 rounded-2xl p-6">
                                            <p className="text-gray-500">Threat Score</p>

                                            <h2 className="text-5xl font-black mt-3">
                                                {result.score}/100
                                            </h2>
                                        </div>

                                        <div className="bg-slate-50 rounded-2xl p-6">
                                            <p className="text-gray-500">Threat Level</p>

                                            <div className="mt-4">
                                                {result.level === "SAFE" && (
                                                    <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
                                                        🟢 SAFE
                                                    </span>
                                                )}

                                                {result.level === "SUSPICIOUS" && (
                                                    <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-semibold">
                                                        🟡 SUSPICIOUS
                                                    </span>
                                                )}

                                                {result.level === "DANGEROUS" && (
                                                    <span className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold">
                                                        🔴 DANGEROUS
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 rounded-2xl p-6">
                                            <p className="text-gray-500">Sender</p>

                                            <div className="mt-4 flex items-center gap-3">
                                                <FaUser className="text-blue-600" />
                                                <span className="break-all">{fromEmail}</span>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="mt-8 bg-white border rounded-2xl p-6">
                                        <h3 className="text-2xl font-bold mb-5">
                                            AI Explanation
                                        </h3>

                                        <p className="text-gray-700 leading-8">
                                            {result.explanation}
                                        </p>
                                    </div>

                                    <div className="mt-8 bg-white border rounded-2xl p-6">

                                        <h3 className="text-2xl font-bold mb-5">
                                            Threat Indicators
                                        </h3>

                                        <div className="space-y-3">

                                            {result.reasons?.length > 0 ? (

                                                result.reasons.map((reason, index) => (

                                                    <div
                                                        key={index}
                                                        className="flex gap-3 items-start bg-slate-50 rounded-xl p-4"
                                                    >
                                                        {result.level === "SAFE" ? (
                                                            <FaShieldAlt className="text-green-600 mt-1" />
                                                        ) : (
                                                            <FaEnvelope className="text-red-500 mt-1" />
                                                        )}

                                                        <span>{reason}</span>

                                                    </div>

                                                ))

                                            ) : (

                                                <div className="bg-green-50 rounded-xl p-4 text-green-700">
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
                                                This email appears legitimate. No major phishing indicators were found.
                                            </p>
                                        )}

                                        {result.level === "SUSPICIOUS" && (
                                            <p className="text-yellow-700 leading-8">
                                                Be cautious before clicking any links or downloading attachments.
                                                Verify the sender independently.
                                            </p>
                                        )}

                                        {result.level === "DANGEROUS" && (
                                            <p className="text-red-700 leading-8">
                                                This email shows strong phishing indicators. Do not click links,
                                                download attachments or provide personal information.
                                            </p>
                                        )}

                                    </div>

                                </div>
                            </>
                        )}

                    </div>

                </section>

            </div>

        </>

    );

}

export default EmailAnalyzer;  