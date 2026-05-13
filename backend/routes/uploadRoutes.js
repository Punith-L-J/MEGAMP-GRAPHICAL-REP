const express = require('express');
const multer = require('multer');

const { uploadData, getActivities } = require('../controllers/uploadController');

const router = express.Router();

// Configure multer to store files in memory as Buffers.
// Frontend posts FormData with key: "file".
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB
});

router.post('/upload', upload.single('file'), uploadData);
router.get('/activities', getActivities);

module.exports = router;

