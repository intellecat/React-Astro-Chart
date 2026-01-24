import React from 'react';
import { ChartData } from '@astrologer/astro-core';
import { AstroChart, ZodiacWheel, AspectLines, PlanetRing, StackedPlanetRing, HouseLines, DegreeRings } from '@astrologer/react-chart';
import { DemoViewer } from '../components/DemoViewer';

interface Props {
    view: string;
    data: ChartData;
    size: number;
}

export const ComponentsPage: React.FC<Props> = ({ view, data, size }) => {
    const getCode = (type: string) => {
        switch(type) {
            case 'zodiac': return `<AstroChart data={data} width={${size}} height={${size}}>
  <ZodiacWheel />
</AstroChart>`;
            case 'aspects': return `<AstroChart data={data} width={${size}} height={${size}}>
  <AspectLines />
</AstroChart>`;
            case 'planets': return `<AstroChart data={data} width={${size}} height={${size}}>
  <PlanetRing />
</AstroChart>`;
            case 'stacked': return `<AstroChart data={data} width={${size}} height={${size}}>
  <StackedPlanetRing 
    symbolStartRadius={${size * 0.45}} 
    tickStartRadius={${size * 0.40}} 
  />
</AstroChart>`;
            case 'houses': return `<AstroChart data={data} width={${size}} height={${size}}>
  <HouseLines />
</AstroChart>`;
            case 'degrees': return `<AstroChart data={data} width={${size}} height={${size}}>
  <DegreeRings />
</AstroChart>`;
            default: return '';
        }
    };

    return (
        <DemoViewer title={`${view.charAt(0).toUpperCase() + view.slice(1)} Component`} code={getCode(view)}>
            <AstroChart data={data} width={size} height={size}>
                {view === 'zodiac' && <ZodiacWheel />}
                {view === 'aspects' && <AspectLines />}
                {view === 'planets' && <PlanetRing />}
                {view === 'stacked' && <StackedPlanetRing symbolStartRadius={size * 0.45} tickStartRadius={size * 0.40} />}
                {view === 'houses' && <HouseLines />}
                {view === 'degrees' && <DegreeRings />}
            </AstroChart>
        </DemoViewer>
    );
};