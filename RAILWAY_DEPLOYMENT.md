# Railway Deployment Guide for KrushFlow Parser

## Overview
This guide explains how to deploy the KrushFlow website with document parser functionality to Railway.

## What's Been Configured

### 1. **Procfile**
Tells Railway how to start the application:
```
web: python3 api_server.py
```

### 2. **runtime.txt**
Specifies Python version:
```
python-3.11.0
```

### 3. **requirements.txt**
Python dependencies:
```
flask==3.0.0
pillow==10.1.0
```

### 4. **Environment Variables**
The app automatically detects Railway environment:
- `PORT` - Railway provides this automatically
- `FLASK_ENV=production` - Set this in Railway to disable debug mode

### 5. **Dynamic API Endpoints**
The parser automatically detects whether it's running locally or on Railway and adjusts API calls accordingly.

## Deployment Steps

### Step 1: Push to GitHub
✅ Already done! The code is in `krushinem-web/krushflow-website`

### Step 2: Deploy to Railway

1. **Go to Railway**: https://railway.app
2. **Create New Project**: Click "New Project"
3. **Deploy from GitHub**: Select "Deploy from GitHub repo"
4. **Select Repository**: Choose `krushinem-web/krushflow-website`
5. **Railway Auto-Detects**: It will see the Procfile and requirements.txt

### Step 3: Configure Environment Variables (Optional)

In Railway dashboard, add these variables if needed:
- `FLASK_ENV=production` (recommended for production)

### Step 4: Access Your Deployment

Once deployed, Railway will give you a URL like:
```
https://krushflow-website-production.up.railway.app
```

Access the parser at:
```
https://your-railway-url.railway.app/parser.html
```

## How It Works

### Local Development
- API server runs on `http://localhost:5000`
- Parser detects local environment
- API calls go to `http://localhost:5000/api/*`

### Railway Production
- API server runs on Railway's assigned PORT
- Parser detects production environment
- API calls go to `https://your-railway-url.railway.app/api/*`

## File Structure

```
krushflow-website/
├── api_server.py          # Flask API (uses Railway PORT env var)
├── parser.html            # Document parser interface
├── parser.js              # Client-side (detects environment)
├── Procfile               # Railway start command
├── runtime.txt            # Python version
├── requirements.txt       # Python dependencies
├── .gitignore            # Excludes parsed_documents/
└── RAILWAY_DEPLOYMENT.md  # This file
```

## Storage on Railway

### Server-Side Storage
- Data is saved to `parsed_documents/server_data.json`
- ⚠️ **Important**: Railway's filesystem is ephemeral
- Data will be lost on redeployment
- For persistent storage, integrate a database:
  - Railway PostgreSQL (recommended)
  - Railway MongoDB
  - External S3 bucket

### Client-Side Storage
- Uses browser localStorage
- Persists across page reloads
- Not affected by Railway redeployments

## Adding Persistent Database (Recommended)

### Option 1: Railway PostgreSQL

1. In Railway dashboard, click "New" → "Database" → "PostgreSQL"
2. Railway will provide `DATABASE_URL` environment variable
3. Update `api_server.py` to use PostgreSQL instead of JSON file:

```python
import os
import psycopg2
from urllib.parse import urlparse

DATABASE_URL = os.environ.get('DATABASE_URL')

def get_db_connection():
    url = urlparse(DATABASE_URL)
    conn = psycopg2.connect(
        database=url.path[1:],
        user=url.username,
        password=url.password,
        host=url.hostname,
        port=url.port
    )
    return conn
```

### Option 2: External Storage (S3)

Store parsed documents in AWS S3 or similar:
- Add `boto3` to requirements.txt
- Configure AWS credentials in Railway environment variables
- Update `api_server.py` to save to S3

## Monitoring

### Check Logs
In Railway dashboard:
- Click on your deployment
- Go to "Deployments" tab
- Click "View Logs"

### Health Check
Access the health endpoint:
```
https://your-railway-url.railway.app/health
```

Should return:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-06T13:30:00.000Z",
  "service": "KrushFlow Document Parser API"
}
```

## Troubleshooting

### Issue: Parser can't connect to API
- Check Railway logs for errors
- Verify the API server is running
- Check browser console for CORS errors

### Issue: Data not persisting
- Railway filesystem is ephemeral
- Implement database storage (see above)
- Use client-side storage as backup

### Issue: Build fails
- Check Python version in runtime.txt
- Verify all dependencies in requirements.txt
- Check Railway build logs

## Security for Production

Before going live, add:

1. **Authentication**
   - Add API key requirement
   - Implement user authentication

2. **Rate Limiting**
   - Prevent abuse
   - Use Flask-Limiter

3. **HTTPS Only**
   - Railway provides this automatically

4. **Input Validation**
   - Validate file types
   - Limit file sizes
   - Sanitize extracted text

5. **CORS Configuration**
   - Restrict allowed origins
   - Update CORS headers in api_server.py

## Next Steps

1. ✅ Code is pushed to GitHub
2. ⏭️ Deploy to Railway following steps above
3. ⏭️ Test parser functionality on Railway
4. ⏭️ Add database for persistent storage
5. ⏭️ Integrate real OCR (Tesseract, Google Vision, AWS Textract)
6. ⏭️ Add authentication and security measures

## Support

For issues or questions:
- Check Railway documentation: https://docs.railway.app
- Review Flask documentation: https://flask.palletsprojects.com
- Contact: hello@krushflow.com
