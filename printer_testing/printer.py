import serial

# Connect to the printer
printer = serial.Serial(port='COM4', baudrate=9600, timeout=1)  # Adjust port and baud rate

# ESC/POS Commands
ESC_INIT = b'\x1b\x40'  # Initialize printer
TEXT = b'Hello, Rugtek RP 326!\n'
CUT = b'\x1d\x56\x01'  # Full cut

# Send commands to the printer
printer.write(ESC_INIT)
printer.write(TEXT)
printer.write(CUT)

# Close the connection
printer.close()