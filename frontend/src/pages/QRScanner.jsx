import { useState } from "react";

function QRScanner() {

    const [qrData, setQrData] = useState("");

    const [result, setResult] = useState(null);

    async function handleScan() {

        try {

            const response = await fetch(

                "http://127.0.0.1:8000/scan/qr",

                {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify({

                        qr_data: qrData

                    })

                }

            );

            const data = await response.json();

            setResult(data);

        }

        catch {

            alert("Cannot connect to backend");

        }

    }

    return (

        <div style={{ padding: "30px" }}>

            <h1>QR Scanner</h1>

            <input

                type="text"

                placeholder="Paste QR code URL or content"

                value={qrData}

                onChange={(e) => setQrData(e.target.value)}

                style={{

                    width: "100%",

                    padding: "15px",

                    marginTop: "20px"

                }}

            />

            <button

                onClick={handleScan}

                style={{

                    marginTop: "20px",

                    padding: "15px"

                }}

            >

                Analyze QR

            </button>

            {

                result && (

                    <div style={{ marginTop: "40px" }}>

                        <h2>

                            Threat Level : {result.level}

                        </h2>

                        <h3>

                            Risk Score : {result.score}/100

                        </h3>

                        <h3>

                            Threat Indicators

                        </h3>

                        <ul>

                            {

                                result.reasons?.map(

                                    (reason, index) => (

                                        <li key={index}>

                                            {reason}

                                        </li>

                                    )

                                )

                            }

                        </ul>

                        <h3>

                            AI Explanation

                        </h3>

                        <p>

                            {result.explanation}

                        </p>

                    </div>

                )

            }

        </div>

    );

}

export default QRScanner; 