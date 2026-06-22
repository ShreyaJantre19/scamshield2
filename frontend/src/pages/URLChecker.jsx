import { useState } from "react";

function URLChecker() {

    const [url, setUrl] = useState("");

    const [loading, setLoading] = useState(false);

    const [result, setResult] = useState(null);


    async function handleScan() {

        if (!url) return;

        setLoading(true);

        setResult(null);

        try {

            const response = await fetch(

                "http://127.0.0.1:8000/scan/url",

                {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify({

                        url: url

                    })

                }

            );

            const data = await response.json();

            setResult(data);

        }

        catch {

            alert("Cannot connect to backend");

        }

        setLoading(false);

    }


    return (

        <div style={{

            padding: "30px"

        }}>

            <h1>

                URL Checker

            </h1>


            <input

                type="text"

                placeholder="Enter URL"

                value={url}

                onChange={(e) =>

                    setUrl(e.target.value)

                }

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

                {

                    loading

                        ?

                        "Scanning..."

                        :

                        "Scan URL"

                }

            </button>


            {

                result &&

                (

                    <div

                        style={{

                            marginTop: "40px"

                        }}

                    >

                        <h2>

                            Threat Level :

                            {" "}

                            {result.level}

                        </h2>


                        <h3>

                            Risk Score :

                            {" "}

                            {result.score}/100

                        </h3>


                        <h3>

                            Domain Age :

                            {" "}

                            {

                                result.domain_age

                            }

                            days

                        </h3>


                        <h3>

                            Threat Indicators

                        </h3>


                        <ul>

                            {

                                result.reasons?.map(

                                    (

                                        reason,

                                        index

                                    ) => (

                                        <li

                                            key={index}

                                        >

                                            {

                                                reason

                                            }

                                        </li>

                                    )

                                )

                            }

                        </ul>


                        <h3>

                            AI Explanation

                        </h3>

                        <p>

                            {

                                result.explanation

                            }

                        </p>

                    </div>

                )

            }

        </div>

    );

}

export default URLChecker; 