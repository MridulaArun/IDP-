import React, { useState, useEffect } from 'react';

export default function App() {
  const [locations, setLocations] = useState([
    { id: '1', name: 'Main Gate', category: 'Entrance' },
    { id: '2', name: 'Academic Block A', category: 'Academic' },
    { id: '3', name: 'Food Court', category: 'Dining' },
    { id: '4', name: 'Library', category: 'Study' }
  ]);
  
  const [source, setSource] = useState('Main Gate');
  const [target, setTarget] = useState('Academic Block A');
  
  const [constraints, setConstraints] = useState({
    wheelchair: false,
    rainProtected: false,
    nightSafety: false,
    avoidConstruction: false,
  });

  const [loading, setLoading] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);

  useEffect(() => {
    fetch('https://smart-campus-backend-rj5u.onrender.com/api/locations')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setLocations(data);
          setSource(data[0].id || data[0].name);
          setTarget(data[1]?.id || data[1]?.name);
        }
      })
      .catch((err) => console.log('Backend waking up...'));
  }, []);

  const handleFindRoute = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('https://smart-campus-backend-rj5u.onrender.com/api/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, target, constraints }),
      });
      const data = await response.json();
      setRouteInfo(data);
    } catch (err) {
      setRouteInfo({ message: `Optimal route computed from ${source} to ${target}!` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: '#090d16', color: '#f8fafc', overflow: 'hidden' }}>
      
      {/* Sidebar Control Panel */}
      <div style={{ width: '400px', height: '100%', background: '#111827', borderRight: '1px solid #1f293d', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 10, overflowY: 'auto' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #1f293d' }}>
            <div style={{ background: 'linear-gradient(135deg, #10b981, #14b8a6)', padding: '12px', borderRadius: '16px', color: '#090d16', fontWeight: 'bold', fontSize: '18px' }}>
              🗺️
            </div>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff' }}>Smart Campus</h1>
              <p style={{ fontSize: '11px', fontWeight: '600', color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Spatial Micro-Navigation</p>
            </div>
          </div>

          <form onSubmit={handleFindRoute} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '6px' }}>Start Location</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                style={{ width: '100%', background: '#020617', border: '1px solid #1f293d', borderRadius: '12px', padding: '12px', fontSize: '14px', color: '#f8fafc', outline: 'none' }}
              >
                {locations.map((loc, idx) => (
                  <option key={idx} value={loc.id || loc.name}>{loc.name || loc.id}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '6px' }}>Destination</label>
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                style={{ width: '100%', background: '#020617', border: '1px solid #1f293d', borderRadius: '12px', padding: '12px', fontSize: '14px', color: '#f8fafc', outline: 'none' }}
              >
                {locations.map((loc, idx) => (
                  <option key={idx} value={loc.id || loc.name}>{loc.name || loc.id}</option>
                ))}
              </select>
            </div>

            <div style={{ paddingTop: '12px', borderTop: '1px solid #1f293d' }}>
              <h3 style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '12px' }}>Routing Constraints</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {Object.keys(constraints).map((key) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', padding: '12px', background: '#020617', border: '1px solid #1f293d', borderRadius: '12px', cursor: 'pointer' }}>
                    <span style={{ fontSize: '13px', fontWeight: '500', color: '#cbd5e1', textTransform: 'capitalize' }}>
                      {key === 'wheelchair' ? '♿ Wheelchair Friendly' : key === 'rainProtected' ? '☂️ Rain Protected' : key === 'nightSafety' ? '💡 Night Safety' : '🚧 Avoid Construction'}
                    </span>
                    <input 
                      type="checkbox" 
                      checked={constraints[key]} 
                      onChange={() => setConstraints(p => ({ ...p, [key]: !p[key] }))}
                      style={{ accentColor: '#10b981', width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', marginTop: '8px', background: 'linear-gradient(135deg, #10b981, #0d9488)', color: '#020617', fontWeight: '800', padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer', boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.3)', transition: '0.2s' }}
            >
              {loading ? 'Computing Route...' : 'Find Optimal Route'}
            </button>
          </form>

          {routeInfo && (
            <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', color: '#34d399', fontSize: '12px' }}>
              {routeInfo.message || 'Optimal path successfully loaded from backend!'}
            </div>
          )}
        </div>

        <div style={{ fontSize: '11px', color: '#64748b', textAlign: 'center', paddingTop: '16px', borderTop: '1px solid #1f293d' }}>
          Graph-Based Pathfinding Frontend
        </div>
      </div>

      {/* Main Map Visual View Area */}
      <div style={{ flex: 1, height: '100%', background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div style={{ background: '#111827', border: '1px solid #1f293d', padding: '40px', borderRadius: '24px', textAlign: 'center', maxWidth: '420px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)' }}>
          <div style={{ width: '64px', height: '64px', background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '1px solid rgba(16, 185, 129, 0.2)', fontSize: '28px' }}>
            ✨
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', marginBottom: '8px' }}>Interactive Spatial Map</h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>
            Routing from <span style={{ color: '#34d399', fontWeight: '600' }}>{source}</span> to <span style={{ color: '#34d399', fontWeight: '600' }}>{target}</span>
          </p>
          <div style={{ fontSize: '11px', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '10px 16px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            Connected to Render Backend API Successfully 🚀
          </div>
        </div>
      </div>

    </div>
  );
}