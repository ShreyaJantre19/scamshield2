import requests


def check_phishtank(url):

    try:

        response = requests.post(

            "https://checkurl.phishtank.com/checkurl/",

            data={

                "url": url,

                "format": "json"

            }

        )

        return response.json()

    except:

        return {} 