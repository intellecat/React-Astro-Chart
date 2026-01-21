import React from 'react';
import { useChart } from './AstroChart';
import { ZODIAC_SIGNS } from '@astrologer/astro-core';
import { polarToCartesian, describeRingSector } from '../utils/geometry';

export interface ZodiacWheelProps {
  outerRadius?: number;
  innerRadius?: number;
  symbolRadius?: number;
  showSignBackgrounds?: boolean;
  className?: string;
}

export const ZodiacWheel: React.FC<ZodiacWheelProps> = ({
  outerRadius,
  innerRadius,
  symbolRadius,
  showSignBackgrounds = false,
  className
}) => {
  const { cx, cy, radius, rotationOffset } = useChart();

  // Sensible defaults relative to chart radius
  const outR = outerRadius ?? radius;
  const inR = innerRadius ?? radius - 40;
  const symR = symbolRadius ?? radius - 20;

  return (
    <g className={`astro-zodiac-wheel ${className || ''}`}>
      {/* 1. Background Arcs */}
      {showSignBackgrounds && ZODIAC_SIGNS.map((sign, i) => (
        <path
          key={`bg-${sign.name}`}
          d={describeRingSector(cx, cy, inR, outR, i * 30, (i + 1) * 30, rotationOffset)}
          className={`astro-zodiac-sign-bg ${sign.element.toLowerCase()}`}
        />
      ))}

      {/* 2. Boundary Rings */}
      <circle cx={cx} cy={cy} r={outR-1} className="astro-zodiac-ring astro-zodiac-ring-outer" />
      <circle cx={cx} cy={cy} r={inR} className="astro-zodiac-ring astro-zodiac-ring-inner" />

      {/* 3. Signs and Dividers */}
      {ZODIAC_SIGNS.map((sign, i) => {
        const angle = i * 30;
        const p1 = polarToCartesian(cx, cy, outR, angle, rotationOffset);
        const p2 = polarToCartesian(cx, cy, inR, angle, rotationOffset);
        
        const midAngle = angle + 15;
        const glyphPos = polarToCartesian(cx, cy, symR, midAngle, rotationOffset);

        return (
          <g key={sign.name}>
            <line
              x1={p1.x} y1={p1.y}
              x2={p2.x} y2={p2.y}
              className="astro-zodiac-line"
            />
            <text
              x={glyphPos.x}
              y={glyphPos.y}
              className={`astro-zodiac-glyph ${sign.element.toLowerCase()}`}
            >
              {sign.emoji}
            </text>
          </g>
        );
      })}
    </g>
  );
};
