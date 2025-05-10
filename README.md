# Cryptex - Advanced Steganography Web Tool

A sophisticated web-based steganography application that allows you to securely hide and extract secret messages within images. Built with modern web technologies and featuring an elegant, user-friendly interface.

![Cryptex Interface](https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg)

## 🌟 Features

- **Message Encoding**
  - Hide text messages within images using LSB steganography
  - Support for multiple image formats (PNG, JPG, JPEG, GIF, BMP)
  - Automatic conversion to PNG to preserve data integrity
  - Real-time image preview and file validation

- **Message Decoding**
  - Extract hidden messages from encoded images
  - Support for all common image formats
  - Instant message display with copy functionality
  - Validation for encoded image detection

- **User Interface**
  - Intuitive drag-and-drop file upload
  - Modern glass-morphism design
  - Mobile-responsive layout
  - Real-time progress feedback
  - Dark mode by default

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Modern web browser

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cryptex.git
   cd cryptex
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install flask pillow
   ```

### Running the Application

1. Start the Flask server:
   ```bash
   python app.py
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## 💡 How It Works

Cryptex uses the Least Significant Bit (LSB) steganography technique to hide messages in images:

1. **Encoding Process**
   - Each character of the message is converted to binary
   - The least significant bit of each RGB color channel is modified
   - Changes are imperceptible to the human eye
   - Data is preserved using PNG format

2. **Decoding Process**
   - LSB values are extracted from each pixel
   - Binary data is converted back to text
   - End markers ensure accurate message extraction

## 🛡️ Security Considerations

- **Data Protection**
  - All processing happens locally in your browser
  - No data is stored permanently on the server
  - Uploaded files are automatically deleted after 24 hours

- **Limitations**
  - LSB steganography is not cryptographically secure
  - For sensitive data, combine with proper encryption
  - Avoid image compression after encoding

## 📝 Best Practices

1. **Image Selection**
   - Use PNG format for best results
   - Choose images with high color complexity
   - Larger images can store longer messages
   - Avoid images with large solid-color areas

2. **Message Handling**
   - Keep messages within the image's capacity
   - Test decoding immediately after encoding
   - Save encoded images without compression
   - Back up original images before encoding

## 🔧 Technical Details

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript
- **Image Processing**: Pillow (PIL)
- **Design**: Custom CSS with glass-morphism effects
- **File Handling**: Secure file uploads with validation

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Pillow](https://python-pillow.org/) for image processing
- [Flask](https://flask.palletsprojects.com/) for the web framework
- [Font Awesome](https://fontawesome.com/) for icons
- [Poppins](https://fonts.google.com/specimen/Poppins) font family

## 📞 Support

For support, please:
- Open an issue in the GitHub repository
- Check existing issues for solutions
- Provide detailed information when reporting problems

---

Made with ❤️ by Hind
Completed in:: 10-5-2025
