#!/usr/bin/env python3
"""
KrushFlow Document Parser API Server
Handles document upload, OCR parsing, and data persistence
"""

from flask import Flask, request, jsonify, send_from_directory
import json
import os
import base64
from datetime import datetime
from PIL import Image
import io

app = Flask(__name__, static_folder='.')

# Manual CORS headers
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    return response

# Data storage
DATA_DIR = 'parsed_documents'
SERVER_DATA_FILE = os.path.join(DATA_DIR, 'server_data.json')

# Create data directory if it doesn't exist
os.makedirs(DATA_DIR, exist_ok=True)

def load_server_data():
    """Load parsed data from server storage"""
    if os.path.exists(SERVER_DATA_FILE):
        with open(SERVER_DATA_FILE, 'r') as f:
            return json.load(f)
    return {'sessions': []}

def save_server_data(data):
    """Save parsed data to server storage"""
    with open(SERVER_DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

def parse_image(image_data):
    """
    Parse image data and extract information
    In production, this would use OCR (Tesseract, Google Vision API, etc.)
    """
    try:
        # Decode base64 image
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        img_bytes = base64.b64decode(image_data)
        img = Image.open(io.BytesIO(img_bytes))
        
        # Get image metadata
        width, height = img.size
        format_type = img.format
        mode = img.mode
        
        # Simulated OCR result (in production, use actual OCR)
        extracted_text = f"[Simulated OCR extraction from {width}x{height} image]"
        
        return {
            'extracted_text': extracted_text,
            'metadata': {
                'width': width,
                'height': height,
                'format': format_type,
                'mode': mode
            },
            'status': 'success'
        }
    except Exception as e:
        return {
            'extracted_text': '',
            'metadata': {},
            'status': 'error',
            'error': str(e)
        }

@app.route('/')
def index():
    """Serve the main page"""
    return send_from_directory('.', 'parser.html')

@app.route('/<path:path>')
def serve_static(path):
    """Serve static files"""
    return send_from_directory('.', path)

@app.route('/api/parse', methods=['POST'])
def parse_documents():
    """Parse uploaded documents"""
    try:
        data = request.json
        documents = data.get('documents', [])
        
        if not documents:
            return jsonify({'error': 'No documents provided'}), 400
        
        # Parse each document
        parsed_results = []
        for doc in documents:
            result = {
                'filename': doc.get('name', 'unknown'),
                'type': doc.get('type', 'unknown'),
                'uploadedAt': doc.get('uploadedAt', datetime.now().isoformat()),
                'parsedAt': datetime.now().isoformat()
            }
            
            # If image data is provided, parse it
            if 'data' in doc:
                parse_result = parse_image(doc['data'])
                result.update(parse_result)
            
            parsed_results.append(result)
        
        # Save to server storage
        server_data = load_server_data()
        session = {
            'id': len(server_data['sessions']) + 1,
            'timestamp': datetime.now().isoformat(),
            'document_count': len(parsed_results),
            'documents': parsed_results
        }
        server_data['sessions'].append(session)
        save_server_data(server_data)
        
        return jsonify({
            'success': True,
            'session_id': session['id'],
            'parsed_documents': parsed_results,
            'total_documents': len(parsed_results),
            'message': 'Documents parsed and saved successfully'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/data', methods=['GET'])
def get_all_data():
    """Get all parsed data from server"""
    try:
        data = load_server_data()
        return jsonify({
            'success': True,
            'data': data,
            'total_sessions': len(data.get('sessions', []))
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/data/<int:session_id>', methods=['GET'])
def get_session_data(session_id):
    """Get data for a specific session"""
    try:
        data = load_server_data()
        sessions = data.get('sessions', [])
        
        for session in sessions:
            if session['id'] == session_id:
                return jsonify({
                    'success': True,
                    'session': session
                })
        
        return jsonify({
            'success': False,
            'error': 'Session not found'
        }), 404
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/clear', methods=['POST'])
def clear_data():
    """Clear all server data"""
    try:
        save_server_data({'sessions': []})
        return jsonify({
            'success': True,
            'message': 'All server data cleared'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'service': 'KrushFlow Document Parser API'
    })

if __name__ == '__main__':
    print("=" * 60)
    print("🔥 KrushFlow Document Parser API Server")
    print("=" * 60)
    print("Server starting on http://localhost:5000")
    print()
    print("API Endpoints:")
    print("  POST /api/parse         - Parse uploaded documents")
    print("  GET  /api/data          - Get all parsed data")
    print("  GET  /api/data/:id      - Get specific session data")
    print("  POST /api/clear         - Clear all server data")
    print("  GET  /health            - Health check")
    print()
    print("Web Interface:")
    print("  GET  /                  - Document parser interface")
    print("=" * 60)
    app.run(host='0.0.0.0', port=5000, debug=True)
