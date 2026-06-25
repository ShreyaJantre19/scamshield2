import Navbar from "../components/Navbar";
import { useState } from "react";

import {
    FaFileUpload,
    FaShieldAlt,
    FaFileAlt,
    FaSearch,
    FaCheckCircle,
    FaExclamationTriangle,
} from "react-icons/fa";

import { analyzeFile } from "../services/api";

function FileScanner() {

    const [file, setFile] = useState(null);

    const [loading, setLoading] = useState(false);

    const [result, setResult] = useState(null);

    async function handleScan() {

        if (!file) return;

        setLoading(true);

        setResult(null);

        try {

            const data = await analyzeFile(file);

            setResult(data);

        }

        catch {

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

                        <span className="bg-blue-500 px-4 py-2 rounded-full text-sm font-semibold">

                            AI File Detection

                        </span>

                        <h1 className="text-5xl font-black mt-6 leading-tight">

                            Scan Files
                            <br />
                            Before Opening

                        </h1>

                        <p className="text-blue-100 mt-6 text-lg">

                            Detect malware, viruses and suspicious files
                            using ScamShield AI.

                        </p>

                    </div>

                </section>

                <section className="max-w-6xl mx-auto px-6 -mt-12 pb-20">

                    <div className="bg-white rounded-3xl shadow-xl p-8">

                        <h2 className="text-3xl font-bold mb-8">

                            File Security Scanner

                        </h2>

                        <div className="border-2 border-dashed border-blue-300 rounded-2xl p-12 text-center">

                            <FaFileUpload
                                className="mx-auto text-blue-600 mb-6"
                                size={60}
                            />

                            <input

                                type="file"

                                onChange={(e) => setFile(e.target.files[0])}

                            />

                            {file && (

                                <p className="mt-6 text-lg font-semibold">

                                    {file.name}

                                </p>

                            )}

                        </div>

                        <button

                            onClick={handleScan}

                            disabled={loading}

                            className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3"

                        >

                            <FaSearch />

                            {loading ? "Scanning..." : "Scan File"}

                        </button>

                        {loading && (

                            <div className="mt-8">

                                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">

                                    <div className="w-2/3 h-full bg-blue-600 animate-pulse"></div>

                                </div>

                                <p className="mt-4 text-gray-500">

                                    ScamShield AI is scanning your file...

                                </p>

                            </div>

                        )}

                        {result && (

                            <div className="mt-12">

                                <div className="grid md:grid-cols-3 gap-6">

                                    <div className="bg-slate-50 rounded-2xl p-6">

                                        <p className="text-gray-500">

                                            Risk Score

                                        </p>

                                        <h2 className="text-5xl font-black mt-3 text-blue-600">

                                            {result.risk_score}/100

                                        </h2>

                                    </div>

                                    <div className="bg-slate-50 rounded-2xl p-6">

                                        <p className="text-gray-500">

                                            Status

                                        </p>

                                        <div className="mt-5">

                                            {result.status === "SAFE" && (

                                                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">

                                                    🟢 SAFE

                                                </span>

                                            )}

                                            {result.status === "SUSPICIOUS" && (

                                                <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-bold">

                                                    🟡 SUSPICIOUS

                                                </span>

                                            )}

                                            {result.status === "DANGEROUS" && (

                                                <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-bold">

                                                    🔴 DANGEROUS

                                                </span>

                                            )}

                                        </div>

                                    </div>

                                    <div className="bg-slate-50 rounded-2xl p-6">

                                        <p className="text-gray-500">

                                            File Name

                                        </p>

                                        <div className="flex items-center gap-3 mt-5">

                                            <FaFileAlt className="text-blue-600 text-2xl" />

                                            <span className="font-semibold break-all">

                                                {result.filename}

                                            </span>

                                        </div>

                                    </div>

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

                                                    {result.status === "SAFE"

                                                        ? <FaCheckCircle className="text-green-600 mt-1" />

                                                        : <FaExclamationTriangle className="text-red-500 mt-1" />}

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

                                <div className="mt-8 bg-white border rounded-2xl p-6 shadow">

                                    <h3 className="text-2xl font-bold mb-5">

                                        AI Recommendation

                                    </h3>

                                    {result.status === "SAFE" && (

                                        <p className="text-green-700 leading-8">

                                            This file appears safe. No malware indicators were detected.

                                        </p>

                                    )}

                                    {result.status === "SUSPICIOUS" && (

                                        <p className="text-yellow-700 leading-8">

                                            This file contains suspicious characteristics. Scan it again or verify its source before opening.

                                        </p>

                                    )}

                                    {result.status === "DANGEROUS" && (

                                        <p className="text-red-700 leading-8">

                                            This file may contain malware. Do not open or execute it.

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

export default FileScanner; 