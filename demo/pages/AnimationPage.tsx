import React, { useState } from 'react';
import { GeoLocation } from '@astrologer/astro-core';
import { NatalChart } from '@astrologer/react-chart';
import { DemoViewer } from '../components/DemoViewer';
import { TransitControls } from '../components/TransitControls';
import { useChartAnimator } from '../hooks/useChartAnimator';

interface Props {
    location: GeoLocation;
    size: number;
}

export const AnimationPage: React.FC<Props> = ({ location, size }) => {
    // Animate a Natal Chart
    const animator = useChartAnimator(location);
    const [fixedZodiac, setFixedZodiac] = useState(true);

    const code = `const animator = useChartAnimator(location);

// Pass rotationOffset={180} to fix Aries at 9 o'clock
<NatalChart 
  data={animator.data} 
  rotationOffset={${fixedZodiac ? 180 : 'undefined'}} 
  width={${size}} 
  height={${size}} 
/>`;

    return (
        <DemoViewer title="Animated Natal Chart" code={code}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <TransitControls 
                        isPlaying={animator.isPlaying}
                        onTogglePlay={animator.togglePlay}
                        speed={animator.speed}
                        setSpeed={animator.setSpeed}
                        currentDate={animator.date}
                    />
                    <div style={{ 
                        display: 'flex', alignItems: 'center', gap: 8, 
                        padding: '12px 20px', backgroundColor: 'white', 
                        borderRadius: 8, border: '1px solid #eee', height: 62, boxSizing: 'border-box' 
                    }}>
                        <input 
                            type="checkbox" 
                            id="fixed-zodiac"
                            checked={fixedZodiac} 
                            onChange={e => setFixedZodiac(e.target.checked)} 
                            style={{ width: 16, height: 16, cursor: 'pointer' }}
                        />
                        <label htmlFor="fixed-zodiac" style={{ fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Fixed Zodiac</label>
                    </div>
                </div>
                
                {animator.data ? (
                    <NatalChart 
                        data={animator.data} 
                        width={size} 
                        height={size} 
                        rotationOffset={fixedZodiac ? 180 : undefined}
                    />
                ) : (
                    <div style={{ padding: 40, color: '#666' }}>Initializing Engine...</div>
                )}
            </div>
        </DemoViewer>
    );
};