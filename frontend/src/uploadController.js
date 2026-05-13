const xlsx = require('xlsx');

// Simulated in-memory database to store recent activities
let systemActivities = [
  { time: '10:42 AM', msg: 'Ingress node SG-01 authenticated new material batch', type: 'info' },
  { time: '10:15 AM', msg: 'Spine casting cycle #42 completed successfully', type: 'success' },
  { time: '09:30 AM', msg: 'System wide calibration check finished', type: 'info' }
];

/**
 * Handles the ingestion of Excel files, parses them to JSON, and commits them to the database.
 */
const uploadData = async (req, res) => {
  try {
    // 1. Verify file exists
    if (!req.file) {
      return res.status(400).json({ error: 'No file payload detected.' });
    }

    // 2. Read the file buffer using the xlsx library
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });

    // 3. Extract the first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // 4. Convert the sheet data into an array of JSON objects
    const parsedData = xlsx.utils.sheet_to_json(worksheet);

    // Log the parsed data to the backend terminal to verify it's working!
    console.log(`\n=== INGESTED EXCEL DATA: ${req.file.originalname} ===`);
    console.log(parsedData);
    console.log(`====================================================\n`);

    if (parsedData.length === 0) {
      return res.status(400).json({ error: 'The uploaded file is empty or formatted incorrectly.' });
    }

    // 5. Commit to Database (Simulated here)
    // e.g., await HistoricalDataModel.insertMany(parsedData);
    
    const totalRecords = parsedData.length;
    const batchId = `UP-${Math.floor(Math.random() * 1000)}`;

    // Add activity to in-memory store
    systemActivities.unshift({
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      msg: `Historical Data Migration: Processed ${totalRecords} records from ${req.file.originalname} [Batch: ${batchId}]`,
      type: 'success'
    });

    // Keep only the latest 5 activities
    if (systemActivities.length > 5) {
      systemActivities = systemActivities.slice(0, 5);
    }

    // 6. Return success audit information back to the React frontend
    return res.status(200).json({
      message: 'File ingested and committed successfully.',
      batchId: batchId,
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
 * Returns recent system activities
 */
const getActivities = (req, res) => {
  res.status(200).json(systemActivities);
};

module.exports = { uploadData, getActivities };