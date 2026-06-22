import { useState } from "react";

function EmailAnalyzer() {

    const [fromEmail, setFromEmail] = useState("");
    const [replyTo, setReplyTo] = useState("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");

    const [result, setResult] = useState(null);

    async function handleAnalyze() {

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

            alert("Cannot connect to backend");

        }

    }

    return (

        <div style={{ padding: "30px" }}>

            <h1>Email Analyzer</h1>

            <input
                placeholder="From Email"
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
                style={{ width: "100%", padding: "15px", marginTop: "20px" }}
            />

            <input
                placeholder="Reply-To"
                value={replyTo}
                onChange={(e) => setReplyTo(e.target.value)}
                style={{ width: "100%", padding: "15px", marginTop: "20px" }}
            />

            <input
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{ width: "100%", padding: "15px", marginTop: "20px" }}
            />

            <textarea
                rows="8"
                placeholder="Email Body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                style={{
                    width: "100%",
                    padding: "15px",
                    marginTop: "20px"
                }}
            />

            <button
                onClick={handleAnalyze}
                style={{
                    marginTop: "20px",
                    padding: "15px"
                }}
            >
                Analyze Email
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

export default EmailAnalyzer; 