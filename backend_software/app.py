from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
import uuid 
import io
import base64
import qrcode
import pytz
from datetime import datetime
import os
from bson.objectid import ObjectId 
from flask_socketio import SocketIO
import usb.core
import usb.util
import usb.backend.libusb1
import time


# Replace with your libusb.dll path if required (for Windows)
# LIBUSB_DLL_PATH = r"C:\Users\mkart\Dropbox\PC\Downloads\libusb-1.0.27\VS2017\MS32\dll\libusb-1.0.dll"


# Initialize app
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")
# MongoDB configuration
app.config["MONGO_URI"] = "mongodb+srv://7708307520karthi:7708307520karthi@cluster0.jtruf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
mongo = PyMongo(app)

# ESC/POS Commands
ESC = b'\x1B'
RESET_PRINTER = ESC + b'@'  # Initialize printer
CUT_PAPER = ESC + b'\n\x1d\x56\x01'
ALIGN_CENTER = ESC + b'a\x01'  # Align center
ALIGN_LEFT = ESC + b'a\x00'  # Align left

# Register routes
# app.register_blueprint(qr_code_routes, url_prefix='/api/qrcodes')


@app.route('/api/dashboard/<restaurant_name>', methods=['GET'])
def get_dashboard_data(restaurant_name):

    # Access the specific database for the restaurant
    db = mongo.cx[restaurant_name]  # Access the specific database by name
    # Access the collection for orders of the specific restaurant
    orders_collection = db.orders  # Assuming collection is named 'orders' inside restaurant database

    # Fetch all orders
    orders = list(orders_collection.find())

    print("orders:")
    print(orders)

    # Calculate the total orders, pending, processing, and completed orders
    
    total_orders = len(orders)
    print(total_orders)
    pending_orders = len([order for order in orders if order['status'] == 'Pending'])
    processing_orders = len([order for order in orders if order['status'] == 'Processing'])
    completed_orders = len([order for order in orders if order['status'] == 'Food Delivered'])  # Or use 'Completed'


    return jsonify({
        'totalOrders': total_orders,
        'pendingOrders': pending_orders,
        'processingOrders': processing_orders,
        'completedOrders': completed_orders,
    })


def print_receipt(order_data):
    # Validate order data
    restaurant_name = order_data.get("restaurant_name")
    if not restaurant_name:
        return {"status": "error", "message": "Restaurant name not provided"}

    # Access the specific database for the restaurant
    db = mongo.cx[restaurant_name]

    # Fetch printer details
    printer_details = db.printerdetails.find_one({"restaurant_name": restaurant_name})
    if not printer_details:
        return {"status": "error", "message": f"Printer details not found for restaurant: {restaurant_name}"}

    # Extract printer details
    LIBUSB_DLL_PATH = printer_details.get("path")
    if not LIBUSB_DLL_PATH:
        return {"status": "error", "message": "Printer DLL path not provided"}

    vendorid = printer_details.get("vendorid")
    productid = printer_details.get("productid")

    if not vendorid or not productid:
        return {"status": "error", "message": "Printer vendor ID or product ID not provided"}

    try:
        # Convert vendor ID and product ID to integers
        idVendor = int(vendorid, 16)  # Convert from hex string (e.g., "0x1234")
        idProduct = int(productid, 16)

        # Initialize the USB backend
        backend = usb.backend.libusb1.get_backend(find_library=lambda x: LIBUSB_DLL_PATH)

        # Find the USB printer device
        device = usb.core.find(idVendor=idVendor, idProduct=idProduct, backend=backend)
        if device is None:
            return {"status": "error", "message": "Printer not found"}

        # Detach kernel driver if necessary
        try:
            if device.is_kernel_driver_active(0):
                device.detach_kernel_driver(0)
        except (usb.core.USBError, NotImplementedError):
            pass

        # Set configuration
        device.set_configuration()

        # Format receipt data
        receipt_data = (
            RESET_PRINTER +
            ALIGN_CENTER + f"** {order_data.get('username', 'Customer')} **\n".encode() +
            ALIGN_LEFT +
            f"Mobile: {order_data.get('mobile_number', 'N/A')}\n".encode() +
            f"Table: {order_data.get('table_name', 'N/A')}\n".encode() +
            f"Order ID: {order_data.get('order_id', 'N/A')}\n".encode() +
            f"Date: {order_data.get('timestamp', 'N/A')}\n".encode() +
            b"-----------------------------\n" +
            b"Item                  Qty   Price\n"
        )

        for item in order_data.get('order', []):
            name = item.get('name', 'N/A')
            qty = item.get('quantity', 0)
            price = float(item.get('price', 0.00))
            line = f"{name:<20} {qty:<5} ${price:.2f}\n"
            receipt_data += line.encode()

        total = sum(float(item.get('price', 0.00)) * item.get('quantity', 0) for item in order_data.get('order', []))
        receipt_data += b"-----------------------------\n"
        receipt_data += f"Total:                 ${total:.2f}\n".encode()
        receipt_data += b"Thank you!\n"

        # Send receipt data
        endpoint_out = 0x01  # Modify this based on your printer's endpoint
        device.write(endpoint_out, receipt_data)

        # Wait for printing to complete
        time.sleep(1)

        # Cut paper
        device.write(endpoint_out, CUT_PAPER)

        return {"status": "success", "message": "Receipt printed successfully"}

    except usb.core.USBError as e:
        return {"status": "error", "message": f"USB Error: {str(e)}"}

    finally:
        # Release the device
        usb.util.dispose_resources(device)


@app.route('/<restaurant_name>/print-receipt', methods=['POST'])
def handle_print_receipt(restaurant_name):
    """API endpoint to handle receipt printing."""
    data = request.get_json()

    # Validate order data
    if not data or not data.get('order'):
        return jsonify({"status": "error", "message": "Invalid order data"}), 400
    
    print("INVALID OUT")

    # Add restaurant name to the order data
    data["restaurant_name"] = restaurant_name

    # Print the receipt
    result = print_receipt(data)

    print(result)

    return jsonify(result), 200 if result["status"] == "success" else 500



@app.route('/restaurant-details/<restaurant_name>', methods=['GET'])
def check_restaurant_details(restaurant_name):
    db = mongo.cx[restaurant_name]  # Access the specific database by name

    # Check if 'restaurantdetails' collection exists in the database
    if 'restaurantdetails' in db.list_collection_names():  
        # Fetch the first document in the collection
        details = db.restaurantdetails.find_one()  # Returns the first document found

        if details:
            details['_id'] = str(details['_id'])  # Convert ObjectId to string for JSON response
            return jsonify(details), 200  # Return the document
        else:
            return jsonify({'message': 'No restaurant details found'}), 404  # No document found in the collection
    else:
        return jsonify({'message': 'no_collection'}), 404  # Return 'no_collection' if the collection does not exist


@app.route('/restaurant-details/<restaurant_name>', methods=['POST'])
def create_restaurant_details(restaurant_name):
    db = mongo.cx[restaurant_name]  # Access the specific database by name

    # Check if the 'restaurantdetails' collection exists
    if 'restaurantdetails' not in db.list_collection_names():
        # Create the collection if it doesn't exist
        db.create_collection('restaurantdetails')

    # Get the details from the request body
    details = request.get_json()

    # Insert the new restaurant details into the collection
    result = db.restaurantdetails.insert_one(details)

    # Return the inserted document with the new ObjectId
    details['_id'] = str(result.inserted_id)  # Convert ObjectId to string for response
    return jsonify(details), 201  # Return the details with 201 Created status



@app.route('/qrcodes/<restaurant_name>/<table_name>', methods=['DELETE'])
def delete_qr_code_by_table_name(restaurant_name, table_name):
    db = mongo.cx[restaurant_name]
    result = db.qrcodescanner.delete_one({'table_name': table_name})
    if result.deleted_count == 1:
        return jsonify({'message': 'QR code deleted successfully'}), 200
    else:
        return jsonify({'message': 'QR code not found'}), 404


@app.route('/qrcodes/<restaurant_name>', methods=['GET'])
def get_qr_codes(restaurant_name):
    db = mongo.cx[restaurant_name]
    qr_codes = db.qrcodescanner.find()
    qr_codes_list = list(qr_codes)
    for qr_code in qr_codes_list:
        qr_code['_id'] = str(qr_code['_id'])  # Convert ObjectId to string
    return jsonify(qr_codes_list)


@app.route('/create-qrcode-scanner/<restaurant_name>', methods=['POST'])
def create_qrcode_scanner(restaurant_name):
    data = request.json
    table_name = data.get('tableName')
    restaurant_name = data.get('restaurantName')

    if not table_name:
        return jsonify({"error": "Table name is required!"}), 400

    # Generate QR code

    # Generate the link to be embedded in the QR code
    qr_data = f"https://www.smart-serving.com/{restaurant_name}/menu_items/{table_name}"

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(qr_data)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)
    img_base64 = base64.b64encode(img_byte_arr.read()).decode('utf-8')

    # Store in MongoDB
    db = mongo.cx[restaurant_name]
    qr_code_data = {
        "table_name": table_name,
        "restaurant_name": restaurant_name,
        "qr_code_image": img_base64,
        "qr_code_link": qr_data
    }

    result = db.qrcodescanner.insert_one(qr_code_data)
    
    # Convert ObjectId to string for JSON serialization
    qr_code_data["_id"] = str(result.inserted_id)

    return jsonify({"message": "QR code scanner created successfully!", "qr_code_data": qr_code_data}), 201


@app.route('/get-restaurants', methods=['GET'])
def get_restaurants():
    # List all databases excluding default system databases
    database_names = [db for db in mongo.cx.list_database_names() if db not in ['admin', 'local', 'config']]
    return jsonify({"restaurants": database_names})

@app.route('/get-restaurant-details/<restaurant_name>', methods=['GET'])
def get_restaurant_details(restaurant_name):
    db = mongo.cx[restaurant_name]
    credentials = db.credentials.find_one({}, {'_id': 0})
    menu_items = list(db.menuitems.find({}, {'_id': 0}))
    return jsonify({"credentials": credentials, "menu_items": menu_items})

@app.route('/create-restaurant', methods=['POST'])
def create_restaurant():
    data = request.json
    restaurant_name = data.get('restaurant_name')
    username = data.get('username')
    password = data.get('password')
    
    if not restaurant_name or not username or not password:
        return jsonify({"error": "Missing required fields"}), 400
    
    # Create a new database for the restaurant
    db = mongo.cx[restaurant_name]
    db.credentials.insert_one({"username": username, "password": password})
    return jsonify({"message": f"Restaurant '{restaurant_name}' created successfully!"})


@app.route('/add-menu-item/<restaurant_name>', methods=['POST'])
def add_menu_item(restaurant_name):
    data = request.json
    required_fields = ['name', 'price', 'category', 'image_url']

    # Validate required fields
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    # Set default stock value to 'yes' if not provided or empty
    stock_value = data.get('stock', 'yes').strip() or 'yes'

    db = mongo.cx[restaurant_name]

    # Generate a unique UUID for the menu item
    unique_id = str(uuid.uuid4())

    # Create the menu item dictionary
    menu_item = {
        "unique_id": unique_id,
        "name": data['name'],
        "price": data['price'],
        "category": data['category'],
        "image_url": data['image_url'],
        "stock": stock_value,
    }

    # Insert the new menu item
    result = db.menuitems.insert_one(menu_item)
    menu_item['_id'] = str(result.inserted_id)  # Convert ObjectId to string

    return jsonify({"message": "Menu item added successfully!", "item": menu_item}), 201

# @app.route('/add-menu-item/<restaurant_name>', methods=['POST'])
# def add_menu_item(restaurant_name):
#     data = request.json
#     required_fields = ['name', 'price', 'category', 'subcategory']

#     # Validate required fields
#     if not all(field in data for field in required_fields):
#         return jsonify({"error": "Missing required fields"}), 400

#     db = mongo.cx[restaurant_name]

#     # Generate a unique UUID for the menu item
#     unique_id = str(uuid.uuid4())

#     menu_item = {
#         "unique_id": unique_id,
#         "name": data['name'],
#         "price": data['price'],
#         "category": data['category'],
#         "subcategory": data['subcategory']
#     }

#     # Insert the new menu item
#     result = db.menuitems.insert_one(menu_item)
#     menu_item['_id'] = str(result.inserted_id)  # Convert ObjectId to string

#     return jsonify({"message": "Menu item added successfully!", "item": menu_item}), 201


@app.route('/update-menu-item/<restaurant_name>/<unique_id>', methods=['PUT'])
def update_menu_item(restaurant_name, unique_id):
    data = request.json
    required_fields = ['name', 'price', 'category', 'image_url']

    # Validate required fields
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    db = mongo.cx[restaurant_name]
    menu_item = {
        "name": data['name'],
        "price": data['price'],
        "category": data['category'],
        "image_url": data['image_url']
    }

    # Update the menu item in the database using unique_id
    result = db.menuitems.update_one(
        {"unique_id": unique_id},
        {"$set": menu_item}
    )

    if result.matched_count > 0:
        return jsonify({"message": "Menu item updated successfully!"})
    return jsonify({"error": "Menu item not found"}), 404

# @app.route('/update-menu-item/<restaurant_name>/<unique_id>', methods=['PUT'])
# def update_menu_item(restaurant_name, unique_id):
#     data = request.json
#     required_fields = ['name', 'price', 'category', 'subcategory']

#     # Validate required fields
#     if not all(field in data for field in required_fields):
#         return jsonify({"error": "Missing required fields"}), 400

#     db = mongo.cx[restaurant_name]
#     menu_item = {
#         "name": data['name'],
#         "price": data['price'],
#         "category": data['category'],
#         "subcategory": data['subcategory']
#     }

#     # Update the menu item in the database using unique_id
#     result = db.menuitems.update_one(
#         {"unique_id": unique_id},
#         {"$set": menu_item}
#     )

#     if result.matched_count > 0:
#         return jsonify({"message": "Menu item updated successfully!"})
#     return jsonify({"error": "Menu item not found"}), 404


@app.route('/delete-menu-item/<restaurant_name>/<unique_id>', methods=['DELETE'])
def delete_menu_item(restaurant_name, unique_id):
    db = mongo.cx[restaurant_name]

    # Delete the menu item using the unique_id
    result = db.menuitems.delete_one({"unique_id": unique_id})

    if result.deleted_count > 0:
        return jsonify({"message": "Menu item deleted successfully!"})
    return jsonify({"error": "Menu item not found"}), 404

# End User Frontend files:

@app.route('/get-menu-items/<restaurant_name>', methods=['GET'])
def get_menu_items(restaurant_name):
    db = mongo.cx[restaurant_name]
    items = list(db.menuitems.find({}, {'_id': 0}))
    return jsonify({"menu_items": items})

@app.route('/get-menu-items/<restaurant_name>/12', methods=['GET'])
def get_menu_itemss(restaurant_name):
    db = mongo.cx[restaurant_name]
    # items = list(db.menuitems.find({}, {'_id': 0}))
    items = list(db.menu_items_final.find({}, {'_id': 0}))
    # return jsonify({"menu_items": items})
    return jsonify(items)


# Function to get the current time in IST in 12-hour format
def get_current_ist_time():
    # Get the current UTC time
    utc_now = datetime.utcnow()

    # Define the IST timezone
    ist_timezone = pytz.timezone('Asia/Kolkata')

    # Convert UTC time to IST
    ist_now = utc_now.replace(tzinfo=pytz.utc).astimezone(ist_timezone)

    # Format the IST time in 12-hour format with AM/PM
    return ist_now.strftime('%Y-%m-%d %I:%M:%S %p')


@app.route('/<string:restaurant_name>/place-order', methods=['POST'])
def place_order(restaurant_name):
    data = request.json
    table_name = data['table_name']
    order_details = data['order_details']  # Corrected from 'order' to 'order_details'
    username = data['username']  # New field for username
    mobile_number = data['mobile_number']  # New field for mobile number

    # Access the correct database using the restaurant name from the URL
    db = mongo.cx[restaurant_name]

    # Ensure 'users' collection exists
    if 'users' not in db.list_collection_names():
        db.create_collection('users')  # Create the 'users' collection if it does not exist

    # Check if the user exists in the 'users' collection
    existing_user = db.users.find_one({"username": username, "mobile_number": mobile_number})

    if existing_user:
        # If user exists, retrieve the existing unique_user_id
        unique_user_id = existing_user['unique_user_id']

    else:
        # If user does not exist, create a new user document with a unique_user_id
        unique_user_id = str(uuid.uuid4())
        new_user = {
            "username": username,
            "mobile_number": mobile_number,
            "unique_user_id": unique_user_id
        }
        db.users.insert_one(new_user)  # Insert the new user into the 'users' collection

     # Add the current date and time in IST
    timestamp = get_current_ist_time()

    order_id = str(uuid.uuid4())
    # Prepare the order entry to be inserted into the database
    # Prepare the order entry without the order_id initially
    order_entry = {
        "table_name": table_name,
        "order": order_details,
        "status": "Pending",
        "username": username,
        "mobile_number": mobile_number,
        "unique_user_id": unique_user_id,
        "timestamp": timestamp
    }

     # Insert the order into the orders collection
    result = db.orders.insert_one(order_entry)
    # Get the `_id` of the inserted document and use it as `order_id`
    order_id = str(result.inserted_id)

    print(order_id)

    # Update the document to include the `order_id` field
    db.orders.update_one({"_id": result.inserted_id}, {"$set": {"order_id": order_id}})

    # Emit a WebSocket event to notify admin panel
    socketio.emit('new_order', {
       "restaurant_name": restaurant_name,
        "order_id": order_id,
        "table_name": table_name,
        "order": order_details,
        "username": username,
        "mobile_number": mobile_number,
        "status": "Pending",
        "timestamp": timestamp
    })

    # Return a success message along with the `order_id`
    return jsonify({"success": True, "message": "Order placed successfully!", "order_id": order_id})


@app.route('/<string:restaurant_name>/user-id', methods=['POST'])
def get_user_id(restaurant_name):
    data = request.json

    # print("Received payload:", data)  # Log the payload for debugging

    username = data.get('username')
    mobile_number = data.get('mobileNumber')

    if not username or not mobile_number:
        return jsonify({"success": False, "message": "Username or Mobile Number missing"}), 400

    db = mongo.cx[restaurant_name]  # Access the restaurant's database
    user = db.users.find_one({"username": username, "mobile_number": mobile_number})

    if user:
        return jsonify({"success": True, "user_id": user['unique_user_id']})
    else:
        unique_user_id = str(uuid.uuid4())
        db.users.insert_one({"username": username, "mobile_number": mobile_number, "unique_user_id": unique_user_id})
        return jsonify({"success": True, "user_id": unique_user_id})
    

@app.route('/<string:restaurant_name>/orders/<unique_user_id>', methods=['GET'])
def get_user_orders(restaurant_name, unique_user_id):
    db = mongo.cx[restaurant_name]  # Access the restaurant's database
    orders = db.orders.find({"unique_user_id": unique_user_id})

    orders_list = []
    for order in orders:
        orders_list.append({
            "orderId": str(order["_id"]),  # Convert MongoDB ObjectId to string
            "table_name": order["table_name"],
            "order": [
                {
                    "name": item["name"],
                    "quantity": item["quantity"],
                    "price": item["price"]
                }
                for item in order["order"]
            ],
            "status": order["status"],
            "username": order["username"],
            "mobile_number": order["mobile_number"],
            "timestamp": order["timestamp"]
        })

    # print("Orders List:", orders_list)
    return jsonify({"success": True, "orders": orders_list})

@app.route("/<restaurant_name>/add-user", methods=["POST"])
def add_user(restaurant_name):
    data = request.json
    username = data.get("username")
    mobile_number = data.get("mobileNumber")
    
    # Ensure required fields are provided
    if not username or not mobile_number:
        return jsonify({"success": False, "message": "Username and mobile number are required"}), 400
    
    # Access the restaurant's database
    db = mongo.cx[restaurant_name]  # Use `mongo.cx` to access the client

    # Access the users collection
    users = db.users
    
    # Generate a unique user ID
    unique_user_id = str(uuid.uuid4())
    
    # Insert the new user into the collection
    users.insert_one({"username": username, "mobile_number": mobile_number, "unique_user_id": unique_user_id})
    
    return jsonify({"success": True, "unique_user_id": unique_user_id}), 201

# Restaurant admin files

@app.route('/get-orders/<restaurant_name>', methods=['GET'])
def get_orders(restaurant_name):
    db = mongo.cx[restaurant_name]
    
    # Fetch pending orders
    pending_orders = list(db.orders.find({"status": "Pending"}, {'_id': 0}))
    
    # Sort orders by order_date (manual string-to-datetime conversion)
    pending_orders.sort(
        key=lambda order: datetime.strptime(order['timestamp'], '%Y-%m-%d %I:%M:%S %p'),
        reverse=True  # Sort in descending order
    )
    
    return jsonify({"orders": pending_orders})


@app.route('/update-order-status/<restaurant_name>/<order_id>', methods=['POST'])
def update_order_status(restaurant_name, order_id):
    try:
        new_status = request.json.get('status')
        db = mongo.cx[restaurant_name]
        db.orders.update_one({'_id': ObjectId(order_id)}, {'$set': {'status': new_status}})
        print(f"Restaurant: {restaurant_name}, Order ID: {order_id}, Status: {new_status}")

        return jsonify({"message": "Order status updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/get-processing-orders/<restaurant_name>', methods=['GET'])
def get_processing_orders(restaurant_name):
    db = mongo.cx[restaurant_name]
    orders = list(db.orders.find({"status": {"$ne": "Pending"}}, {'_id': 0}))
    return jsonify({"orders": orders})


@app.route('/delete-order/<restaurant_name>/<order_id>', methods=['DELETE'])
def delete_order(restaurant_name, order_id):
    try:
        db = mongo.cx[restaurant_name]
        db.orders.delete_one({'_id': ObjectId(order_id)})
        return jsonify({"message": "Order deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/menu_item/<restaurant_name>/<menu_id>/stock', methods=['PUT'])
def update_stock_status(restaurant_name, menu_id):
    data = request.json
    stock_status = data.get('stock')

    if stock_status not in ['yes', 'no']:
        return jsonify({"error": "Invalid stock status"}), 400

    db = mongo.cx[restaurant_name]
    collection = db['menuitems']  # Specify the 'menuitems' collection

    # Find the menu item
    menu_item = collection.find_one({'unique_id': menu_id})

    if not menu_item:
        return jsonify({"error": "Menu item not found"}), 404

    # If stock key does not exist, create it with the appropriate value
    if 'stock' not in menu_item:
        collection.update_one(
            {'unique_id': menu_id},
            {'$set': {'stock': stock_status}}
        )
    else:
        # Update the stock status if the key already exists
        collection.update_one(
            {'unique_id': menu_id},
            {'$set': {'stock': stock_status}}
        )

    return jsonify({"message": "Stock status updated successfully"}), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    db = mongo.cx['Restaurants_Admin_Database']
    restaurant = db.restaurants.find_one({'username': username, 'password': password})
    print(restaurant)
    
    if restaurant:
        return jsonify({'success': True, 'restaurantName': restaurant['username']}), 200
    else:
        return jsonify({'success': False}), 401
    

# if __name__ == '__main__':
#     app.run(debug=True)

# if __name__ == '__main__':
#     # port = int(os.environ.get('PORT', 5000))  # Get the PORT from environment, default to 5000
#     # app.run(host='0.0.0.0', port=port, debug=True)
#     socketio.run(app, debug=True)
#     # socketio.run(app, host='0.0.0.0', port=5000, debug=True)


if __name__ == '__main__':
    import eventlet
    socketio.run(app, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=True)

