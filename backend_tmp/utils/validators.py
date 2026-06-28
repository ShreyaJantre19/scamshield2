from urllib.parse import urlparse

def validate_url(url):

    parsed = urlparse(url)

    if not parsed.scheme:
        return False

    if not parsed.netloc:
        return False

    return True