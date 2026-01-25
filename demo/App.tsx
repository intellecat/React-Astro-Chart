import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GeoLocation } from '@astrologer/astro-core';
import { useDemoData } from './hooks/useDemoData';
import { Sidebar } from './layout/Sidebar';
import { Header } from './layout/Header';
import { ChartsPage } from './pages/ChartsPage';
import { ThemesPage } from './pages/ThemesPage';
import { ComponentsPage } from './pages/ComponentsPage';
import { AnimationPage } from './pages/AnimationPage';
import './demo.css';

function App() {
  const [date, setDate] = useState(new Date('1988-06-18T09:00:00Z'));
  const [location, setLocation] = useState<GeoLocation>({ latitude: 33.0, longitude: 120.0 });
  const [size, setSize] = useState(600);

  const { isReady, natal, transit, partner } = useDemoData(date, location);

  if (!isReady || !natal || !transit || !partner) {
      return <div style={{ padding: 20 }}>Initializing Astro Engine...</div>;
  }

  return (
    <BrowserRouter>
        <div className="demo-layout">
            <Header 
                date={date} 
                setDate={setDate} 
                location={location} 
                setLocation={setLocation} 
                size={size} 
                setSize={setSize} 
            />
            
            <Sidebar />
            
            <main className="demo-content">
                <Routes>
                    <Route path="/" element={<Navigate to="/charts/natal" replace />} />
                    <Route path="/charts" element={<Navigate to="/charts/natal" replace />} />
                    
                    <Route path="/charts/:type" element={
                        <ChartsPage 
                            data={natal} 
                            transitData={transit} 
                            partnerData={partner} 
                            size={size}
                            location={location}
                            date={date}
                        />
                    } />
                    
                    <Route path="/themes/:theme" element={
                        <ThemesPage 
                            data={natal} 
                            size={size} 
                        />
                    } />
                    
                    <Route path="/components/:component" element={
                        <ComponentsPage 
                            data={natal} 
                            size={size} 
                        />
                    } />
                    
                    <Route path="/animation/:type" element={
                        <AnimationPage 
                            location={location} 
                            size={size} 
                        />
                    } />
                </Routes>
            </main>
        </div>
    </BrowserRouter>
  );
}

export default App;
