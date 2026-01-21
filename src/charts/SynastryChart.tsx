import React from 'react';
import { ChartData } from '@astrologer/astro-core';
import { AstroChart } from '../components/AstroChart';
import { ZodiacWheel } from '../components/ZodiacWheel';
import { StackedPlanetRing } from '../components/StackedPlanetRing';
import { HouseLines } from '../components/HouseLines';
import { AspectLines } from '../components/AspectLines';
import { DegreeRings } from '../components/DegreeRings';

export interface SynastryChartProps {
  chartA: ChartData; // Inner (Primary)
  chartB: ChartData; // Outer (Secondary)
  width?: number;
  height?: number;
  className?: string;
}

export const SynastryChart: React.FC<SynastryChartProps> = ({
  chartA,
  chartB,
  width = 700,
  height = 700,
  className
}) => {
  // Coordinate System
  const viewBoxSize = 700;
  const center = viewBoxSize / 2;
  const cx = center;
  const cy = center;
  const mainRadius = viewBoxSize / 2;
  
  const zodiacInnerRadius = mainRadius - 40; 
  const bandThickness = 65; 

  // Person B Band (Outer)
  const personBOuterRadius = zodiacInnerRadius;
  const personBInnerRadius = personBOuterRadius - bandThickness;
  
  // Person A Band (Inner)
  const personAOuterRadius = personBInnerRadius;
  const personAInnerRadius = personAOuterRadius - bandThickness;

  const innerHouseRingRadius = personAInnerRadius;
  const aspectBoundary = innerHouseRingRadius;

  return (
    <AstroChart 
      data={chartA} 
      secondaryData={chartB}
      width={width} 
      height={height}
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      className={className}
    >
      {/* Background */}
      <circle cx={cx} cy={cy} r={mainRadius} fill="var(--astro-color-paper)" />

      {/* Zodiac (Outer Rim) */}
      <ZodiacWheel 
        outerRadius={mainRadius} 
        innerRadius={zodiacInnerRadius} 
        symbolRadius={mainRadius - 20}
      />
      <DegreeRings 
        degreeRadius={zodiacInnerRadius}
      />

      {/* --- Person B (Outer Band) --- */}
      <HouseLines 
        dataSource="secondary"
        radius={personBInnerRadius}
        endRadius={personBOuterRadius}
        showLabels={true}
        labelRadius={personBInnerRadius + 8}
        angleLabelRadius={personBOuterRadius - 25}
      />
      <StackedPlanetRing
        dataSource="secondary"
        symbolStartRadius={personBOuterRadius - 25}
        orbitStep={18}
        tickStartRadius={zodiacInnerRadius}
        tickLength={10}
      />

      {/* --- Person A (Inner Band) --- */}
      <HouseLines 
        dataSource="primary"
        radius={personAInnerRadius}
        endRadius={personAOuterRadius}
        showLabels={true}
        labelRadius={personAInnerRadius + 8}
        angleLabelRadius={personAInnerRadius + 35}
      />
      <StackedPlanetRing
        dataSource="primary"
        symbolStartRadius={personAOuterRadius - 25}
        orbitStep={18}
        tickStartRadius={personAOuterRadius}
        tickLength={10}
      />

      {/* Aspects */}
      <circle cx={cx} cy={cy} r={aspectBoundary} stroke="var(--astro-color-text)" strokeOpacity={0.1} fill="none" />
      
      <AspectLines 
        dataSource="combined"
        radius={aspectBoundary} 
      />

    </AstroChart>
  );
};
