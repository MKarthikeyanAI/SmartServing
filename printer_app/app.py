from flask import Flask, jsonify
import usb.core
import usb.util
import usb.backend.libusb1
import time

app = Flask(__name__)

# ESC/POS Commands
ESC = b'\x1B'
RESET_PRINTER = ESC + b'@'  # Initialize printer
CUT_PAPER = ESC + b'\n\x1d\x56\x01'
ALIGN_CENTER = ESC + b'a\x01'  # Align center
ALIGN_LEFT = ESC + b'a\x00'  # Align left

# Receipt content (customize this)
RECEIPT_DATA = (
    RESET_PRINTER +
    ALIGN_CENTER + b"** My Shop **\n" +
    ALIGN_LEFT +
    b"Date: 2025-01-22   Time: 14:00\n" +
    b"-----------------------------\n" +
    b"Item             Qty    Price\n" +
    b"Apple            2      $2.00\n" +
    b"Banana           5      $5.00\n" +
    b"Orange           3      $3.00\n" +
    b"-----------------------------\n" +
    b"Total:                 $10.00\n" +
    b"Thank you!\n"
)

@app.route('/print_receipt', methods=['GET'])
def print_receipt():
    try:
        # Initialize the USB backend
        backend = usb.backend.libusb1.get_backend(find_library=lambda x: r"C:\path\to\libusb-1.0.dll")

        # Find the USB device (replace with your vendor ID and product ID)
        idVendor = 0x0fe6  # Replace with your printer's vendor ID
        idProduct = 0x811e  # Replace with your printer's product ID
        device = usb.core.find(idVendor=idVendor, idProduct=idProduct, backend=backend)

        if device is None:
            return jsonify({"message": "Printer not found!"}), 404

        # Detach kernel driver if necessary
        try:
            if device.is_kernel_driver_active(0):
                device.detach_kernel_driver(0)
        except NotImplementedError:
            pass

        # Set configuration
        device.set_configuration()

        # Send receipt data to the printer
        endpoint_out = 0x01  # Modify based on your printer's endpoint
        device.write(endpoint_out, RECEIPT_DATA)
        time.sleep(1)  # Wait for printing to finish

        # Send the cut command to cut the paper
        device.write(endpoint_out, CUT_PAPER)

        return jsonify({"message": "Receipt printed successfully!"}), 200

    except usb.core.USBError as e:
        return jsonify({"message": f"USB Error: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500
    finally:
        # Release the device
        if device:
            usb.util.dispose_resources(device)

if __name__ == '__main__':
    app.run(debug=True)
