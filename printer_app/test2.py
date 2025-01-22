import usb.core
import usb.util
import usb.backend.libusb1

backend = usb.backend.libusb1.get_backend(find_library=lambda x: r"C:\Users\mkart\Dropbox\PC\Downloads\libusb-1.0.27\VS2017\MS32\dll\libusb-1.0.dll")
device = usb.core.find(idVendor=0x0fe6, idProduct=0x811e, backend=backend)

if device is None:
    print("Device not found!")
else:
    print("Device found!")
    try:
        # Attempt to read/write to confirm communication
        device.ctrl_transfer(0x80, 0x06, 0x0100, 0x0000, 8)
        print("Control message successful!")
    except usb.core.USBError as e:
        print(f"USB Error: {e}")
