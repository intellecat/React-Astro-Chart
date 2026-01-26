import React, { useState } from 'react';
import { GeoLocation } from '@astrologer/astro-core';
import { AstroChart, ZodiacWheel, StackedPlanetRing, AspectLines } from '@astrologer/react-chart';
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

    const code = `// Custom Composition (No Houses)
<AstroChart 
  data={animator.data} 
  width={${size}} 
  height={${size}}
  rotationOffset={${fixedZodiac ? 180 : 'undefined'}}
>
  <ZodiacWheel />
  {/* HouseLines Omitted */}
  <PlanetRing />
  <AspectLines />
</AstroChart>`;

    const renderChart = () => {
        if (!animator.data) return <div style={{ padding: 40, color: '#666' }}>Initializing Engine...</div>;

        const viewBoxSize = 600;
        const radius = viewBoxSize / 2;
        const cx = radius;
        const cy = radius;

        return (
             <AstroChart 
                data={animator.data} 
                width={size} 
                height={size}
                viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
                rotationOffset={fixedZodiac ? 180 : undefined}
            >
                {/* Background */}
                <circle cx={cx} cy={cy} r={radius} fill="var(--astro-color-paper)" stroke="none" />
                
                <ZodiacWheel showSignBackgrounds={true} />
                
                {/* Inner Ring Circle */}
                <circle className="astro-inner-ring" cx={cx} cy={cy} r={radius * 0.4} fill="none" />
                
                <StackedPlanetRing 
                    symbolStartRadius={radius * 0.75} 
                    orbitStep={radius * 0.12}
                    tickStartRadius={radius - 40} 
                    maxTracks={3}
                />
                
                <AspectLines showSymbol={true} />
            </AstroChart>
        );
    };

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
                
                {renderChart()}
            </div>
        </DemoViewer>
    );
};
