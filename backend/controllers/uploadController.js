const xlsx = require('xlsx');

// Simulated in-memory database to store recent activities
let systemActivities = [
  { time: '10:42 AM', msg: 'Ingress node SG-01 authenticated new material batch', type: 'info' },
  { time: '10:15 AM', msg: 'Spine casting cycle #42 completed successfully', type: 'success' },
  { time: '09:30 AM', msg: 'System wide calibration check finished', type: 'info' }
];

/**
 * Handles ingestion of Excel/csv files.
 * Expected upload field name: "file" (see uploadRoutes.js)
 */
const uploadData = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file payload detected.' });
    }

    const buffer = req.file.buffer;

    // Parse using xlsx.
    // Note: xlsx can read .xlsx and can sometimes parse .csv as well.
    const workbook = xlsx.read(buffer, { type: 'buffer' });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const parsedData = xlsx.utils.sheet_to_json(worksheet);

    if (!parsedData || parsedData.length === 0) {
      return res.status(400).json({ error: 'The uploaded file is empty or formatted incorrectly.' });
    }

    console.log(`\n=== INGESTED EXCEL DATA: ${req.file.originalname} ===`);
    console.log(parsedData);
    console.log(`====================================================\n`);

    const totalRecords = parsedData.length;
    const batchId = `UP-${Math.floor(Math.random() * 1000)}`;

    systemActivities.unshift({
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      msg: `Historical Data Migration: Processed ${totalRecords} records from ${req.file.originalname} [Batch: ${batchId}]`,
      type: 'success'
    });

    if (systemActivities.length > 5) {
      systemActivities = systemActivities.slice(0, 5);
    }

    return res.status(200).json({
      message: 'File ingested and committed successfully.',
      batchId,
      filename: req.file.originalname,
      records: totalRecords,
      status: 'SUCCESS'
    });
  } catch (error) {
    console.error('Data Ingestion Error:', error);
    return res.status(500).json({ error: 'Failed to process and commit the uploaded data.' });
  }
};

/**
 * Returns recent system activities.
 */
const getActivities = (req, res) => {
  res.status(200).json(systemActivities);
};

module.exports = { uploadData, getActivities };

