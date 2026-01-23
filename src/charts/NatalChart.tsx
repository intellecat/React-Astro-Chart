import React from 'react';
import { ChartData } from '@astrologer/astro-core';
import { AstroChart } from '../components/AstroChart';
import { ZodiacWheel } from '../components/ZodiacWheel';
import { PlanetRing } from '../components/PlanetRing';
import { HouseLines } from '../components/HouseLines';
import { AspectLines } from '../components/AspectLines';

export interface NatalChartProps {
  data: ChartData;
  width?: number;
  height?: number;
  className?: string;
  showAspects?: boolean;
  onPlanetClick?: (id: string) => void;
}

export const NatalChart: React.FC<NatalChartProps> = ({
  data,
  width = 600,
  height = 600,
  className,
  showAspects = true,
  onPlanetClick
}) => {
  // Coordinate System
  const viewBoxSize = 600;
  const center = viewBoxSize / 2;
  const cx = center;
  const cy = center;
  const radius = viewBoxSize / 2;

  return (
    <AstroChart 
      data={data} 
      width={width} 
      height={height}
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      className={className}
    >
      {/* Background */}
      <circle cx={cx} cy={cy} r={radius} fill="var(--astro-color-paper)" stroke="none" />
      
      {/* Outer Zodiac */}
      <ZodiacWheel showSignBackgrounds={true} />
      
      {/* House Cusp Lines */}
      <HouseLines degreeLabelRadius={radius * 0.53}/>
      
      {/* Inner  Ring */}
      <circle className="astro-inner-ring" cx={cx} cy={cy} r={radius * 0.4} fill="none" />
      
      {/* Planet Positions */}
      <PlanetRing 
        showMinutes={true} 
        showZodiacSign={true}
        onPlanetClick={onPlanetClick}
      />
      
      {/* Aspect Lines */}
      {showAspects && <AspectLines showSymbol={true} />}
    </AstroChart>
  );
};
