const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Smart Campus Navigation API is running!' });
});

// 2. Fetch all nodes from Neon PostgreSQL Database
app.get('/api/locations', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM nodes ORDER BY node_id ASC');
    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching nodes:', error);
    res.status(500).json({ success: false, error: 'Database query failed' });
  }
});

// 3. Fetch graph edges (paths)
app.get('/api/graph', async (req, res) => {
  try {
    const nodesResult = await db.query('SELECT * FROM nodes');
    const edgesResult = await db.query('SELECT * FROM edges');
    
    res.status(200).json({
      success: true,
      nodes: nodesResult.rows,
      edges: edgesResult.rows
    });
  } catch (error) {
    console.error('Error fetching graph data:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch graph data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});