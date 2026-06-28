# pyrefly: ignore [missing-import]
import requests

API_KEY = "YOUR_VIRUSTOTAL_API_KEY"


def check_url_virustotal(url):

    try:

        endpoint = "https://www.virustotal.com/api/v3/urls"

        headers = {

            "x-apikey": API_KEY

        }

        response = requests.post(

            endpoint,

            headers=headers,

            data={"url": url}

        )

        data = response.json()

        analysis_id = data["data"]["id"]

        report_url = (

            "https://www.virustotal.com/api/v3/analyses/"

            + analysis_id

        )

        report = requests.get(

            report_url,

            headers=headers

        ).json()

        stats = report["data"]["attributes"]["stats"]

        malicious = stats["malicious"]

        suspicious = stats["suspicious"]

        return {

            "malicious": malicious,

            "suspicious": suspicious

        }

    except:

        return {

            "malicious": None,

            "suspicious": None

        } 