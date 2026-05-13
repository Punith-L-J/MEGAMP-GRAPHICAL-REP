const express = require('express');
const cors = require('cors');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors()); // Allow cross-origin requests from the React/Vite frontend
app.use(express.json());

// Mount Routes
app.use('/api', uploadRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Backend server is running on http://localhost:${PORT}`);
});