# pyrefly: ignore [missing-import]
import socket
import ssl
from datetime import datetime


def check_ssl(domain):

    try:

        domain = (
            domain.replace("https://", "")
                  .replace("http://", "")
                  .split("/")[0]
        )

        context = ssl.create_default_context()

        with socket.create_connection((domain, 443)) as sock:

            with context.wrap_socket(
                sock,
                server_hostname=domain
            ) as secure_sock:

                cert = secure_sock.getpeercert()

        issuer = dict(
            x[0]
            for x in cert["issuer"]
        )

        expiry = datetime.strptime(
            cert["notAfter"],
            "%b %d %H:%M:%S %Y %Z"
        )

        days_left = (
            expiry -
            datetime.now()
        ).days

        return {

            "valid": True,

            "issuer":
            issuer.get(
                "organizationName",
                "Unknown"
            ),

            "expiry_days":
            days_left

        }

    except Exception:

        return {

            "valid": False,

            "issuer": None,

            "expiry_days": None

        } 