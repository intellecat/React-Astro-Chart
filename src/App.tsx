import { useEffect, useState } from 'react';
import { 
  ChartData, 
  calculateChart, 
  setSwissEphemeris,
  GeoLocation,
  BodyId
} from '@astrologer/astro-core';
import { SwissEphemeris } from '@swisseph/browser';
// @ts-ignore
import wasmUrl from '@swisseph/browser/dist/swisseph.wasm?url';
import { NatalChart, TransitChart, SynastryChart, ClassicChart } from './index';

type ChartType = 'natal' | 'transit' | 'synastry' | 'classic';

function App() {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [transitData, setTransitData] = useState<ChartData | null>(null);
  const [partnerData, setPartnerData] = useState<ChartData | null>(null);
  const [view, setView] = useState<ChartType>('natal');
  const [theme, setTheme] = useState<'light' | 'dark' | 'classic'>('light');
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ... init ...
    const init = async () => {
      try {
        const swe = new SwissEphemeris();
        await swe.init(wasmUrl);
        setSwissEphemeris(swe);
        setIsReady(true);
      } catch (e: any) {
        setError(`Failed to initialize Swiss Ephemeris: ${e.message}`);
      }
    };
    init();
  }, []);

  // ... calculation useEffect ...
  useEffect(() => {
    if (!isReady) return;

    try {
      const bodies = [
        BodyId.Sun, BodyId.Moon, BodyId.Mercury, BodyId.Venus, BodyId.Mars,
        BodyId.Jupiter, BodyId.Saturn, BodyId.Uranus, BodyId.Neptune, BodyId.Pluto,
        BodyId.MeanNode
      ];

      // 1. Natal Data (June 18, 1988)
      const inputDate = new Date('1988-06-18T09:00:00Z');
      const inputLocation: GeoLocation = { latitude: 33.0, longitude: 120.0 };
      const natal = calculateChart({
        date: inputDate,
        location: inputLocation,
        bodies
      });
      setChartData(natal);

      // 2. Transit Data (Today)
      const now = new Date();
      const transit = calculateChart({
        date: now,
        location: inputLocation,
        bodies
      });
      setTransitData(transit);

      // 3. Partner Data (Random date for synastry)
      const partnerDate = new Date('1990-11-25T14:30:00Z');
      const partner = calculateChart({
        date: partnerDate,
        location: inputLocation,
        bodies
      });
      setPartnerData(partner);

    } catch (e: any) {
      setError(`Failed to calculate chart: ${e.message}`);
      console.error(e);
    }
  }, [isReady]);

  if (error) {
    return <div style={{ color: 'red', padding: '20px' }}>Error: {error}</div>;
  }

  if (!chartData || !transitData || !partnerData) {
    return <div style={{ padding: '20px' }}>Initializing Astronomy Engine...</div>;
  }

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('classic');
    else setTheme('light');
  };

  return (
    <div 
      className="app-container" 
      data-theme={theme}
      style={{ 
        padding: '20px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        fontFamily: 'sans-serif',
        minHeight: '100vh',
        backgroundColor: 'var(--astro-color-bg)',
        color: 'var(--astro-color-text)',
        transition: 'background-color 0.3s, color 0.3s'
      }}
    >
      <h1>AstroCore React Demo</h1>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={() => setView('natal')} disabled={view === 'natal'}>Natal</button>
        <button onClick={() => setView('transit')} disabled={view === 'transit'}>Transit</button>
        <button onClick={() => setView('synastry')} disabled={view === 'synastry'}>Synastry</button>
        <button onClick={() => { setView('classic'); setTheme('classic'); }} disabled={view === 'classic'}>Classic (Astrodienst)</button>
        <div style={{ width: '10px' }}></div>
        <button onClick={toggleTheme}>
          Theme: {theme.charAt(0).toUpperCase() + theme.slice(1)}
        </button>
      </div>

      {view === 'natal' && (
        <NatalChart 
          data={chartData} 
          width={600} 
          height={600}
          className="my-chart"
          onPlanetClick={(id) => setSelectedPlanet(`Natal ${id}`)}
        />
      )}

      {view === 'transit' && (
        <TransitChart 
          natalData={chartData}
          transitData={transitData}
          width={600} 
          height={600}
          className="my-chart"
          onPlanetClick={(id, source) => setSelectedPlanet(`${source === 'natal' ? 'Natal' : 'Transit'} ${id}`)}
        />
      )}

      {view === 'synastry' && (
        <SynastryChart 
          chartA={chartData}
          chartB={partnerData}
          width={700} 
          height={700}
          className="my-chart"
        />
      )}

      {view === 'classic' && (
        <ClassicChart 
          data={chartData} 
          width={650} 
          height={650}
          className="my-chart"
          onPlanetClick={(id) => setSelectedPlanet(`Classic ${id}`)}
        />
      )}

      {selectedPlanet && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderColor: 'var(--astro-color-text)' }}>
          <strong>Selected:</strong> {selectedPlanet}
        </div>
      )}
    </div>
  );
}

export default App;
