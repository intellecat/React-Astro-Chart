import React from 'react';
import { useChart } from './AstroChart';
import { polarToCartesian } from '../utils/geometry';

export interface DegreeRingsProps {
  degreeRadius?: number;
  tickSmall?: number;
  tickMedium?: number;
  tickLarge?: number;
  className?: string;
}

export const DegreeRings: React.FC<DegreeRingsProps> = ({
  degreeRadius,
  tickSmall = 3,
  tickMedium = 5,
  tickLarge = 8,
  className
}) => {
  const { cx, cy, radius: mainRadius, rotationOffset } = useChart();
  const radius = degreeRadius ?? mainRadius - 40;

  const ticks = [];
  for (let i = 0; i < 360; i++) {
    let tickLength = tickSmall;
    let tickClass = 'astro-degree-tick';

    if (i % 10 === 0) {
      tickLength = tickLarge;
      tickClass += ' major';
    } else if (i % 5 === 0) {
      tickLength = tickMedium;
      tickClass += ' medium';
    }

    const p1 = polarToCartesian(cx, cy, radius, i, rotationOffset);
    const p2 = polarToCartesian(cx, cy, radius + tickLength, i, rotationOffset);

    ticks.push(
      <line 
        key={i} 
        x1={p1.x} y1={p1.y} 
        x2={p2.x} y2={p2.y} 
        className={tickClass} 
      />
    );
  }

  return (
    <g id="degree-rings" className={className}>
      {ticks}
    </g>
  );
};
