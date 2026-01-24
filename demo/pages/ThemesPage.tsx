import React from 'react';
import { ChartData } from '@astrologer/astro-core';
import { AstrodienstChart, CostarChart, NatalChart } from '@astrologer/react-chart';
import { DemoViewer } from '../components/DemoViewer';

interface Props {
    view: string;
    data: ChartData;
    size: number;
}

export const ThemesPage: React.FC<Props> = ({ view, data, size }) => {
    const getCode = (type: string) => {
        switch(type) {
            case 'classic': return `<AstrodienstChart 
  data={data} 
  width={${size}} 
  height={${size}} 
/>`;
            case 'modern': return `<CostarChart 
  data={data} 
  width={${size}} 
  height={${size}} 
/>`;
            case 'dark': return `// Requires parent data-theme="dark" and loaded CSS
<div data-theme="dark">
  <NatalChart 
    data={data} 
    width={${size}} 
    height={${size}} 
  />
</div>`;
            default: return '';
        }
    };

    const renderChart = () => {
        switch (view) {
            case 'classic': return (
                <div data-theme="classic" style={{ padding: 20 }}>
                    <AstrodienstChart data={data} width={size} height={size} />
                </div>
            );
            case 'modern': return (
                <div data-theme="modern" style={{ padding: 20 }}>
                    <CostarChart data={data} width={size} height={size} />
                </div>
            );
            case 'dark': return (
                <div data-theme="dark" style={{ backgroundColor: '#1a1a1a', padding: 20, borderRadius: 8 }}>
                    <NatalChart data={data} width={size} height={size} />
                </div>
            );
            default: return <div>Select a theme</div>;
        }
    };

    return (
        <DemoViewer title={`${view.charAt(0).toUpperCase() + view.slice(1)} Theme`} code={getCode(view)}>
            {renderChart()}
        </DemoViewer>
    );
};