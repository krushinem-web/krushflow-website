// Document Parser JavaScript
// Handles document upload, parsing, and storage

const MAX_DOCUMENTS = 30;

// Detect API base URL (Railway or local)
const API_BASE_URL = window.location.origin;
let documents = [];
let parsedResults = [];

// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const documentGrid = document.getElementById('documentGrid');
const documentCount = document.getElementById('documentCount');
const parseBtn = document.getElementById('parseBtn');
const clearBtn = document.getElementById('clearBtn');
const resultsSection = document.getElementById('resultsSection');
const parsedData = document.getElementById('parsedData');
const saveClientSide = document.getElementById('saveClientSide');

// Initialize - Load from localStorage if available
window.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    loadFromServerStorage();
});

// Upload Area Click
uploadArea.addEventListener('click', () => {
    if (documents.length < MAX_DOCUMENTS) {
        fileInput.click();
    } else {
        alert(`Maximum ${MAX_DOCUMENTS} documents allowed`);
    }
});

// File Input Change
fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

// Drag and Drop
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
});

// Handle Files
function handleFiles(files) {
    const remainingSlots = MAX_DOCUMENTS - documents.length;
    const filesToAdd = Math.min(files.length, remainingSlots);
    
    for (let i = 0; i < filesToAdd; i++) {
        const file = files[i];
        if (file.type.startsWith('image/') || file.type === 'application/pdf') {
            addDocument(file);
        }
    }
    
    if (files.length > remainingSlots) {
        alert(`Only ${remainingSlots} documents added. Maximum ${MAX_DOCUMENTS} documents allowed.`);
    }
    
    updateUI();
}

// Add Document
function addDocument(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const doc = {
            id: Date.now() + Math.random(),
            name: file.name,
            type: file.type,
            size: file.size,
            data: e.target.result,
            uploadedAt: new Date().toISOString()
        };
        documents.push(doc);
        updateUI();
    };
    reader.readAsDataURL(file);
}

// Remove Document
function removeDocument(id) {
    documents = documents.filter(doc => doc.id !== id);
    updateUI();
}

// Update UI
function updateUI() {
    // Update counter
    documentCount.textContent = documents.length;
    
    // Update grid
    documentGrid.innerHTML = '';
    documents.forEach(doc => {
        const item = document.createElement('div');
        item.className = 'document-item';
        item.innerHTML = `
            <button class="remove-btn" onclick="removeDocument(${doc.id})">×</button>
            <img src="${doc.data}" alt="${doc.name}" class="document-preview">
            <div class="document-name">${doc.name}</div>
        `;
        documentGrid.appendChild(item);
    });
    
    // Enable/disable parse button
    parseBtn.disabled = documents.length === 0;
}

// Parse Documents
parseBtn.addEventListener('click', async () => {
    if (documents.length === 0) return;
    
    parseBtn.disabled = true;
    parseBtn.textContent = 'PARSING...';
    
    try {
        // Simulate parsing (in production, send to OCR API)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Extract basic info from documents
        parsedResults = documents.map(doc => ({
            filename: doc.name,
            type: doc.type,
            size: `${(doc.size / 1024).toFixed(2)} KB`,
            uploadedAt: doc.uploadedAt,
            // In production, this would contain OCR extracted text
            extractedText: `[Parsed content from ${doc.name}]`,
            metadata: {
                width: 'N/A',
                height: 'N/A',
                format: doc.type.split('/')[1]
            }
        }));
        
        // Display results
        displayResults();
        
        // Save to server (always)
        await saveToServer();
        
        // Save to client (if checked)
        if (saveClientSide.checked) {
            saveToLocalStorage();
        }
        
        alert('Documents parsed successfully!');
        
    } catch (error) {
        console.error('Parsing error:', error);
        alert('Error parsing documents. Please try again.');
    } finally {
        parseBtn.disabled = false;
        parseBtn.textContent = 'PARSE DOCUMENTS';
    }
});

// Display Results
function displayResults() {
    resultsSection.style.display = 'block';
    parsedData.textContent = JSON.stringify(parsedResults, null, 2);
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Save to Server
async function saveToServer() {
    try {
        const data = {
            documents: parsedResults,
            timestamp: new Date().toISOString(),
            count: parsedResults.length
        };
        
        // Send to actual API endpoint
        const response = await fetch(`${API_BASE_URL}/api/parse`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ documents: documents })
        });
        
        if (!response.ok) {
            throw new Error('Server error');
        }
        
        const result = await response.json();
        
        // Also save to localStorage as backup
        localStorage.setItem('krushflow_server_data', JSON.stringify(data));
        console.log('✅ Saved to server:', data);
        
    } catch (error) {
        console.error('Server save error:', error);
        throw error;
    }
}

// Save to Local Storage (Client-Side)
function saveToLocalStorage() {
    try {
        const data = {
            documents: documents,
            parsedResults: parsedResults,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('krushflow_client_data', JSON.stringify(data));
        console.log('✅ Saved to client storage:', data);
    } catch (error) {
        console.error('Local storage save error:', error);
    }
}

// Load from Local Storage
function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem('krushflow_client_data');
        if (saved) {
            const data = JSON.parse(saved);
            documents = data.documents || [];
            parsedResults = data.parsedResults || [];
            
            if (parsedResults.length > 0) {
                displayResults();
            }
            
            updateUI();
            console.log('✅ Loaded from client storage');
        }
    } catch (error) {
        console.error('Local storage load error:', error);
    }
}

// Load from Server Storage
function loadFromServerStorage() {
    try {
        const saved = localStorage.getItem('krushflow_server_data');
        if (saved) {
            const data = JSON.parse(saved);
            console.log('✅ Loaded from server storage:', data);
            
            // Display server data if available
            if (data.documents && data.documents.length > 0) {
                parsedResults = data.documents;
                displayResults();
            }
        }
    } catch (error) {
        console.error('Server storage load error:', error);
    }
}

// Clear All
clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all documents and data?')) {
        documents = [];
        parsedResults = [];
        updateUI();
        resultsSection.style.display = 'none';
        
        // Clear client storage if it was used
        if (saveClientSide.checked) {
            localStorage.removeItem('krushflow_client_data');
        }
        
        console.log('✅ All data cleared');
    }
});

// Make removeDocument available globally
window.removeDocument = removeDocument;

// Console message
console.log('%c🔥 KrushFlow Document Parser', 'color: #f97316; font-size: 20px; font-weight: bold;');
console.log('%cReady to parse up to 30 documents', 'color: #fbbf24; font-size: 14px;');
