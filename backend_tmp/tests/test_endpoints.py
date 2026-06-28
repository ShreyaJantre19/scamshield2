import os
import sys
import unittest
from fastapi.testclient import TestClient

from Backend.app import app
from Backend.database.database import SessionLocal
from Backend.models.scan import Scan


class TestIntegrationEndpoints(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_url_analyze_route(self):
        # A URL designed to be high-risk (Dangerous >= 60)
        payload = {"url": "http://verify-login-bank-wallet-password-otp-reward-gift.xyz"}
        response = self.client.post("/api/scan/url", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("score", data)
        self.assertIn("level", data)
        self.assertEqual(data["level"], "DANGEROUS")
        
        # Verify db entry
        db = SessionLocal()
        try:
            db_entry = db.query(Scan).filter(Scan.scan_type == "URL", Scan.input_data == payload["url"]).order_by(Scan.id.desc()).first()
            self.assertIsNotNone(db_entry)
            self.assertEqual(db_entry.status, "DANGEROUS")
        finally:
            db.close()

    def test_email_analyze_route(self):
        payload = {
            "from_email": "alert@netflix-billing-update.com",
            "reply_to": "alert@netflix-billing-update.com",
            "subject": "Important Account Update Required",
            "body": "Please login to your account immediately to update credit card details."
        }
        response = self.client.post("/api/scan/email", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("score", data)
        self.assertIn("level", data)
        self.assertEqual(data["level"], "DANGEROUS")

        # Verify db entry
        db = SessionLocal()
        try:
            db_entry = db.query(Scan).filter(
                Scan.scan_type == "EMAIL",
                Scan.input_data.contains("alert@netflix-billing-update.com")
            ).order_by(Scan.id.desc()).first()
            self.assertIsNotNone(db_entry)
            self.assertEqual(db_entry.status, "DANGEROUS")
        finally:
            db.close()

    def test_file_analyze_route(self):
        # Create a mock file (double extension and key words)
        file_content = b"MZ\x00\x00\x00\x00\x00\x00 (fake executable)"
        files = {"file": ("invoice.pdf.exe", file_content, "application/octet-stream")}
        response = self.client.post("/api/file/analyze", files=files)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("risk_score", data)
        self.assertEqual(data["status"], "SUSPICIOUS")

        # Verify db entry
        db = SessionLocal()
        try:
            db_entry = db.query(Scan).filter(Scan.scan_type == "FILE", Scan.input_data == "invoice.pdf.exe").order_by(Scan.id.desc()).first()
            self.assertIsNotNone(db_entry)
            self.assertEqual(db_entry.status, "SUSPICIOUS")
        finally:
            db.close()

    def test_qr_analyze_route(self):
        payload = {"qr_data": "upi://pay?pa=test@upi"}
        response = self.client.post("/api/scan/qr", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("score", data)
        self.assertEqual(data["level"], "SAFE")


if __name__ == "__main__":
    unittest.main()
