import unittest
import os
import tempfile
import zipfile

from Backend.services.url_service import analyze_url
from Backend.services.email_service import analyze_email, parse_sender, extract_urls
from Backend.services.qr_service import analyze_qr_risks, detect_qr_type, parse_mailto, parse_wifi
from Backend.services.file_service import analyze_file


class TestURLAnalyzer(unittest.TestCase):
    def test_safe_url(self):
        res = analyze_url("https://www.google.com")
        self.assertLess(res["score"], 30)
        self.assertEqual(res["status"], "low_risk")

    def test_dangerous_url(self):
        # Suspicious TLD + keyword + hyphen
        res = analyze_url("http://login-verify-bank.xyz")
        self.assertGreaterEqual(res["score"], 30)


class TestEmailAnalyzer(unittest.TestCase):
    def test_parse_sender(self):
        disp, email = parse_sender('"PayPal Service" <support@paypal-security.com>')
        self.assertEqual(disp, "PayPal Service")
        self.assertEqual(email, "support@paypal-security.com")

        disp2, email2 = parse_sender("hacker@badstuff.com")
        self.assertEqual(disp2, "")
        self.assertEqual(email2, "hacker@badstuff.com")

    def test_extract_urls(self):
        text = "Hello check this http://example.com/login and https://secure-bank.net/update"
        urls = extract_urls(text)
        self.assertIn("http://example.com/login", urls)
        self.assertIn("https://secure-bank.net/update", urls)

    def test_display_name_mismatch(self):
        # Brand in display name, but domain is gmail
        res = analyze_email(
            sender='"PayPal Customer Support" <attacker123@gmail.com>',
            subject="Security Alert",
            body="Please verify your account immediately!"
        )
        self.assertEqual(res["verdict"], "Dangerous")
        self.assertTrue(res["parameters"]["display_name_mismatch"]["mismatch_detected"])

    def test_email_typosquatting(self):
        # Typosquatted sender domain
        res = analyze_email(
            sender="support@paypa1.com",
            subject="Invoice details",
            body="See attached payment details."
        )
        self.assertTrue(res["parameters"]["typosquatting"]["detected"])


class TestQRAnalyzer(unittest.TestCase):
    def test_detect_qr_type(self):
        self.assertEqual(detect_qr_type("https://google.com"), "URL")
        self.assertEqual(detect_qr_type("tel:1234567890"), "PHONE")
        self.assertEqual(detect_qr_type("sms:12345?body=hello"), "SMS")
        self.assertEqual(detect_qr_type("mailto:test@example.com"), "EMAIL")
        self.assertEqual(detect_qr_type("WIFI:S:MyNet;P:password;;"), "WIFI")
        self.assertEqual(detect_qr_type("upi://pay?pa=test@upi"), "UPI")

    def test_wifi_parsing(self):
        parsed = parse_wifi("WIFI:T:WPA;S:HomeNetwork;P:mySuperPassword;H:false;;")
        self.assertEqual(parsed["S"], "HomeNetwork")
        self.assertEqual(parsed["T"], "WPA")
        self.assertEqual(parsed["P"], "mySuperPassword")

    def test_wifi_risks_nopass(self):
        res = analyze_qr_risks("WIFI", "WIFI:T:nopass;S:FreePublicWifi;;")
        self.assertEqual(res["status"], "Suspicious")
        self.assertTrue(any("Unsecured" in r for r in res["reasons"]))

    def test_upi_risks_high_amount(self):
        res = analyze_qr_risks("UPI", "upi://pay?pa=merchant@okaxis&pn=MerchantName&am=2500")
        self.assertTrue(any("High payment request" in r for r in res["reasons"]))


class TestFileAnalyzer(unittest.TestCase):
    def setUp(self):
        self.temp_files = []

    def tearDown(self):
        for path in self.temp_files:
            if os.path.exists(path):
                try:
                    os.remove(path)
                except Exception:
                    pass

    def create_temp_file(self, content: bytes, suffix: str = ".txt") -> str:
        fd, path = tempfile.mkstemp(suffix=suffix)
        os.close(fd)
        with open(path, "wb") as f:
            f.write(content)
        self.temp_files.append(path)
        return path

    def test_executable_extension(self):
        path = self.create_temp_file(b"MZtest", suffix=".exe")
        res = analyze_file("malware.exe", path)
        self.assertTrue(res["parameters"]["file_extension"]["is_executable"])
        self.assertGreaterEqual(res["score"], 40)

    def test_double_extension(self):
        path = self.create_temp_file(b"MZtest", suffix=".exe")
        res = analyze_file("invoice.pdf.exe", path)
        self.assertTrue(res["parameters"]["double_extension"]["has_double_extension"])
        self.assertEqual(res["parameters"]["double_extension"]["detected"], ".pdf.exe")

    def test_signature_mismatch(self):
        # PDF extension but starts with MZ (executable)
        path = self.create_temp_file(b"MZ123456789", suffix=".pdf")
        res = analyze_file("report.pdf", path)
        self.assertTrue(res["parameters"]["mime_type"]["mismatch_detected"])
        self.assertEqual(res["parameters"]["mime_type"]["detected_magic_format"], "pe_executable")

    def test_pdf_active_content(self):
        path = self.create_temp_file(b"%PDF-1.4\n/JS (app.alert('hello'))\n/JavaScript\n/OpenAction", suffix=".pdf")
        res = analyze_file("clean.pdf", path)
        self.assertTrue(res["parameters"]["pdf_indicators"]["is_pdf"])
        self.assertIn("JavaScript", res["parameters"]["pdf_indicators"]["active_indicators"])


if __name__ == "__main__":
    unittest.main()
