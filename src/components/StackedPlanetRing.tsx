import React, { useMemo } from 'react';
import { useChart } from './AstroChart';
import { resolveSynastryCollisions } from '../utils/collision_synastry';
import { polarToCartesian } from '../utils/geometry';
import { BodyId } from '@astrologer/astro-core';
import { clsx } from 'clsx';
import { MarkerRenderer, RadialMarker } from './Markers';

const UNICODE_MAP: Record<string, string> = {
  [BodyId.Sun]: '☉', [BodyId.Moon]: '☽', [BodyId.Mercury]: '☿', [BodyId.Venus]: '♀', [BodyId.Mars]: '♂',
  [BodyId.Jupiter]: '♃', [BodyId.Saturn]: '♄', [BodyId.Uranus]: '♅', [BodyId.Neptune]: '♆', [BodyId.Pluto]: '♇',
  [BodyId.Chiron]: '⚷', [BodyId.MeanNode]: '☊', [BodyId.TrueNode]: '☊', [BodyId.SouthNode]: '☋',
  [BodyId.LilithMean]: '⚸', [BodyId.LilithTrue]: '⚸', [BodyId.ParsFortunae]: '⊗',
  [BodyId.Vertex]: 'Vx', [BodyId.AntiVertex]: 'Av',
};

function getBodyClass(id: string): string {
    return 'astro-planet-' + id.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

export interface StackedPlanetRingProps {
    symbolStartRadius: number; 
    orbitStep?: number; 
    tickStartRadius: number;
    tickLength?: number;
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
    return resolveSynastryCollisions(planets, 6);
  }, [planets]);

  return (
    <g className={clsx("astro-stacked-planet-ring", className)}>
      {adjustedPlanets.map(adj => {
        const planet = planets.find(p => p.id === adj.id)!;
        const char = UNICODE_MAP[planet.id] || '?';
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
            <text x={symPos.x} y={symPos.y} 
                  fontSize="18"
                  className="astro-planet-symbol">
                {char}
            </text>
            
            {/* Indicator */}
            {(planet.id.includes('Mean') || planet.id.includes('True')) && (
                <text x={symPos.x + 7} y={symPos.y - 7} fontSize="7" className="astro-planet-indicator">
                    {planet.id.includes('Mean') ? 'm' : 't'}
                </text>
            )}
          </g>
        );
      })}
    </g>
  );
};
