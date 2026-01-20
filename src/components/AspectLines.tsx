import React, { useMemo } from 'react';
import { useChart } from './AstroChart';
import { polarToCartesian } from '../utils/geometry';
import { AspectType, calculateDualAspects } from '@astrologer/astro-core';
import { clsx } from 'clsx';

const ASPECT_CLASS_SUFFIX: Record<AspectType, string> = {
  [AspectType.Conjunction]: 'conj',
  [AspectType.Opposition]: 'opp',
  [AspectType.Trine]: 'trine',
  [AspectType.Square]: 'square',
  [AspectType.Sextile]: 'sextile'
};

const ASPECT_GLYPHS: Record<AspectType, string> = {
  [AspectType.Conjunction]: '☌',
  [AspectType.Opposition]: '☍',
  [AspectType.Trine]: '△',
  [AspectType.Square]: '□',
  [AspectType.Sextile]: '⚹'
};

export interface AspectLinesProps {
  radius?: number;
  showSymbol?: boolean;
  className?: string;
  dataSource?: 'primary' | 'combined';
  showTicks?: boolean;
  tickLength?: number;
}

export const AspectLines: React.FC<AspectLinesProps> = ({
  radius,
  showSymbol = false,
  className,
  dataSource = 'primary',
  showTicks = false,
  tickLength = 5
}) => {
  const { data, secondaryData, cx, cy, radius: mainRadius, rotationOffset } = useChart();
  const r = radius ?? mainRadius * 0.4;

  const aspects = useMemo(() => {
    if (dataSource === 'combined' && secondaryData) {
        return calculateDualAspects(data.bodies, secondaryData.bodies);
    }
    return data.aspects;
  }, [data, secondaryData, dataSource]);

  return (
    <g className={clsx("astro-aspect-lines", className)}>
      {aspects.map((asp, i) => {
        const p1 = polarToCartesian(cx, cy, r, asp.body1.longitude, rotationOffset);
        const p2 = polarToCartesian(cx, cy, r, asp.body2.longitude, rotationOffset);
        
        const typeClass = ASPECT_CLASS_SUFFIX[asp.type] || 'minor';
        
        // Ticks
        let ticks = null;
        if (showTicks) {
            const p1Out = polarToCartesian(cx, cy, r + tickLength, asp.body1.longitude, rotationOffset);
            const p2Out = polarToCartesian(cx, cy, r + tickLength, asp.body2.longitude, rotationOffset);
            ticks = (
                <>
                    <line x1={p1.x} y1={p1.y} x2={p1Out.x} y2={p1Out.y} className="astro-aspect-tick" />
                    <line x1={p2.x} y1={p2.y} x2={p2Out.x} y2={p2Out.y} className="astro-aspect-tick" />
                </>
            );
        }

        return (
          <g key={i} className={`astro-aspect-${typeClass}`}>
            <line 
                x1={p1.x} y1={p1.y} 
                x2={p2.x} y2={p2.y} 
                className="astro-aspect-line" 
            />
            {ticks}
            {showSymbol && (
                <text 
                    x={(p1.x + p2.x) / 2} 
                    y={(p1.y + p2.y) / 2} 
                    className="astro-aspect-symbol"
                >
                    {ASPECT_GLYPHS[asp.type]}
                </text>
            )}
          </g>
        );
      })}
    </g>
  );
};
