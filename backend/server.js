const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Sample Campus Data (Graph Baseline for Review 2)
const sampleLocations = [
  { id: 1, name: "Main Gate", lat: 12.9692, lng: 79.1559 },
  { id: 2, name: "Library Building", lat: 12.9698, lng: 79.1564 },
  { id: 3, name: "Technology Tower", lat: 12.9705, lng: 79.1571 },
  { id: 4, name: "Food Court", lat: 12.9712, lng: 79.1580 }
];

// Health Check Endpoint
app.get('/api/v1/health', (req, res) => {
  res.json({ status: "ok", message: "Smart Campus Navigation API Running" });
});

// Endpoint 1: Get Locations (For Frontend Dropdowns)
app.get('/api/v1/locations', (req, res) => {
  res.json({ success: true, data: sampleLocations });
});

// Endpoint 2: Route Mock Endpoint (Bridge for Bidirectional A* Algorithm)
app.post('/api/v1/route', (req, res) => {
  const { origin_id, destination_id } = req.body;
  res.json({
    success: true,
    origin_id,
    destination_id,
    path: [sampleLocations[0], sampleLocations[1], sampleLocations[2]],
    total_distance_meters: 450,
    estimated_time_mins: 6
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});