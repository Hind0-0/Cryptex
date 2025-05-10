document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding section
            const targetSection = this.getAttribute('data-section');
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                }
            });
        });
    });
    
    // File Upload Logic
    setupFileUpload('encode');
    setupFileUpload('decode');
    
    // Form Submissions
    setupEncodeForm();
    setupDecodeForm();
    
    // Copy to clipboard functionality
    document.getElementById('copy-message').addEventListener('click', function() {
        const text = document.getElementById('decoded-message-text').textContent;
        navigator.clipboard.writeText(text).then(() => {
            showToast('Message copied to clipboard!');
        });
    });
});

function setupFileUpload(prefix) {
    const dropArea = document.getElementById(`${prefix}-drop-area`);
    const input = document.getElementById(`${prefix}-file-input`);
    const preview = document.getElementById(`${prefix}-preview`);
    const submitBtn = document.getElementById(`${prefix}-submit`);
    const warningEl = prefix === 'encode' ? document.getElementById('encode-format-warning') : null;
    
    // Prevent default behaviors for drag events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Highlight drop area when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        dropArea.classList.add('highlight');
    }
    
    function unhighlight() {
        dropArea.classList.remove('highlight');
    }
    
    // Handle dropped files
    dropArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }
    
    input.addEventListener('change', function() {
        handleFiles(this.files);
    });
    
    function handleFiles(files) {
        if (files.length) {
            const file = files[0];
            
            // Check if file is an image
            if (!file.type.match('image.*')) {
                alert('Please select an image file.');
                return;
            }
            
            // Show warning for JPEG formats in encode section
            if (prefix === 'encode' && (file.type === 'image/jpeg' || file.type === 'image/jpg')) {
                warningEl.classList.add('active');
            } else if (prefix === 'encode') {
                warningEl.classList.remove('active');
            }
            
            // Display preview
            const reader = new FileReader();
            
            reader.onload = function(e) {
                preview.innerHTML = `
                    <img src="${e.target.result}" alt="Preview" class="preview-image">
                    <div class="preview-info">
                        <span class="preview-name">${file.name}</span>
                        <button type="button" class="preview-remove">
                            <i class="fa-solid fa-xmark"></i> Remove
                        </button>
                    </div>
                `;
                
                preview.classList.add('active');
                submitBtn.disabled = false;
                
                // Add remove functionality
                document.querySelector('.preview-remove').addEventListener('click', function() {
                    preview.innerHTML = '';
                    preview.classList.remove('active');
                    input.value = '';
                    submitBtn.disabled = true;
                    if (prefix === 'encode') {
                        warningEl.classList.remove('active');
                    }
                });
            };
            
            reader.readAsDataURL(file);
        }
    }
}

function setupEncodeForm() {
    const form = document.getElementById('encode-form');
    const resultContainer = document.getElementById('encode-result');
    const downloadLink = document.getElementById('download-link');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fileInput = document.getElementById('encode-file-input');
        const messageInput = document.getElementById('encode-message');
        
        if (!fileInput.files.length) {
            alert('Please select an image file.');
            return;
        }
        
        if (!messageInput.value.trim()) {
            alert('Please enter a message to hide.');
            return;
        }
        
        const formData = new FormData();
        formData.append('image', fileInput.files[0]);
        formData.append('message', messageInput.value);
        
        // Show loading overlay
        showLoading('Encoding your message...');
        
        fetch('/encode', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            hideLoading();
            
            if (data.success) {
                downloadLink.href = data.download_url;
                resultContainer.classList.add('active');
                
                // Scroll to result
                resultContainer.scrollIntoView({ behavior: 'smooth' });
            } else {
                alert(`Error: ${data.error}`);
            }
        })
        .catch(error => {
            hideLoading();
            alert('An error occurred. Please try again.');
            console.error('Error:', error);
        });
    });
}

function setupDecodeForm() {
    const form = document.getElementById('decode-form');
    const resultContainer = document.getElementById('decode-result');
    const noResultContainer = document.getElementById('decode-no-result');
    const messageElement = document.getElementById('decoded-message-text');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fileInput = document.getElementById('decode-file-input');
        
        if (!fileInput.files.length) {
            alert('Please select an image file.');
            return;
        }
        
        const formData = new FormData();
        formData.append('image', fileInput.files[0]);
        
        // Show loading overlay
        showLoading('Decoding the message...');
        
        fetch('/decode', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            hideLoading();
            
            if (data.success) {
                if (data.message) {
                    messageElement.textContent = data.message;
                    resultContainer.classList.add('active');
                    noResultContainer.classList.remove('active');
                } else {
                    resultContainer.classList.remove('active');
                    noResultContainer.classList.add('active');
                }
                
                // Scroll to result
                (data.message ? resultContainer : noResultContainer).scrollIntoView({ behavior: 'smooth' });
            } else {
                alert(`Error: ${data.error}`);
            }
        })
        .catch(error => {
            hideLoading();
            alert('An error occurred. Please try again.');
            console.error('Error:', error);
        });
    });
}

function showLoading(message = 'Processing...') {
    const loadingOverlay = document.getElementById('loading-overlay');
    const loadingText = document.getElementById('loading-text');
    
    loadingText.textContent = message;
    loadingOverlay.classList.add('active');
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.classList.remove('active');
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.querySelector('.toast-message');
    
    toastMessage.textContent = message;
    toast.classList.add('active');
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}