import React from 'react';
import { ChartData } from '@astrologer/astro-core';
import { AstroChart } from '../components/AstroChart';
import { ZodiacWheel } from '../components/ZodiacWheel';
import { PlanetRing } from '../components/PlanetRing';
import { AspectLines } from '../components/AspectLines';

export interface NoonChartProps {
  data: ChartData;
  width?: number;
  height?: number;
  className?: string;
  onPlanetClick?: (id: string) => void;
}

export const NoonChart: React.FC<NoonChartProps> = ({
  data,
  width = 600,
  height = 600,
  className,
  onPlanetClick
}) => {
  const viewBoxSize = 600;
  const center = viewBoxSize / 2;
  const radius = viewBoxSize / 2;

  return (
    <AstroChart 
      data={data} 
      width={width} 
      height={height}
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      rotationOffset={180} // Fix 0 Aries (Long 0) to Left (180 deg)
      className={className}
    >
      {/* Background */}
      <circle cx={center} cy={center} r={radius} fill="var(--astro-color-paper)" stroke="none" />
      
      {/* Zodiac */}
      <ZodiacWheel showSignBackgrounds={true} />
      
      {/* Inner Ring (No House Lines, enlarged to fill space) */}
      <circle className="astro-inner-ring" cx={center} cy={center} r={radius * 0.5} fill="none" />
      
      {/* Planet Positions - Ignore House Collisions */}
      <PlanetRing 
        showMinutes={true} 
        showZodiacSign={true}
        avoidHouses={false}
        onPlanetClick={onPlanetClick}
      />
      
      {/* Aspect Lines - Expanded to match the inner ring */}
      <AspectLines radius={radius * 0.5} showSymbol={true} />
    </AstroChart>
  );
};
