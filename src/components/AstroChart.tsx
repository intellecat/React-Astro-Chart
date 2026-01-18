import React, { createContext, useContext, useMemo } from 'react';
import { ChartData } from '@astrologer/astro-core';

export interface ChartContextValue {
  data: ChartData;
  secondaryData?: ChartData;
  width: number;
  height: number;
  cx: number;
  cy: number;
  radius: number;
  rotationOffset: number;
}

const ChartContext = createContext<ChartContextValue | null>(null);

export const useChart = () => {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error('useChart must be used within an AstroChart provider');
  }
  return context;
};

interface AstroChartProps {
  data: ChartData;
  secondaryData?: ChartData;
  width?: number;
  height?: number;
  children: React.ReactNode;
  className?: string;
}

export const AstroChart: React.FC<AstroChartProps> = ({
  data,
  secondaryData,
  width = 600,
  height = 600,
  children,
  className
}) => {
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.5;

  // Rotation offset to put Ascendant on the left (180 deg)
  // Logic mirrored from geometry.ts: getAscendantOffset
  const rotationOffset = 180 - data.angles.Asc;

  const value = useMemo(() => ({
    data,
    secondaryData,
    width,
    height,
    cx,
    cy,
    radius,
    rotationOffset
  }), [data, secondaryData, width, height, cx, cy, radius, rotationOffset]);

  return (
    <ChartContext.Provider value={value}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        {children}
      </svg>
    </ChartContext.Provider>
  );
};
