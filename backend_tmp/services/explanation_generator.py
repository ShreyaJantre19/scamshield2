def generate_explanation(

        score,

        reasons

):

    if score < 30:

        return (

            "No significant threats detected."

        )

    if score < 60:

        return (

            "Several suspicious indicators were found."

        )

    return (

        "Multiple phishing indicators detected. Avoid interacting with this resource."
    ) 