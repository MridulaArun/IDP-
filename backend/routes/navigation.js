const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const { buildGraph } = require('../services/graphService');

// Database pool connection
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL, 
  ssl: { rejectUnauthorized: false } 
});

// Dijkstra Pathfinding Engine
function dijkstra(graph, startNode, targetNode) {
  let distances = {};
  let prev = {};
  let pq = new Set();

  Object.keys(graph).forEach(node => {
    distances[node] = Infinity;
    prev[node] = null;
    pq.add(node);
  });

  distances[startNode] = 0;

  while (pq.size > 0) {
    let minNode = Array.from(pq).reduce((min, node) => 
      distances[node] < distances[min] ? node : min
    );

    if (minNode == targetNode || distances[minNode] === Infinity) break;

    pq.delete(minNode);

    (graph[minNode] || []).forEach(neighbor => {
      let alt = distances[minNode] + neighbor.cost;
      if (alt < distances[neighbor.node]) {
        distances[neighbor.node] = alt;
        prev[neighbor.node] = minNode;
      }
    });
  }

  let path = [];
  let curr = String(targetNode);
  while (curr) {
    path.unshift(parseInt(curr));
    curr = prev[curr];
  }

  return path[0] === parseInt(startNode) ? path : null;
}

// POST Dynamic Route Endpoint
router.post('/route', async (req, res) => {
  try {
    const { startNode, targetNode, constraints } = req.body;
    const edgesRes = await pool.query('SELECT source_node, target_node, distance_meters, is_wheelchair, has_cover, is_lit, is_blocked FROM edges');
    
    const graph = buildGraph(edgesRes.rows, constraints || {});
    const path = dijkstra(graph, startNode, targetNode);

    if (!path) {
      return res.status(404).json({ success: false, message: 'No accessible path found matching these constraints.' });
    }

    res.json({
      success: true,
      pathNodeIds: path,
      appliedConstraints: constraints
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;