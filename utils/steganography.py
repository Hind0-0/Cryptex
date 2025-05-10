from PIL import Image

def encode_message(image_path, output_path, message):
    """
    Encodes a secret message into an image using LSB steganography.
    
    Args:
        image_path (str): Path to the input image
        output_path (str): Path where the encoded image will be saved
        message (str): Secret message to encode
    
    Returns:
        None
    """
    try:
        img = Image.open(image_path)
    except FileNotFoundError:
        raise Exception("Image not found. Please check the path.")

    if img.mode != 'RGB':
        img = img.convert('RGB')

    encoded = img.copy()
    width, height = img.size
    message += "###"  # End delimiter
    message_bits = ''.join(f'{ord(c):08b}' for c in message)
    data_index = 0

    for y in range(height):
        for x in range(width):
            pixel = list(img.getpixel((x, y)))
            for i in range(3):  # R, G, B
                if data_index < len(message_bits):
                    pixel[i] = (pixel[i] & ~1) | int(message_bits[data_index])
                    data_index += 1
            encoded.putpixel((x, y), tuple(pixel))
            if data_index >= len(message_bits):
                break
        if data_index >= len(message_bits):
            break
    
    # Check if message fits in the image
    if data_index < len(message_bits):
        raise Exception("The message is too long for this image. Please use a larger image or a shorter message.")

    # Ensure output is PNG regardless of input
    if not output_path.lower().endswith('.png'):
        output_path += '.png'

    encoded.save(output_path, format='PNG')
    return output_path


def decode_message(image_path):
    """
    Decodes a secret message from an image using LSB steganography.
    
    Args:
        image_path (str): Path to the encoded image
    
    Returns:
        str: Decoded message
    """
    try:
        img = Image.open(image_path)
    except FileNotFoundError:
        raise Exception("Image not found. Please check the path.")

    if img.mode != 'RGB':
        img = img.convert('RGB')

    width, height = img.size
    bits = ""

    for y in range(height):
        for x in range(width):
            pixel = img.getpixel((x, y))
            for i in range(3):
                bits += str(pixel[i] & 1)
            # Check every 8 bits to see if we've reached the end
            if len(bits) >= 24 and len(bits) % 8 == 0:
                # Convert last 3 characters to check for end delimiter
                last_3_chars = ""
                for i in range(len(bits) - 24, len(bits), 8):
                    byte = bits[i:i+8]
                    last_3_chars += chr(int(byte, 2))
                if last_3_chars.endswith("###"):
                    # Found end delimiter, extract message
                    all_chars = ""
                    for i in range(0, len(bits), 8):
                        if i + 8 <= len(bits):
                            byte = bits[i:i+8]
                            all_chars += chr(int(byte, 2))
                    end_index = all_chars.find("###")
                    return all_chars[:end_index] if end_index != -1 else "[!] No hidden message found."

    # Process any remaining bits if we didn't find the delimiter
    chars = [chr(int(bits[i:i+8], 2)) for i in range(0, len(bits), 8) if i + 8 <= len(bits)]
    message = ''.join(chars)
    end_index = message.find("###")
    return message[:end_index] if end_index != -1 else "[!] No hidden message found."