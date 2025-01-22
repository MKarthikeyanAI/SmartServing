from flask import jsonify
import usb.core
import usb.util
import usb.backend.libusb1
import time

ESC = b'\x1B'
RESET_PRINTER = ESC + b'@'  
CUT_PAPER = ESC + b'\n\x1d\x56\x01'
ALIGN_CENTER = ESC + b'a\x01'  
ALIGN_LEFT = ESC + b'a\x00'  

def print_order(order_data):
    try:
        backend = usb.backend.libusb1.get_backend(find_library=lambda x: r"C:\path\to\libusb-1.0.dll")
        idVendor = 0x0fe6  
        idProduct = 0x811e  
        device = usb.core.find(idVendor=idVendor, idProduct=idProduct, backend=backend)

        if device is None:
            return {"error": "Printer not found"}, 404

        try:
            if device.is_kernel_driver_active(0):
                device.detach_kernel_driver(0)
        except NotImplementedError:
            pass

        device.set_configuration()

        endpoint_out = 0x01  

        receipt = RESET_PRINTER + ALIGN_CENTER + b"** My Shop **\n" + ALIGN_LEFT
        receipt += f"Order ID: {order_data['order_id']}\n".encode()
        receipt += f"Customer: {order_data['username']}\n".encode()
        receipt += "-----------------------------\n".encode()

        for item in order_data['order']:
            receipt += f"{item['name']}  {item['quantity']}  ${item['price']:.2f}\n".encode()

        receipt += f"-----------------------------\nTotal: ${order_data['total']:.2f}\n".encode()
        receipt += "Thank you!\n".encode()

        device.write(endpoint_out, receipt)
        time.sleep(1)
        device.write(endpoint_out, CUT_PAPER)

        return {"message": "Receipt printed successfully"}, 200

    except usb.core.USBError as e:
        return {"error": f"USB Error: {str(e)}"}, 500
    except Exception as e:
        return {"error": f"Error: {str(e)}"}, 500
