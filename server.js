const express = require('express');
const multer = require('multer');
const Database = require('better-sqlite3');
const AdmZip = require('adm-zip');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/builds', express.static(path.join(__dirname, 'builds')));

// Database Setup
const db = new Database('db/builds.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS builds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL, -- 'web' or 'android'
    version TEXT NOT NULL,
    description TEXT,
    upload_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    path TEXT NOT NULL,
    dir_path TEXT -- For web builds, the directory path
  )
`);

// Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueName = uuidv4();
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueName}${ext}`);
    }
});
const upload = multer({ storage });

// Helper: Check for Internal IP
const isInternalNetwork = (req, res, next) => {
    // Basic check. In production, trust proxy might be needed if behind Nginx
    // This is a simple check for 192.168.x.x
    const ip = req.ip || req.connection.remoteAddress;

    // Check if localhost or 192.168.x.x
    // IPv6 localhost is ::1, IPv4 is 127.0.0.1
    // ::ffff:192.168.x.x is how it might appear in dual stack
    if (ip.includes('192.168.') || ip.includes('127.0.0.1') || ip.includes('::1')) {
        next();
    } else {
        res.status(403).json({ error: 'Access denied. Internal network only.' });
    }
};

// --- API Routes ---

// Get Configuration
app.get('/api/config', (req, res) => {
    res.json({
        title: process.env.APP_TITLE || 'Godot Build Manager'
    });
});

// Get Builds (Paginated)
app.get('/api/builds/:type', (req, res) => {
    const { type } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    if (type !== 'web' && type !== 'android') {
        return res.status(400).json({ error: 'Invalid build type' });
    }

    try {
        const stmt = db.prepare('SELECT * FROM builds WHERE type = ? ORDER BY upload_time DESC LIMIT ? OFFSET ?');
        const builds = stmt.all(type, limit, offset);

        const countStmt = db.prepare('SELECT COUNT(*) as count FROM builds WHERE type = ?');
        const total = countStmt.get(type).count;

        res.json({
            builds,
            page,
            totalPages: Math.ceil(total / limit),
            totalBuilds: total
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Get Latest Build
app.get('/api/builds/:type/latest', (req, res) => {
    const { type } = req.params;
    if (type !== 'web' && type !== 'android') {
        return res.status(400).json({ error: 'Invalid build type' });
    }

    try {
        const stmt = db.prepare('SELECT * FROM builds WHERE type = ? ORDER BY upload_time DESC LIMIT 1');
        const build = stmt.get(type);

        if (!build) {
            return res.status(404).json({ error: 'No builds found' });
        }
        res.json(build);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Upload Web Build
app.post('/api/upload/web', isInternalNetwork, upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const { version, description } = req.body;
    const zipPath = req.file.path;
    const buildId = uuidv4();
    const extractPath = path.join(__dirname, 'builds/web', buildId);

    try {
        // Unzip
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(extractPath, true);

        // Save to DB
        const stmt = db.prepare('INSERT INTO builds (type, version, description, path, dir_path) VALUES (?, ?, ?, ?, ?)');
        // Serving path relative to /builds
        const publicPath = `/builds/web/${buildId}/index.html`; // Assumption: Godot web export usually has index.html
        stmt.run('web', version, description, publicPath, extractPath);

        // Cleanup zip file
        fs.unlinkSync(zipPath);

        res.json({ success: true, message: 'Web build uploaded successfully', path: publicPath });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ error: 'Failed to process web build' });
    }
});

// Upload Android Build
app.post('/api/upload/android', isInternalNetwork, upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const { version, description } = req.body;
    const tempPath = req.file.path;
    const buildId = uuidv4();
    const fileName = `${buildId}.apk`;
    const targetPath = path.join(__dirname, 'builds/android', fileName);

    try {
        // Move file
        fs.renameSync(tempPath, targetPath);

        // Save to DB
        const stmt = db.prepare('INSERT INTO builds (type, version, description, path) VALUES (?, ?, ?, ?)');
        const publicPath = `/builds/android/${fileName}`;
        stmt.run('android', version, description, publicPath);

        res.json({ success: true, message: 'Android build uploaded successfully', path: publicPath });
    } catch (error) {
        console.error('Upload Error:', error);
        // Clean up temp file if rename failed
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        res.status(500).json({ error: 'Failed to process android build' });
    }
});

// Delete Build
app.delete('/api/builds/:type/:id', isInternalNetwork, (req, res) => {
    const { type, id } = req.params;

    if (type !== 'web' && type !== 'android') {
        return res.status(400).json({ error: 'Invalid build type' });
    }

    try {
        // Get build info first to find path
        const stmt = db.prepare('SELECT * FROM builds WHERE id = ? AND type = ?');
        const build = stmt.get(id, type);

        if (!build) {
            return res.status(404).json({ error: 'Build not found' });
        }

        // Delete files
        if (type === 'web') {
            const dirPath = build.dir_path;
            if (dirPath && fs.existsSync(dirPath)) {
                fs.rmSync(dirPath, { recursive: true, force: true });
            }
        } else {
            const filePath = path.join(__dirname, build.path); // path stored is relative like /builds/android/...
            // The stored path starts with /, so path.join might treat it as absolute if not careful.
            // But here path.join(__dirname, '/foo') -> '/foo' on Linux/Mac if absolute, BUT 
            // the stored path is '/builds/...', and `__dirname` is absolute. 
            // We need to be careful. The stored path is likely suitable for public serving.
            // Let's construct the absolute path correctly. 
            // Actually, in upload we did: 
            // Android: publicPath = `/builds/android/${fileName}`
            // Saver path: targetPath = path.join(__dirname, 'builds/android', fileName);
            // So we should reconstruct it similarly.
            const relativePath = build.path.substring(1); // remove leading slash
            const fullPath = path.join(__dirname, relativePath);

            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
        }

        // Delete from DB
        const delStmt = db.prepare('DELETE FROM builds WHERE id = ?');
        delStmt.run(id);

        res.json({ success: true, message: 'Build deleted successfully' });
    } catch (error) {
        console.error('Delete Error:', error);
        res.status(500).json({ error: 'Failed to delete build' });
    }
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
