from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
import uuid  # Import the uuid module for generating unique IDs
import io
import base64
import qrcode

# Initialize app
app = Flask(__name__)
CORS(app)

# MongoDB configuration
app.config["MONGO_URI"] = "mongodb+srv://7708307520karthi:7708307520karthi@cluster0.jtruf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
mongo = PyMongo(app)


# Register routes
# app.register_blueprint(qr_code_routes, url_prefix='/api/qrcodes')
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
    qr_data = f"{restaurant_name}_{table_name}"
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
        "qr_code_image": img_base64
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
    required_fields = ['name', 'price', 'category', 'subcategory']

    # Validate required fields
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    db = mongo.cx[restaurant_name]

    # Generate a unique UUID for the menu item
    unique_id = str(uuid.uuid4())

    menu_item = {
        "unique_id": unique_id,
        "name": data['name'],
        "price": data['price'],
        "category": data['category'],
        "subcategory": data['subcategory']
    }

    # Insert the new menu item
    result = db.menuitems.insert_one(menu_item)
    menu_item['_id'] = str(result.inserted_id)  # Convert ObjectId to string

    return jsonify({"message": "Menu item added successfully!", "item": menu_item}), 201

@app.route('/update-menu-item/<restaurant_name>/<unique_id>', methods=['PUT'])
def update_menu_item(restaurant_name, unique_id):
    data = request.json
    required_fields = ['name', 'price', 'category', 'subcategory']

    # Validate required fields
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    db = mongo.cx[restaurant_name]
    menu_item = {
        "name": data['name'],
        "price": data['price'],
        "category": data['category'],
        "subcategory": data['subcategory']
    }

    # Update the menu item in the database using unique_id
    result = db.menuitems.update_one(
        {"unique_id": unique_id},
        {"$set": menu_item}
    )

    if result.matched_count > 0:
        return jsonify({"message": "Menu item updated successfully!"})
    return jsonify({"error": "Menu item not found"}), 404


@app.route('/delete-menu-item/<restaurant_name>/<unique_id>', methods=['DELETE'])
def delete_menu_item(restaurant_name, unique_id):
    db = mongo.cx[restaurant_name]

    # Delete the menu item using the unique_id
    result = db.menuitems.delete_one({"unique_id": unique_id})

    if result.deleted_count > 0:
        return jsonify({"message": "Menu item deleted successfully!"})
    return jsonify({"error": "Menu item not found"}), 404


@app.route('/get-menu-items/<restaurant_name>', methods=['GET'])
def get_menu_items(restaurant_name):
    db = mongo.cx[restaurant_name]
    items = list(db.menuitems.find({}, {'_id': 0}))
    return jsonify({"menu_items": items})


if __name__ == '__main__':
    app.run(debug=True)
