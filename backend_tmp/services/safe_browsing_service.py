# pyrefly: ignore [missing-import]
import requests

API_KEY = "AIzaSyBiBxflBPb3Xf5u1o6usE8EQx5WG_lbMso"


def check_safe_browsing(url):

    endpoint = (

        "https://safebrowsing.googleapis.com/v4/threatMatches:find"

        f"?key={API_KEY}"

    )

    payload = {

        "client": {

            "clientId": "ScamShieldAI",

            "clientVersion": "1.0"

        },

        "threatInfo": {

            "threatTypes": [

                "MALWARE",

                "SOCIAL_ENGINEERING"

            ],

            "platformTypes": [

                "ANY_PLATFORM"

            ],

            "threatEntryTypes": [

                "URL"

            ],

            "threatEntries": [

                {

                    "url": url

                }

            ]

        }

    }

    try:

        response = requests.post(

            endpoint,

            json=payload

        )

        result = response.json()

        return result

    except:

        return {} 