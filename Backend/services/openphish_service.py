import requests


def check_openphish(url):

    try:

        feed = requests.get(

            "https://openphish.com/feed.txt"

        ).text

        if url in feed:

            return True

        return False

    except:

        return False 