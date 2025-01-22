import usb.core
import usb.util
import usb.backend.libusb1
from escpos.printer import Usb

# Set the path to the libusb DLL
LIBUSB_PATH = r"C:\Users\mkart\Dropbox\PC\Downloads\libusb-1.0.27\VS2022\MS32\dll\libusb-1.0.dll"

# Initialize the USB backend
backend = usb.backend.libusb1.get_backend(find_library=lambda x: LIBUSB_PATH)

# Replace these with your printer's Vendor ID and Product ID
VENDOR_ID = 0x0fe6  # Example Vendor ID
PRODUCT_ID = 0x811e  # Example Product ID

try:
    # Connect to the USB printer
    printer = Usb(VENDOR_ID, PRODUCT_ID, backend=backend)
    print(printer)
    print("Printer connected successfully!")

    # Send a test print command
    printer.set(align='center', bold=True)
    printer.text("Test Print\n")
    printer.text("----------------------------\n")
    printer.text("Hello, World!\n")
    printer.text("----------------------------\n")
    printer.cut()

    print("Test print sent successfully!")
except usb.core.USBError as e:
    print(f"USB Error: {e}")
except Exception as e:
    print(f"Error: {e}")
