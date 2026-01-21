import React from 'react';
import './AstrodienstTheme.css';
import { ChartData } from '@astrologer/astro-core';
import { AstroChart } from '../components/AstroChart';
import { ZodiacWheel } from '../components/ZodiacWheel';
import { PlanetRing } from '../components/PlanetRing';
import { HouseLines } from '../components/HouseLines';
import { AspectLines } from '../components/AspectLines';
import { DegreeRings } from '../components/DegreeRings';
import { RadialMarker } from '../components/Markers';

export interface AstrodienstChartProps {
  data: ChartData;
  width?: number;
  height?: number;
  className?: string;
  onPlanetClick?: (id: string) => void;
}

export const AstrodienstChart: React.FC<AstrodienstChartProps> = ({
  data,
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

  // Geometry Definition for "Classic" Style
  const zodiacThickness = 40;
  const zodiacOuter = mainRadius - 40;
  const zodiacInner = zodiacOuter - zodiacThickness;
  
  // Planets sit inside the house area, but "point" to the zodiac
  const planetSymbolR = zodiacInner - 25; // Symbols placed inward
  
  // House lines go from near center to zodiac inner
  const houseInner = 40; // Small circle in center
  const aspectRadius = zodiacInner - 70; // Aspects contained within

  return (
    <AstroChart 
      data={data} 
      width={width} 
      height={height}
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      className={className}
    >
      {/* 0. Background Layers (The "Sandwich") */}
      <circle cx={cx} cy={cy} r={mainRadius} fill="var(--astro-color-classic-blue)" stroke="none" />
      {/* Outer Ring Background (Yellow) */}
      <circle cx={cx} cy={cy} r={zodiacOuter} fill="var(--astro-color-classic-yellow)" stroke="none" />
      
      {/* Middle Ring Background (Blue - covers the center of the yellow circle) */}
      <circle cx={cx} cy={cy} r={zodiacInner} fill="var(--astro-color-classic-skyblue)" stroke="none" />
      
      {/* Center Aspect Area Background (Yellow - covers the center of the blue circle) */}
      <circle cx={cx} cy={cy} r={aspectRadius+1} fill="var(--astro-color-classic-yellow)" stroke="none" />

      {/* 1. Zodiac Ring (Foreground Lines & Glyphs) */}
      <ZodiacWheel 
        outerRadius={zodiacOuter}
        innerRadius={zodiacInner}
        symbolRadius={zodiacInner + (zodiacThickness / 2)}
        showSignBackgrounds={false}
      />
      
      {/* 2. Degree Ticks on the Zodiac Inner Edge */}
      <DegreeRings 
        degreeRadius={zodiacInner}
        tickSmall={3}
        tickMedium={5}
        tickLarge={8}
      />

      {/* 3. House Lines (Full Span) */}
      <HouseLines 
        radius={houseInner}
        endRadius={zodiacInner}
        showLabels={true}
        labelRadius={houseInner + 15} // House numbers near center
        angleLabelRadius={zodiacOuter + 25} // ASC/MC labels outside
      />

      {/* 4. Planet Ring */}
      {/* We want long marker lines from the Zodiac Inner Edge to the Planet Symbol */}
      <PlanetRing 
        symbolRadius={planetSymbolR}
        degreeRadius={planetSymbolR - 20} // Degrees just inside the ring? Or maybe suppress? Classic charts often don't show degree text next to glyph, but in a table. Let's keep it but small.
        tickRadius={zodiacInner}
        tickLength={15} // Long ticks pointing inward
        onPlanetClick={onPlanetClick}
        showMinutes={false}
        renderMarker={RadialMarker}
      />

      {/* 5. Aspects */}
      <AspectLines 
        radius={aspectRadius}
        showSymbol={false} 
      />

    </AstroChart>
  );
};