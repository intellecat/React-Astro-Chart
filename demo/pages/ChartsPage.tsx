import React from 'react';
import { useParams } from 'react-router-dom';
import { ChartData, GeoLocation } from '@astrologer/astro-core';
import { NatalChart, NoonChart, TransitChart, SynastryChart } from '@astrologer/react-chart';
import { DemoViewer } from '../components/DemoViewer';
import { TransitControls } from '../components/TransitControls';
import { useChartAnimator } from '../hooks/useChartAnimator';

interface Props {
    data: ChartData;
    transitData: ChartData;
    partnerData: ChartData;
    size: number;
    location: GeoLocation;
}

export const ChartsPage: React.FC<Props> = ({ data, transitData, partnerData, size, location }) => {
    const { type } = useParams<{ type: string }>();
    const view = type || 'natal';

    const animator = useChartAnimator(location);

    const getCode = (type: string) => {
        switch(type) {
            case 'natal': return `<NatalChart 
  data={data} 
  width={${size}} 
  height={${size}} 
/>`;
            case 'noon': return `<NoonChart 
  data={data} 
  width={${size}} 
  height={${size}} 
/>`;
            case 'transit': return `<TransitChart 
  natalData={natalData} 
  transitData={transitData} 
  width={${size}} 
  height={${size}} 
/>`;
            case 'synastry': return `<SynastryChart 
  chartA={personA} 
  chartB={personB} 
  width={${size}} 
  height={${size}} 
/>`;
            default: return '';
        }
    };

    const renderChart = () => {
        switch (view) {
            case 'natal': return <NatalChart data={data} width={size} height={size} />;
            case 'noon': return <NoonChart data={data} width={size} height={size} />;
            case 'transit': return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                     <TransitControls 
                        isPlaying={animator.isPlaying}
                        onTogglePlay={animator.togglePlay}
                        speed={animator.speed}
                        setSpeed={animator.setSpeed}
                        currentDate={animator.date}
                    />
                    <TransitChart 
                        natalData={data} 
                        transitData={animator.data || transitData} 
                        width={size} 
                        height={size} 
                    />
                </div>
            );
            case 'synastry': return <SynastryChart chartA={data} chartB={partnerData} width={size} height={size} />;
            default: return <div>Select a chart type</div>;
        }
    };

    return (
        <DemoViewer title={`${view.charAt(0).toUpperCase() + view.slice(1)} Chart`} code={getCode(view)}>
            {renderChart()}
        </DemoViewer>
    );
};
