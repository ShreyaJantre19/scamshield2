import os
import sys
import unittest
from fastapi.testclient import TestClient

# Add parent directory to sys.path so we can import app
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app
from database.database import SessionLocal
from models.scan import Scan


class TestIntegrationEndpoints(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_url_analyze_route(self):
        # A URL designed to be high-risk (Dangerous >= 60)
        payload = {"url": "http://verify-login-bank-wallet-password-otp-reward-gift.xyz"}
        response = self.client.post("/api/url/analyze", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("score", data)
        self.assertIn("status", data)
        self.assertEqual(data["status"], "Dangerous")
        
        # Verify db entry
        db = SessionLocal()
        try:
            db_entry = db.query(Scan).filter(Scan.scan_type == "URL", Scan.input_data == payload["url"]).order_by(Scan.id.desc()).first()
            self.assertIsNotNone(db_entry)
            self.assertEqual(db_entry.status, "Dangerous")
        finally:
            db.close()

    def test_email_analyze_route(self):
        payload = {
            "sender": '"Netflix Support" <alert@netflix-billing-update.com>',
            "subject": "Important Account Update Required",
            "body": "Please login to your account immediately to update credit card details."
        }
        response = self.client.post("/email/analyze", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("risk_score", data)
        self.assertIn("verdict", data)
        self.assertEqual(data["verdict"], "Dangerous")
        self.assertTrue(data["parameters"]["display_name_mismatch"]["mismatch_detected"])

        # Verify db entry
        db = SessionLocal()
        try:
            db_entry = db.query(Scan).filter(
                Scan.scan_type == "EMAIL",
                Scan.input_data.contains("Netflix Support")
            ).order_by(Scan.id.desc()).first()
            self.assertIsNotNone(db_entry)
            self.assertEqual(db_entry.status, "Dangerous")
        finally:
            db.close()

    def test_file_analyze_route(self):
        # Create a mock file (double extension and key words)
        file_content = b"MZ\x00\x00\x00\x00\x00\x00 (fake executable)"
        files = {"file": ("invoice.pdf.exe", file_content, "application/octet-stream")}
        response = self.client.post("/api/file/analyze", files=files)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("score", data)
        self.assertEqual(data["status"], "Dangerous")
        self.assertTrue(data["parameters"]["double_extension"]["has_double_extension"])
        self.assertFalse(data["parameters"]["mime_type"]["mismatch_detected"])

        # Verify db entry
        db = SessionLocal()
        try:
            db_entry = db.query(Scan).filter(Scan.scan_type == "FILE", Scan.input_data == "invoice.pdf.exe").order_by(Scan.id.desc()).first()
            self.assertIsNotNone(db_entry)
            self.assertEqual(db_entry.status, "Dangerous")
        finally:
            db.close()

    def test_qr_analyze_route_no_qr(self):
        # Post a simple non-image file, should raise 400 or raise error for no QR
        file_content = b"not an image"
        files = {"file": ("test.png", file_content, "image/png")}
        response = self.client.post("/api/qr/analyze", files=files)
        # It should return 400 since it can't decode it as a QR image
        self.assertEqual(response.status_code, 400)


if __name__ == "__main__":
    unittest.main()
