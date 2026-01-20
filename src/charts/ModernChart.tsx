import React from 'react';
import { ChartData } from '@astrologer/astro-core';
import { AstroChart } from '../components/AstroChart';
import { TextZodiacWheel } from '../components/TextZodiacWheel';
import { PlanetRing } from '../components/PlanetRing';
import { HouseLines } from '../components/HouseLines';
import { AspectLines } from '../components/AspectLines';
import { RadialMarker } from '../components/Markers';

export interface ModernChartProps {
  data: ChartData;
  width?: number;
  height?: number;
  className?: string;
  onPlanetClick?: (id: string) => void;
}

export const ModernChart: React.FC<ModernChartProps> = ({
  data,
  width = 600,
  height = 600,
  className,
  onPlanetClick
}) => {
  const mainRadius = Math.min(width, height) / 2;

  // Geometry
  const zodiacThickness = 40; 
  const zodiacOuter = mainRadius - 10;
  const zodiacInner = zodiacOuter - zodiacThickness;
  
  const gap = 7;
  // Define a white band where planets and house dividers live
  const whiteBandThickness = 30;
  const whiteBandInner = zodiacInner - gap - whiteBandThickness;
  
  // Planets centered in the white band
  const planetR = whiteBandInner + (whiteBandThickness / 2)-3;
  
  // Aspects
  const aspectRadius = whiteBandInner - gap -5;

  return (
    <AstroChart 
      data={data} 
      width={width} 
      height={height}
      className={className}
    >
      {/* 1. Zodiac Ring (Black Band with Text) */}
      <TextZodiacWheel 
        outerRadius={zodiacOuter}
        innerRadius={zodiacInner}
      />
      
      {/* 1b. Thin inner border for zodiac ring */}
      <circle 
        cx={width/2} cy={height/2} r={zodiacInner} 
        fill="#eee" stroke="none" 
      />

      {/* 1c. White inner border for zodiac ring */}
      <circle 
        cx={width/2} cy={height/2} r={zodiacInner-gap} 
        fill="#fff" stroke="var(--astro-color-text)" strokeWidth="0.2" 
      />

<circle 
        cx={width/2} cy={height/2} r={aspectRadius+5} 
        fill="#eee" stroke="var(--astro-color-text)" strokeWidth="0.2" 
      />

      {/* 2. House Lines (Restricted to white band) */}
      <HouseLines 
        radius={aspectRadius}
        endRadius={zodiacInner-gap+2}
        showLabels={false} 
      />

      {/* 3. Planet Ring */}
      <PlanetRing 
        symbolRadius={planetR}
        tickRadius={zodiacInner}
        tickLength={7} 
        onPlanetClick={onPlanetClick}
        showMinutes={false}
        showZodiacSign={false}
        renderMarker={RadialMarker}
      />

      {/* 4. Aspects */}
      <AspectLines 
        radius={aspectRadius}
        showSymbol={false} 
        showTicks={true}
        tickLength={4}
      />

      {/* 5. Ascendant Arrow (Fixed at Left) */}
      <text 
        x={(width/2) - (zodiacInner - gap - 10)} 
        y={(height/2) + 10} 
        className="astro-asc-arrow"
        style={{ 
          fontSize: '24px', 
          fill: 'var(--astro-color-text)', 
          fontFamily: 'sans-serif'
        }}
      >
        ↑
      </text>

    </AstroChart>
  );
};
