import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function NavigationMap({ pathData, locations }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

  // Initialize Map Instance once with a dark-tech layout theme
  useEffect(() => {
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, { zoomControl: false }).setView([12.9716, 79.1594], 17);

      // Custom smooth carto voyager tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap & CARTO',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);

      // Add custom positioned zoom control to top-right
      L.control.zoom({ position: 'topright' }).addTo(mapInstanceRef.current);

      layerGroupRef.current = L.layerGroup().addTo(mapInstanceRef.current);
    }
  }, []);

  // Render glowing markers and neon path polylines
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;

    layerGroupRef.current.clearLayers();

    // 1. Plot Custom Glowing Location Nodes
    locations.forEach((loc) => {
      const lat = loc.latitude || loc.lat;
      const lng = loc.longitude || loc.lng || loc.lon;
      
      if (lat && lng) {
        const customIconMarker = L.circleMarker([lat, lng], {
          radius: 8,
          fillColor: '#10b981',
          color: '#ffffff',
          weight: 2.5,
          fillOpacity: 1,
        });

        customIconMarker.bindPopup(`
          <div style="font-family: sans-serif; padding: 4px;">
            <div style="font-weight: 700; color: #0f172a; font-size: 13px;">${loc.name || loc.id}</div>
            <div style="color: #059669; font-size: 11px; font-weight: 600; margin-top: 2px;">${loc.category || 'Campus Hub'}</div>
          </div>
        `);

        layerGroupRef.current.addLayer(customIconMarker);
      }
    });

    // 2. Draw High-Visibility Neon Route Polyline
    if (pathData && pathData.coordinates && pathData.coordinates.length > 0) {
      const latLngs = pathData.coordinates.map(coord => [coord.lat || coord[0], coord.lng || coord[1]]);
      
      // Outer glow line
      const glowLine = L.polyline(latLngs, {
        color: '#38bdf8',
        weight: 10,
        opacity: 0.4,
        lineCap: 'round',
      });

      // Core crisp path line
      const coreLine = L.polyline(latLngs, {
        color: '#2563eb',
        weight: 5,
        opacity: 0.95,
        lineCap: 'round',
      });

      layerGroupRef.current.addLayer(glowLine);
      layerGroupRef.current.addLayer(coreLine);

      mapInstanceRef.current.fitBounds(coreLine.getBounds(), { padding: [70, 70] });
    }
  }, [pathData, locations]);

  return <div ref={mapRef} className="w-full h-full z-0 bg-slate-950" />;
}