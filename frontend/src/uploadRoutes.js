const express = require('express');
const multer = require('multer');
const { uploadData, getActivities } = require('../controllers/uploadController');

const router = express.Router();

// Configure multer to store files in memory as Buffers 
// This avoids writing to disk before parsing, which is faster and safer for cloud deployments
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 500 * 1024 * 1024 } // Max size: 500MB (matching your frontend limit)
});

// Define the ingress endpoint
// The 'file' string must match the FormData key sent from Axios in the frontend
router.post('/upload', upload.single('file'), uploadData);
router.get('/activities', getActivities);

module.exports = router;