'use client';

import { useState, useEffect } from 'react';
import { NatalChart } from '@astrologer/react-chart';
import { ChartData } from '@astrologer/astro-core';
// Import the CSS for the charts
import '../../src/styles/astro.css';
import '../../src/styles/astro-theme-dark.css';

export default function Home() {
  const [data, setData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateStr, setDateStr] = useState('1955-02-24T19:15');
  const [lat, setLat] = useState(37.77);
  const [lon, setLon] = useState(-122.42);

  const fetchData = async () => {
    setLoading(true);
    try {
        const date = new Date(dateStr).toISOString();
        const res = await fetch(`/api/chart?date=${date}&lat=${lat}&lon=${lon}`);
        if (!res.ok) throw new Error(await res.text());
        const json = await res.json();
        setData(json);
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateStr, lat, lon]);

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif', maxWidth: 800, margin: '0 auto' }}>
      <h1>Server-Side Calculation Demo</h1>
      <p>
        This chart is calculated on the server (Next.js API) using <code>@swisseph/node</code> and rendered on the client using <code>@astrologer/react-chart</code>.
      </p>
      
      <div style={{ marginBottom: 20, display: 'flex', gap: 15, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={{ fontSize: 12, color: '#666' }}>Date & Time</label>
          <input 
              type="datetime-local" 
              value={dateStr} 
              onChange={e => setDateStr(e.target.value)} 
              style={{ padding: 8, fontSize: 16 }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={{ fontSize: 12, color: '#666' }}>Latitude</label>
          <input 
              type="number" 
              step="0.01"
              value={lat} 
              onChange={e => setLat(parseFloat(e.target.value))} 
              style={{ padding: 8, fontSize: 16, width: 100 }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={{ fontSize: 12, color: '#666' }}>Longitude</label>
          <input 
              type="number" 
              step="0.01"
              value={lon} 
              onChange={e => setLon(parseFloat(e.target.value))} 
              style={{ padding: 8, fontSize: 16, width: 100 }}
          />
        </div>
      </div>

      {loading && <div style={{ marginBottom: 10 }}>Calculating...</div>}
      {!loading && <div style={{ marginBottom: 10, color: '#444' }}>✓ Updated</div>}
      
      {!loading && data && (
          <div 
            data-theme="dark" 
            style={{ 
              backgroundColor: '#1a1a1a', 
              borderRadius: 8, 
              padding: 20, 
              display: 'flex', 
              justifyContent: 'center' 
            }}
          >
            {/* Width and Height are required by the component */}
            <NatalChart data={data} width={600} height={600} />
          </div>
      )}
    </div>
  );
}