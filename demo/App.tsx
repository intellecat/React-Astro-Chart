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
  // Steve Jobs: Feb 24, 1955, 19:15 PST (San Francisco)
  const [date, setDate] = useState(new Date('1955-02-25T03:15:00Z'));
  const [location, setLocation] = useState<GeoLocation>({ latitude: 37.7749, longitude: -122.4194 });
  const [size, setSize] = useState(600);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
                onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
            />
            
            <Sidebar 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
            />
            
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
