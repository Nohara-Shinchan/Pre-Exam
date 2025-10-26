const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only PDF and image files are allowed!'));
        }
    }
});

// In-memory storage for demo (replace with Vercel database later)
let questionPapers = [];

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get all question papers
app.get('/api/papers', (req, res) => {
    res.json(questionPapers);
});

// Upload question paper
app.post('/api/upload', upload.single('questionPaper'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const paperData = {
            id: Date.now().toString(),
            title: req.body.title || 'Untitled Question Paper',
            subject: req.body.subject || 'General',
            year: req.body.year || new Date().getFullYear(),
            semester: req.body.semester || 'N/A',
            university: req.body.university || 'N/A',
            filename: req.file.filename,
            originalName: req.file.originalname,
            fileType: req.file.mimetype,
            fileSize: req.file.size,
            uploadDate: new Date().toISOString(),
            downloadCount: 0
        };

        questionPapers.push(paperData);
        res.json({ success: true, paper: paperData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Search question papers
app.get('/api/search', (req, res) => {
    const { query, subject, year, semester } = req.query;
    let filteredPapers = questionPapers;

    if (query) {
        filteredPapers = filteredPapers.filter(paper => 
            paper.title.toLowerCase().includes(query.toLowerCase()) ||
            paper.subject.toLowerCase().includes(query.toLowerCase()) ||
            paper.university.toLowerCase().includes(query.toLowerCase())
        );
    }

    if (subject) {
        filteredPapers = filteredPapers.filter(paper => 
            paper.subject.toLowerCase() === subject.toLowerCase()
        );
    }

    if (year) {
        filteredPapers = filteredPapers.filter(paper => 
            paper.year.toString() === year
        );
    }

    if (semester) {
        filteredPapers = filteredPapers.filter(paper => 
            paper.semester.toLowerCase() === semester.toLowerCase()
        );
    }

    res.json(filteredPapers);
});

// Increment download count
app.post('/api/download/:id', (req, res) => {
    const paper = questionPapers.find(p => p.id === req.params.id);
    if (paper) {
        paper.downloadCount++;
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Question paper not found' });
    }
});

// AI Chat endpoint - search papers based on AI query
app.post('/api/ai-search', (req, res) => {
    try {
        const { query } = req.body;
        
        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }
        
        // Simple keyword matching for now
        // In a real implementation, you might use more sophisticated NLP
        const searchTerms = query.toLowerCase().split(' ');
        const matchedPapers = questionPapers.filter(paper => {
            const searchableText = `${paper.title} ${paper.subject} ${paper.university} ${paper.year}`.toLowerCase();
            return searchTerms.some(term => searchableText.includes(term));
        });
        
        res.json({
            success: true,
            papers: matchedPapers,
            query: query,
            count: matchedPapers.length
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Upload directory: ${uploadsDir}`);
    console.log(`🌐 Open your browser and navigate to the URL above`);
});

// Handle server errors
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`❌ Port ${PORT} is already in use. Trying port ${PORT + 1}...`);
        const newPort = PORT + 1;
        const newServer = app.listen(newPort, () => {
            console.log(`🚀 Server running on http://localhost:${newPort}`);
        });
        newServer.on('error', (err) => {
            console.error('❌ Failed to start server:', err.message);
            process.exit(1);
        });
    } else {
        console.error('❌ Server error:', err.message);
        process.exit(1);
    }
});
