const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');

// Environmental variables load karein (.env file se)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware Configuration
app.use(cors());
app.use(express.json());

// Neon PostgreSQL Connection Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Neon Cloud SSL connection ke liye required hai
  }
});

// Database connection verification
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring PostgreSQL client:', err.stack);
  } else {
    console.log('Successfully connected to Neon PostGIS Database live instance.');
    release();
  }
});

// -------------------------------------------------------------
// ROUTES & ENDPOINTS
// -------------------------------------------------------------

// Root Endpoint
app.get('/', (req, res) => {
  res.json({
    project: 'Smart Campus Navigation System Backend',
    version: '1.0.0 (Review III Milestone)',
    status: 'Operational'
  });
});

// 1. Fetch All Spatial Locations / Landmark Nodes
app.get('/api/locations', async (req, res) => {
  try {
    const queryText = `
      SELECT 
        node_id, 
        name, 
        category, 
        ST_X(geom::geometry) AS longitude, 
        ST_Y(geom::geometry) AS latitude 
      FROM nodes;
    `;
    const { rows } = await pool.query(queryText);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('Error fetching locations:', err);
    res.status(500).json({ success: false, error: 'Database query execution failed.' });
  }
});

// 2. Fetch Raw Pathway Network Graph Edges
app.get('/api/graph', async (req, res) => {
  try {
    const queryText = `
      SELECT 
        edge_id, 
        source_node, 
        target_node, 
        distance_meters, 
        is_wheelchair, 
        has_cover, 
        is_lit, 
        is_blocked 
      FROM edges;
    `;
    const { rows } = await pool.query(queryText);
    res.json({ success: true, totalEdges: rows.length, graph: rows });
  } catch (err) {
    console.error('Error fetching graph edges:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve spatial graph edges.' });
  }
});

// 3. Dynamic Multi-Constraint Route Calculation Endpoint
const navigationRoutes = require('./routes/navigation');
app.use('/api', navigationRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

// Server Start Listener
app.listen(PORT, () => {
  console.log(`Smart Campus Navigation API running live on port ${PORT}`);
});