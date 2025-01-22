import usb.core
import usb.util
import usb.backend.libusb1
import time

# Replace with your libusb.dll path
LIBUSB_DLL_PATH = r"C:\Users\mkart\Dropbox\PC\Downloads\libusb-1.0.27\VS2017\MS32\dll\libusb-1.0.dll"

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

def main():
    # Initialize the USB backend
    backend = usb.backend.libusb1.get_backend(find_library=lambda x: LIBUSB_DLL_PATH)

    # Find the USB device (replace with your vendor ID and product ID)
    idVendor = 0x0fe6  # Replace with your printer's vendor ID
    idProduct = 0x811e  # Replace with your printer's product ID
    device = usb.core.find(idVendor=idVendor, idProduct=idProduct, backend=backend)

    if device is None:
        print("Printer not found!")
        return

    print("Printer found!")
    try:
        # Detach kernel driver if necessary (skip the check if this fails)
        try:
            if device.is_kernel_driver_active(0):
                device.detach_kernel_driver(0)
        except NotImplementedError:
            pass  # Ignore this error since it's not necessary for all cases

        # Set configuration
        device.set_configuration()

        # Send receipt data to the printer (replace endpoint 0x01 with your printer's OUT endpoint)
        endpoint_out = 0x01  # Modify based on your printer's endpoint
        device.write(endpoint_out, RECEIPT_DATA)
        print("Receipt printed successfully!")

        # Wait for a brief moment to ensure printing is completed
        time.sleep(1)  # You can adjust the delay depending on your printer's speed

        # Send the cut command to cut the paper
        device.write(endpoint_out, CUT_PAPER)
        print("Paper cut successfully!")

    except usb.core.USBError as e:
        print(f"USB Error: {e}")
    finally:
        # Release the device
        usb.util.dispose_resources(device)

if __name__ == "__main__":
    main()
