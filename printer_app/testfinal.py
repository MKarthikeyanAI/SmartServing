import unittest
from app import app

class TestReceiptPrinting(unittest.TestCase):

    def setUp(self):
        # Set up the Flask test client
        self.app = app.test_client()
        self.app.testing = True

    def test_print_receipt(self):
        # Send a GET request to the /print_receipt endpoint
        response = self.app.get('/print_receipt')

        # Check if the response is successful (HTTP 200)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Receipt printed successfully!', response.data)

    def test_printer_not_found(self):
        # Test the case when the printer is not found
        # You can simulate this by providing an invalid ID in the app.py or unplugging the printer
        response = self.app.get('/print_receipt')
        self.assertEqual(response.status_code, 404)
        self.assertIn(b'Printer not found!', response.data)

if __name__ == '__main__':
    unittest.main()
