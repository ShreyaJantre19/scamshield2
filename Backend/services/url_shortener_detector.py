SHORTENERS = [

    "bit.ly",

    "tinyurl.com",

    "t.co",

    "goo.gl",

    "rb.gy",

    "cutt.ly",

    "shorturl.at"

]


def detect_shortener(url):

    for shortener in SHORTENERS:

        if shortener in url.lower():

            return {

                "detected": True,

                "service": shortener

            }

    return {

        "detected": False,

        "service": None

    } 