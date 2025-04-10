const express = require('express');
const router = express.Router();
const alumniController = require('../controllers/alumniController');
const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, `alumni-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.xlsx' && ext !== '.xls') {
            return cb(new Error('Only Excel files are allowed'));
        }
        cb(null, true);
    }
});

// Excel upload route
router.post('/upload-excel', upload.single('file'), alumniController.uploadAlumniFromExcel);

// Existing routes
router.post('/', alumniController.createAlumni);
router.get('/', alumniController.getAllAlumni);
router.get('/:id', alumniController.getAlumniById);
router.put('/:id', alumniController.updateAlumni);
router.delete('/:id', alumniController.deleteAlumni);

module.exports = router;