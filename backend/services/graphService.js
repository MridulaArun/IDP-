/**
 * Dynamic Cost Multiplier Matrix
 */
function calculateDynamicCost(edge, constraints = {}) {
  if (edge.is_blocked || constraints.avoid_construction) {
    if (edge.is_blocked) return Infinity; // Blocked route
  }

  let multiplier = 1.0;
  if (constraints.wheelchair && !edge.is_wheelchair) multiplier += 5.0; 
  if (constraints.rain_shelter && !edge.has_cover) multiplier += 2.5;   
  if (constraints.night_lighting && !edge.is_lit) multiplier += 3.0;   

  return parseFloat(edge.distance_meters) * multiplier;
}

/**
 * Build Graph Object for Traversal
 */
function buildGraph(edgesList, constraints = {}) {
  const graph = {};

  edgesList.forEach(edge => {
    const cost = calculateDynamicCost(edge, constraints);
    
    if (cost !== Infinity) {
      if (!graph[edge.source_node]) graph[edge.source_node] = [];
      if (!graph[edge.target_node]) graph[edge.target_node] = [];

      graph[edge.source_node].push({ node: edge.target_node, cost });
      graph[edge.target_node].push({ node: edge.source_node, cost });
    }
  });

  return graph;
}

module.exports = { buildGraph, calculateDynamicCost };