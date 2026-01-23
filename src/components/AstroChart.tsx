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
  width?: number | string;
  height?: number | string;
  viewBox?: string;
  rotationOffset?: number; // Optional override
  children: React.ReactNode;
  className?: string;
}

export const AstroChart: React.FC<AstroChartProps> = ({
  data,
  secondaryData,
  width = 600,
  height = 600,
  viewBox,
  rotationOffset: propRotationOffset,
  children,
  className
}) => {
  // Parse coordinate system from viewBox or fallback to physical size
  let vw = typeof width === 'number' ? width : 600;
  let vh = typeof height === 'number' ? height : 600;
  
  if (viewBox) {
    const parts = viewBox.split(/\s+/).map(Number);
    if (parts.length === 4) {
      vw = parts[2];
      vh = parts[3];
    }
  }

  const cx = vw / 2;
  const cy = vh / 2;
  const radius = Math.min(vw, vh) * 0.5;

  // Rotation offset: Use prop if provided, otherwise align Ascendant to left (180 deg)
  const rotationOffset = propRotationOffset ?? (180 - data.angles.Asc);

  const value = useMemo(() => ({
    data,
    secondaryData,
    width: vw,
    height: vh,
    cx,
    cy,
    radius,
    rotationOffset
  }), [data, secondaryData, vw, vh, cx, cy, radius, rotationOffset]);

  return (
    <ChartContext.Provider value={value}>
      <svg
        viewBox={viewBox || `0 0 ${width} ${height}`}
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
