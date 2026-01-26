import React, { useMemo } from 'react';
import { useChart } from './AstroChart';
import { resolveStackedCollisions } from '../utils/collision_stacked';
import { polarToCartesian } from '../utils/geometry';
import { BodyId } from '@astrologer/astro-core';
import { clsx } from 'clsx';
import { MarkerRenderer, RadialMarker } from './Markers';
import { PlanetSymbol } from './PlanetSymbol';

function getBodyClass(id: string): string {
    return 'astro-planet-' + id.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

export interface StackedPlanetRingProps {
    symbolStartRadius: number; 
    orbitStep?: number; 
    tickStartRadius: number;
    tickLength?: number;
    maxTracks?: number;
    includeBodies?: BodyId[];
    className?: string;
    dataSource?: 'primary' | 'secondary';
    renderMarker?: MarkerRenderer;
}

export const StackedPlanetRing: React.FC<StackedPlanetRingProps> = ({
  symbolStartRadius,
  orbitStep = 18,
  tickStartRadius,
  tickLength = 10,
  maxTracks = 2,
  includeBodies,
  className,
  dataSource = 'primary',
  renderMarker = RadialMarker
}) => {
  const { data, secondaryData, cx, cy, rotationOffset } = useChart();
  
  const sourceData = dataSource === 'secondary' && secondaryData ? secondaryData : data;
  
  const planets = useMemo(() => {
    let bodies = sourceData.bodies;
    if (includeBodies) {
        bodies = bodies.filter(b => includeBodies.includes(b.id));
    }
    return bodies;
  }, [sourceData, includeBodies]);

  const adjustedPlanets = useMemo(() => {
    return resolveStackedCollisions(planets, 6, maxTracks);
  }, [planets, maxTracks]);

  return (
    <g className={clsx("astro-stacked-planet-ring", className)}>
      {adjustedPlanets.map(adj => {
        const planet = planets.find(p => p.id === adj.id)!;
        const planetClass = getBodyClass(planet.id);

        const r = symbolStartRadius - (adj.radialOffset * orbitStep);
        const symPos = polarToCartesian(cx, cy, r, adj.adjustedLongitude, rotationOffset);
        
        const markerStartPos = polarToCartesian(cx, cy, tickStartRadius, adj.originalLongitude, rotationOffset);
        
        const tick = renderMarker(markerStartPos, symPos, tickLength, { x: cx, y: cy });

        return (
          <g key={planet.id} className={planetClass}>
            {/* Tick */}
            {tick}
            
            {/* Symbol */}
            <PlanetSymbol 
                planet={planet} 
                x={symPos.x} 
                y={symPos.y} 
            />
          </g>
        );
      })}
    </g>
  );
};
