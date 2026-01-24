import { useState } from 'react';
import { GeoLocation } from '@astrologer/astro-core';
import { useDemoData } from './hooks/useDemoData';
import { Sidebar } from './layout/Sidebar';
import { Header } from './layout/Header';
import { ChartsPage } from './pages/ChartsPage';
import { ThemesPage } from './pages/ThemesPage';
import { ComponentsPage } from './pages/ComponentsPage';
import './demo.css';

function App() {
  const [activePage, setActivePage] = useState('charts');
  const [subPage, setSubPage] = useState('natal');
  
  const [date, setDate] = useState(new Date('1988-06-18T09:00:00Z'));
  const [location, setLocation] = useState<GeoLocation>({ latitude: 33.0, longitude: 120.0 });
  const [size, setSize] = useState(600);

  const { isReady, natal, transit, partner } = useDemoData(date, location);

  const handleNavigate = (page: string, sub: string) => {
      setActivePage(page);
      setSubPage(sub);
  };

  if (!isReady || !natal || !transit || !partner) {
      return <div style={{ padding: 20 }}>Initializing Astro Engine...</div>;
  }

  return (
    <div className="demo-layout">
        <Header 
            date={date} 
            setDate={setDate} 
            location={location} 
            setLocation={setLocation} 
            size={size} 
            setSize={setSize} 
        />
        
        <Sidebar 
            activePage={activePage} 
            subPage={subPage} 
            onNavigate={handleNavigate} 
        />
        
        <main className="demo-content">
            {activePage === 'charts' && (
                <ChartsPage 
                    view={subPage as any} 
                    data={natal} 
                    transitData={transit} 
                    partnerData={partner} 
                    size={size} 
                />
            )}
            
            {activePage === 'themes' && (
                <ThemesPage 
                    view={subPage as any} 
                    data={natal} 
                    size={size} 
                />
            )}
            
            {activePage === 'components' && (
                <ComponentsPage 
                    view={subPage as any} 
                    data={natal} 
                    size={size} 
                />
            )}
        </main>
    </div>
  );
}

export default App;