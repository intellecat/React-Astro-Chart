import React from 'react';
import { GeoLocation } from '@astrologer/astro-core';

interface Props {
    date: Date;
    setDate: (d: Date) => void;
    location: GeoLocation;
    setLocation: (l: GeoLocation) => void;
    size: number;
    setSize: (s: number) => void;
    onMenuClick: () => void;
}

export const Header: React.FC<Props> = ({ date, setDate, location, setLocation, size, setSize, onMenuClick }) => {
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
        <div className="demo-header">
            <div className="demo-header-left">
                <button className="demo-menu-btn" onClick={onMenuClick}>☰</button>
                <h3>@astrologer/react-chart</h3>
            </div>

            <div className="demo-header-controls">
                <div className="demo-control-group">
                    <label>Date</label>
                    <input 
                        type="datetime-local" 
                        className="demo-input date-input"
                        value={date.toISOString().slice(0, 16)}
                        onChange={handleDateChange}
                    />
                </div>

                <div className="demo-control-group">
                    <label>Lat</label>
                    <input 
                        type="number" 
                        className="demo-input coord-input"
                        value={location.latitude}
                        onChange={handleLatChange}
                    />
                </div>
                <div className="demo-control-group">
                    <label>Lon</label>
                    <input 
                        type="number" 
                        className="demo-input coord-input"
                        value={location.longitude}
                        onChange={handleLonChange}
                    />
                </div>
                
                <div className="demo-control-group">
                    <label>Size</label>
                    <input 
                        type="range" 
                        min="300" 
                        max="1000" 
                        step="10" 
                        className="size-input"
                        value={size} 
                        onChange={(e) => setSize(Number(e.target.value))} 
                    />
                    <span className="size-label">{size}px</span>
                </div>
            </div>
        </div>
    );
};
