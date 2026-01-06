# KrushFlow Document Parser

## Overview

The Document Parser allows users to upload or capture up to 30 document photos, extract information using OCR, and save the parsed data both server-side (always) and client-side (optional) with reload persistence.

## Features

- **Upload up to 30 documents** - Images (JPG, PNG, etc.) and PDF files
- **Drag & drop support** - Easy file upload interface
- **Camera capture** - Take photos directly (on mobile devices)
- **Server-side storage** - Always saves parsed data to server
- **Client-side storage** - Optional localStorage backup
- **Reload persistence** - Data persists across page reloads
- **Real-time preview** - See uploaded documents before parsing
- **OCR parsing** - Extract text from images (simulated, ready for real OCR integration)

## Setup

### 1. Install Dependencies

```bash
pip3 install -r requirements.txt
```

### 2. Start the API Server

```bash
python3 api_server.py
```

The server will start on `http://localhost:5000`

### 3. Access the Parser

Open your browser and navigate to:
```
http://localhost:5000
```

Or open `parser.html` directly if using a different web server.

## Usage

1. **Upload Documents**
   - Click the upload area or drag & drop files
   - Select up to 30 image or PDF files
   - Preview appears in the grid below

2. **Parse Documents**
   - Click "PARSE DOCUMENTS" button
   - System extracts information from each document
   - Results appear in the results section

3. **Storage Options**
   - **Server-side**: Always enabled, data saved to `parsed_documents/server_data.json`
   - **Client-side**: Check the box to also save to browser localStorage

4. **Reload Persistence**
   - Refresh the page to see saved data automatically load
   - Server data loads from API
   - Client data loads from localStorage (if enabled)

## API Endpoints

### POST /api/parse
Parse uploaded documents

**Request:**
```json
{
  "documents": [
    {
      "name": "document.jpg",
      "type": "image/jpeg",
      "data": "base64_encoded_image_data",
      "uploadedAt": "2026-01-06T12:00:00.000Z"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "session_id": 1,
  "parsed_documents": [...],
  "total_documents": 5,
  "message": "Documents parsed and saved successfully"
}
```

### GET /api/data
Get all parsed data from server

**Response:**
```json
{
  "success": true,
  "data": {
    "sessions": [...]
  },
  "total_sessions": 10
}
```

### GET /api/data/:id
Get specific session data

### POST /api/clear
Clear all server data

### GET /health
Health check endpoint

## File Structure

```
krushflow-website/
├── parser.html          # Document parser interface
├── parser.js            # Client-side JavaScript
├── api_server.py        # Flask API server
├── requirements.txt     # Python dependencies
├── parsed_documents/    # Server data storage (created automatically)
│   └── server_data.json
└── PARSER_README.md     # This file
```

## Integration with Real OCR

To integrate with real OCR services, update the `parse_image()` function in `api_server.py`:

### Option 1: Tesseract OCR (Free, Local)
```python
import pytesseract
from PIL import Image

def parse_image(image_data):
    img = Image.open(io.BytesIO(base64.b64decode(image_data)))
    extracted_text = pytesseract.image_to_string(img)
    return {'extracted_text': extracted_text, ...}
```

### Option 2: Google Cloud Vision API
```python
from google.cloud import vision

def parse_image(image_data):
    client = vision.ImageAnnotatorClient()
    image = vision.Image(content=base64.b64decode(image_data))
    response = client.text_detection(image=image)
    extracted_text = response.text_annotations[0].description
    return {'extracted_text': extracted_text, ...}
```

### Option 3: AWS Textract
```python
import boto3

def parse_image(image_data):
    client = boto3.client('textract')
    response = client.detect_document_text(
        Document={'Bytes': base64.b64decode(image_data)}
    )
    extracted_text = ' '.join([item['Text'] for item in response['Blocks']])
    return {'extracted_text': extracted_text, ...}
```

## Deployment

### Railway Deployment

1. Add `Procfile`:
```
web: python3 api_server.py
```

2. Push to GitHub and deploy via Railway

### Docker Deployment

1. Create `Dockerfile`:
```dockerfile
FROM python:3.11
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python3", "api_server.py"]
```

2. Build and run:
```bash
docker build -t krushflow-parser .
docker run -p 5000:5000 krushflow-parser
```

## Security Considerations

- Add authentication for production use
- Implement rate limiting
- Validate file types and sizes
- Sanitize extracted text
- Use HTTPS in production
- Add CSRF protection
- Implement proper error handling

## License

© 2026 KrushFlow. All rights reserved.
