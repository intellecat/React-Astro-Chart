import React from 'react';
import { GeoLocation } from '@astrologer/astro-core';

interface Props {
    date: Date;
    setDate: (d: Date) => void;
    location: GeoLocation;
    setLocation: (l: GeoLocation) => void;
    size: number;
    setSize: (s: number) => void;
}

export const Header: React.FC<Props> = ({ date, setDate, location, setLocation, size, setSize }) => {
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const d = new Date(e.target.value);
        if (!isNaN(d.getTime())) {
            setDate(d);
        }
    };

    const handleLatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocation({ ...location, latitude: Number(e.target.value) });
    };

    const handleLonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocation({ ...location, longitude: Number(e.target.value) });
    };

    return (
        <div className="demo-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
            <h3 style={{ margin: 0, color: '#333', whiteSpace: 'nowrap' }}>@astrologer/react-chart</h3>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div className="demo-control-group">
                    <label style={{ fontSize: '12px' }}>Date</label>
                    <input 
                        type="datetime-local" 
                        className="demo-input"
                        style={{ padding: '2px 4px', fontSize: '13px' }}
                        value={date.toISOString().slice(0, 16)}
                        onChange={handleDateChange}
                    />
                </div>

                <div className="demo-control-group" style={{ gap: '4px' }}>
                    <label style={{ fontSize: '12px' }}>Lat</label>
                    <input 
                        type="number" 
                        className="demo-input"
                        style={{ width: '42px', padding: '2px 4px', fontSize: '13px' }}
                        value={location.latitude}
                        onChange={handleLatChange}
                    />
                    <label style={{ fontSize: '12px' }}>Lon</label>
                    <input 
                        type="number" 
                        className="demo-input"
                        style={{ width: '42px', padding: '2px 4px', fontSize: '13px' }}
                        value={location.longitude}
                        onChange={handleLonChange}
                    />
                </div>
                
                <div className="demo-control-group" style={{ gap: '4px' }}>
                    <label style={{ fontSize: '12px' }}>Size</label>
                    <input 
                        type="range" 
                        min="300" 
                        max="1000" 
                        step="10" 
                        style={{ width: '80px' }}
                        value={size} 
                        onChange={(e) => setSize(Number(e.target.value))} 
                    />
                    <span style={{ fontSize: '11px', color: '#666', minWidth: '35px' }}>{size}px</span>
                </div>
            </div>
        </div>
    );
};
