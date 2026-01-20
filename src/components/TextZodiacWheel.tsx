import React, { useId } from 'react';
import { useChart } from './AstroChart';
import { ZODIAC_SIGNS } from '@astrologer/astro-core';
import { polarToCartesian, describeRingSector, normalizeAngle } from '../utils/geometry';

export interface TextZodiacWheelProps {
  outerRadius: number;
  innerRadius: number;
  className?: string;
  fontSize?: number;
}

// Helper to describe a simple arc path (stroke)
// sweep: 0 for CCW, 1 for CW (in SVG coords, 1 is positive-angle direction)
// Note: polarToCartesian uses inverted Y, so increasing angle = visual CCW.
// Visual CCW (Start->End) -> Sweep 0.
// Visual CW (End->Start) -> Sweep 1.
function describeArcStroke(cx: number, cy: number, r: number, startAngle: number, endAngle: number, reverse: boolean): string {
  const p1 = polarToCartesian(cx, cy, r, reverse ? endAngle : startAngle, 0);
  const p2 = polarToCartesian(cx, cy, r, reverse ? startAngle : endAngle, 0);
  
  // Sweep: 
  // !reverse (CCW): Start->End. Visual CCW. SVG Sweep 0.
  // reverse (CW): End->Start. Visual CW. SVG Sweep 1.
  const sweep = reverse ? 1 : 0;
  
  return [
    'M', p1.x, p1.y,
    'A', r, r, 0, 0, sweep, p2.x, p2.y
  ].join(' ');
}

export const TextZodiacWheel: React.FC<TextZodiacWheelProps> = ({
  outerRadius,
  innerRadius,
  className,
  fontSize
}) => {
  const { cx, cy, rotationOffset } = useChart();
  const textRadius = (outerRadius + innerRadius) / 2;
  const baseId = useId();

  return (
    <g className={`astro-text-zodiac-wheel ${className || ''}`} style={fontSize ? { fontSize: `${fontSize}px` } : undefined}>
      {/* 1. Black Background Ring */}
      <path
        d={describeRingSector(cx, cy, innerRadius, outerRadius, 0, 359.99, 0)}
        className="astro-zodiac-ring"
      />

      {/* 2. Signs and Separators */}
      {ZODIAC_SIGNS.map((sign, i) => {
        const startAngle = i * 30;
        const endAngle = (i + 1) * 30;
        const midAngle = startAngle + 15;
        
        // Calculate visual angle on screen
        const screenAngle = normalizeAngle(midAngle + rotationOffset);
        
        // Determine direction based on visual quadrants to match Co-Star style.
        // CW (reverse=true): Top, Top-Left, Top-Right, Right.
        // CCW (reverse=false): Left, Bottom-Left, Bottom, Bottom-Right.
        // Switch points determined empirically: ~165 deg and ~345 deg.
        const isCCW = screenAngle >= 165 && screenAngle < 345;
        const reverse = !isCCW;

        const pathId = `${baseId}-path-${i}`;
        
        // Path adjusted for rotation
        const arcPath = describeArcStroke(
            cx, cy, textRadius, 
            startAngle + rotationOffset, 
            endAngle + rotationOffset, 
            reverse
        );
        
        // Separator Line
        const sepP1 = polarToCartesian(cx, cy, outerRadius, startAngle, rotationOffset);
        const sepP2 = polarToCartesian(cx, cy, innerRadius, startAngle, rotationOffset);

        return (
          <g key={sign.name}>
             <defs>
                 <path id={pathId} d={arcPath} />
             </defs>
          
            {/* White Separator */}
            <line
              x1={sepP1.x} y1={sepP1.y}
              x2={sepP2.x} y2={sepP2.y}
              stroke="#ffffff"
              strokeWidth="1"
            />
            
            {/* Curved Text Label */}
            <text className="astro-zodiac-label" dy={1}>
               <textPath 
                 href={`#${pathId}`} 
                 startOffset="50%" 
                 textAnchor="middle"
                 dominantBaseline="middle" 
               >
                 {sign.name}
               </textPath>
            </text>
          </g>
        );
      })}
    </g>
  );
};