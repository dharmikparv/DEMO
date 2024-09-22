// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Create an Express application
const app = express();

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// MongoDB connection (update with your MongoDB connection string)
mongoose.connect('mongodb://localhost:27017/deviceData', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB:', err));

// Define a schema for device information
const deviceInfoSchema = new mongoose.Schema({
  userAgent: String,
  platform: String,
  language: String,
  createdAt: { type: Date, default: Date.now },
});

// Create a model from the schema
const DeviceInfo = mongoose.model('DeviceInfo', deviceInfoSchema);

// API endpoint to collect and store device information
app.post('/api/device-info', async (req, res) => {
  try {
    const deviceInfo = new DeviceInfo(req.body);
    await deviceInfo.save(); // Save the device info to MongoDB
    res.status(200).send('Device info saved');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving device info');
  }
});

// API endpoint to fetch all device information (for admin dashboard)
app.get('/api/device-info', async (req, res) => {
  try {
    const deviceData = await DeviceInfo.find(); // Fetch all device info from MongoDB
    res.status(200).json(deviceData);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching device info');
  }
});

// Start the server on port 3000
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
