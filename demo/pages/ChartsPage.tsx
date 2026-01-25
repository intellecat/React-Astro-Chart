import React from 'react';
import { useParams } from 'react-router-dom';
import { ChartData } from '@astrologer/astro-core';
import { NatalChart, NoonChart, TransitChart, SynastryChart } from '@astrologer/react-chart';
import { DemoViewer } from '../components/DemoViewer';

interface Props {
    data: ChartData;
    transitData: ChartData;
    partnerData: ChartData;
    size: number;
}

export const ChartsPage: React.FC<Props> = ({ data, transitData, partnerData, size }) => {
    const { type } = useParams<{ type: string }>();
    const view = type || 'natal';

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
            case 'transit': return <TransitChart natalData={data} transitData={transitData} width={size} height={size} />;
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
