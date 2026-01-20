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
  const radius = Math.min(width, height) / 2;
  const cx = width / 2;
  const cy = height / 2;

  return (
    <AstroChart 
      data={data} 
      width={width} 
      height={height}
      className={className}
    >
      {/* Background */}
      <circle cx={cx} cy={cy} r={radius} fill="var(--astro-color-paper)" stroke="none" />
      
      {/* Outer Zodiac */}
      <ZodiacWheel showSignBackgrounds={true} />
      
      {/* House Cusp Lines */}
      <HouseLines />
      
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
