import { useState } from "react";

function ReportScam() {

    const [details, setDetails] = useState("");

    return (
        <div style={{ padding: "30px" }}>

            <h1>Report Scam</h1>

            <textarea
                rows="8"
                placeholder="Describe the scam..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                style={{
                    width: "100%",
                    padding: "15px"
                }}
            />

            <button
                style={{
                    marginTop: "20px",
                    padding: "15px"
                }}
            >
                Submit Report
            </button>

        </div>
    );
}

export default ReportScam; 
