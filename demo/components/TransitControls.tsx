import React from 'react';

interface Props {
    isPlaying: boolean;
    onTogglePlay: () => void;
    speed: number;
    setSpeed: (s: number) => void;
    currentDate: Date;
}

export const TransitControls: React.FC<Props> = ({ isPlaying, onTogglePlay, speed, setSpeed, currentDate }) => {
    return (
        <div style={{ 
            display: 'flex', 
            gap: '20px', 
            alignItems: 'center', 
            padding: '12px 24px', 
            backgroundColor: 'white', 
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #eee',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
            <button 
                onClick={onTogglePlay}
                style={{
                    padding: '8px 20px',
                    backgroundColor: isPlaying ? '#ff4757' : '#2ed573',
                    color: 'white',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    minWidth: '80px',
                    transition: 'background 0.2s'
                }}
            >
                {isPlaying ? 'PAUSE' : 'PLAY'}
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#666', textTransform: 'uppercase', fontWeight: '600' }}>
                    <span>Speed</span>
                    <span>{speed}x</span>
                </div>
                <input 
                    type="range" 
                    min="1" 
                    max="100" 
                    step="1"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#333' }}
                />
            </div>

            <div style={{ marginLeft: '10px', textAlign: 'right', minWidth: '140px' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', fontVariantNumeric: 'tabular-nums' }}>
                    {currentDate.toLocaleDateString()}
                </div>
                <div style={{ fontSize: '12px', color: '#888', fontFamily: 'monospace', fontVariantNumeric: 'tabular-nums' }}>
                    {currentDate.toLocaleTimeString()}
                </div>
            </div>
        </div>
    );
};
