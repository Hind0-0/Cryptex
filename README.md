# Cryptex - Advanced Steganography Web Tool

A sophisticated web-based steganography application for hiding and extracting secret messages in images.

## Features

- Hide text messages in images without visible changes
- Extract hidden messages from encoded images
- Drag-and-drop file upload with preview
- Automatic conversion to PNG to preserve hidden data
- Mobile-responsive luxury design

## Technical Details

This application uses the Least Significant Bit (LSB) steganography technique to hide messages in images. Each character of the secret message is converted to its binary representation, then the least significant bit of each color channel (RGB) in the image pixels is replaced with a bit from the message.

## Installation

1. Clone this repository
2. Install the required dependencies:

```bash
pip install flask pillow
```

## Usage

1. Start the application:

```bash
python app.py
```

2. Open your browser and navigate to `http://localhost:5000`
3. Use the web interface to encode or decode messages

## Best Practices

- Use PNG images for the best results
- Larger images can store longer messages
- Avoid compressing the encoded image
- Use complex images with many colors for better hiding

## Security Notes

- This tool is for educational purposes only
- The steganography method used is not cryptographically secure
- For truly secure communication, combine with proper encryption

## License

MIT