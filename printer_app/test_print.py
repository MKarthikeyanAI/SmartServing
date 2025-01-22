import requests

# Define the URL for the local Flask app
url = "http://localhost:5000/api/print"

# Sample data to send
sample_data = {
    "table": "5",
    "order_time": "2025-01-22 18:45",
    "items": [
        {"name": "Chicken Curry", "quantity": 2, "price": "12.50"},
        {"name": "Naan Bread", "quantity": 4, "price": "8.00"},
        {"name": "Mango Lassi", "quantity": 1, "price": "3.50"}
    ],
    "total": "24.00"
}

# Send the POST request with the sample data
response = requests.post(url, json=sample_data)

# Print the response from the server
print(response.status_code)
print(response.json())
