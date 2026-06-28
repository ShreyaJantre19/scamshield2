# pyrefly: ignore [missing-import]
import requests


def check_redirects(url):

    try:

        response = requests.get(
            url,
            allow_redirects=True,
            timeout=10
        )

        history = response.history

        redirects = len(history)

        final_url = response.url

        return {

            "redirect_count": redirects,

            "final_url": final_url

        }

    except:

        return {

            "redirect_count": None,

            "final_url": None

        } 