import React from 'react';
import { ChartData } from '@astrologer/astro-core';
import { AstroChart } from '../components/AstroChart';
import { ZodiacWheel } from '../components/ZodiacWheel';
import { PlanetRing } from '../components/PlanetRing';
import { HouseLines } from '../components/HouseLines';
import { AspectLines } from '../components/AspectLines';
import { DegreeRings } from '../components/DegreeRings';

export interface TransitChartProps {
  natalData: ChartData;
  transitData: ChartData;
  width?: number;
  height?: number;
  className?: string;
  onPlanetClick?: (id: string, source: 'natal' | 'transit') => void;
}

export const TransitChart: React.FC<TransitChartProps> = ({
  natalData,
  transitData,
  width = 600,
  height = 600,
  className,
  onPlanetClick
}) => {
  // Coordinate System
  const viewBoxSize = 600;
  const center = viewBoxSize / 2;
  const cx = center;
  const cy = center;
  const mainRadius = viewBoxSize / 2;
  
  const transitBand = mainRadius * 0.15;
  const innerRadius = mainRadius - transitBand;

  return (
    <AstroChart 
      data={natalData} 
      secondaryData={transitData}
      width={width} 
      height={height}
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      className={className}
    >
      {/* Background */}
      <circle cx={cx} cy={cy} r={mainRadius} fill="var(--astro-color-paper)" />

      {/* --- Inner Natal Chart --- */}
      
      {/* Zodiac */}
      <ZodiacWheel 
        outerRadius={innerRadius} 
        innerRadius={innerRadius - 35} 
        symbolRadius={innerRadius - 17}
      />
      
      <DegreeRings 
        degreeRadius={innerRadius - 35}
      />

      {/* House Lines (Natal) */}
      <HouseLines 
        radius={innerRadius * 0.55}
        endRadius={innerRadius}
        angleLabelRadius={innerRadius * 0.52}
      />

      {/* Inner Ring */}
      <circle className="astro-inner-ring" cx={cx} cy={cy} r={innerRadius * 0.45} fill="none" />

      {/* Natal Planets */}
      <PlanetRing 
        symbolRadius={innerRadius - 60}
        degreeRadius={innerRadius - 80}
        tickRadius={innerRadius - 35}
        tickLength={8}
        onPlanetClick={onPlanetClick ? (id) => onPlanetClick(id, 'natal') : undefined}
      />

      {/* --- Outer Transit Ring --- */}

      {/* Transit Planets */}
      <PlanetRing 
        dataSource="secondary"
        symbolRadius={mainRadius - 25}
        tickRadius={innerRadius}
        tickLength={8}
        degreeRadius={mainRadius - 6}
        avoidHouses={false}
        onPlanetClick={onPlanetClick ? (id) => onPlanetClick(id, 'transit') : undefined}
      />

      {/* Combined Aspects */}
      <AspectLines 
        dataSource="combined"
        radius={innerRadius * 0.45}
      />

    </AstroChart>
  );
};
