from flask import Flask, render_template, request, jsonify, send_file
import os
from werkzeug.utils import secure_filename
import uuid
from utils.steganography import encode_message, decode_message

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['OUTPUT_FOLDER'] = 'outputs'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload size
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif', 'bmp'}

# Create necessary directories
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['OUTPUT_FOLDER'], exist_ok=True)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/encode', methods=['POST'])
def encode():
    # Check if image was uploaded
    if 'image' not in request.files:
        return jsonify({'success': False, 'error': 'No image uploaded'}), 400
    
    file = request.files['image']
    message = request.form.get('message', '')
    
    if file.filename == '' or not allowed_file(file.filename):
        return jsonify({'success': False, 'error': 'Invalid image file'}), 400
    
    if not message:
        return jsonify({'success': False, 'error': 'No message provided'}), 400
    
    # Generate unique filenames
    unique_id = str(uuid.uuid4())
    input_filename = secure_filename(f"{unique_id}_{file.filename}")
    output_filename = f"{unique_id}_encoded.png"
    
    input_path = os.path.join(app.config['UPLOAD_FOLDER'], input_filename)
    output_path = os.path.join(app.config['OUTPUT_FOLDER'], output_filename)
    
    # Save uploaded file
    file.save(input_path)
    
    # Encode message
    try:
        encode_message(input_path, output_path, message)
        return jsonify({
            'success': True, 
            'filename': output_filename,
            'download_url': f'/download/{output_filename}'
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/decode', methods=['POST'])
def decode():
    # Check if image was uploaded
    if 'image' not in request.files:
        return jsonify({'success': False, 'error': 'No image uploaded'}), 400
    
    file = request.files['image']
    
    if file.filename == '' or not allowed_file(file.filename):
        return jsonify({'success': False, 'error': 'Invalid image file'}), 400
    
    # Generate unique filename
    unique_id = str(uuid.uuid4())
    input_filename = secure_filename(f"{unique_id}_{file.filename}")
    input_path = os.path.join(app.config['UPLOAD_FOLDER'], input_filename)
    
    # Save uploaded file
    file.save(input_path)
    
    # Decode message
    try:
        message = decode_message(input_path)
        if message == "[!] No hidden message found.":
            return jsonify({'success': True, 'message': None})
        return jsonify({'success': True, 'message': message})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/download/<filename>')
def download(filename):
    return send_file(os.path.join(app.config['OUTPUT_FOLDER'], filename), as_attachment=True)


@app.errorhandler(413)
def too_large(e):
    return jsonify({'success': False, 'error': 'File too large (max 16MB)'}), 413


if __name__ == '__main__':
    app.run(debug=True)