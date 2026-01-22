import React, { useMemo } from 'react';
import { useChart } from './AstroChart';
import { resolveCollisions } from '../utils/collision';
import { polarToCartesian } from '../utils/geometry';
import { BodyId, ZODIAC_SIGNS } from '@astrologer/astro-core';
import { clsx } from 'clsx';
import { MarkerRenderer, LineMarker } from './Markers';

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

export interface PlanetRingProps {
  radius?: number;
  symbolRadius?: number;
  degreeRadius?: number;
  tickRadius?: number;
  tickLength?: number;
  showMinutes?: boolean;
  showZodiacSign?: boolean;
  avoidHouses?: boolean;
  className?: string;
  onPlanetClick?: (planetId: string) => void;
  dataSource?: 'primary' | 'secondary';
  includeBodies?: BodyId[];
  renderMarker?: MarkerRenderer;
}

export const PlanetRing: React.FC<PlanetRingProps> = ({
  symbolRadius,
  degreeRadius,
  tickRadius,
  tickLength = 10,
  showMinutes = false,
  showZodiacSign = false,
  avoidHouses = true,
  className,
  onPlanetClick,
  dataSource = 'primary',
  includeBodies,
  renderMarker = LineMarker
}) => {
  const { data, secondaryData, cx, cy, radius: mainRadius, rotationOffset } = useChart();
  const sourceData = dataSource === 'secondary' && secondaryData ? secondaryData : data;

  // Sensible Defaults
  // Default to Natal style (inward from main radius)
  const symR = symbolRadius ?? mainRadius - 65;
  const degR = degreeRadius ?? mainRadius - 90;
  const tickR = tickRadius ?? mainRadius - 40;
  
  // Resolve Collisions
  const adjustedPlanets = useMemo(() => {
    let bodies = sourceData.bodies;
    if (includeBodies) {
        bodies = bodies.filter(b => includeBodies.includes(b.id));
    }
    
    return resolveCollisions(
      bodies, 
      avoidHouses ? sourceData.houses : [], 
      6, 
      4, 
      avoidHouses
    );
  }, [sourceData, avoidHouses, includeBodies]);

  return (
    <g className={clsx("astro-planet-ring", className)}>
      {adjustedPlanets.map(adj => {
        const planet = sourceData.bodies.find(p => p.id === adj.id)!;
        const char = UNICODE_MAP[planet.id] || '?';
        const planetClass = getBodyClass(planet.id);

        const symPos = polarToCartesian(cx, cy, symR, adj.adjustedLongitude, rotationOffset);
        const tickStart = polarToCartesian(cx, cy, tickR, adj.originalLongitude, rotationOffset);
        
        // Marker element using renderer
        const tick = renderMarker(tickStart, symPos, tickLength, { x: cx, y: cy });

        // Degree & Minute & Sign
        const degPos = polarToCartesian(cx, cy, degR, adj.adjustedLongitude, rotationOffset);
        
        // Optional Sign
        let signEl = null;
        let minuteBaseR = degR;
        if (showZodiacSign) {
            const signData = ZODIAC_SIGNS.find(z => z.name === planet.sign);
            if (signData) {
                // Heuristic: Place sign further in/out based on relative radii
                const signR = degR > symR ? degR + 18 : degR - 18;
                minuteBaseR = signR;
                const signPos = polarToCartesian(cx, cy, signR, adj.adjustedLongitude, rotationOffset);
                signEl = (
                    <text x={signPos.x} y={signPos.y} className="astro-planet-zodiac">
                        {signData.emoji}
                    </text>
                );
            }
        }

        // Optional Minute
        let minuteEl = null;
        if (showMinutes) {
            const minVal = Math.floor((planet.degree % 1) * 60);
            const minR = degR > symR ? minuteBaseR + 18 : minuteBaseR - 18;
            const minPos = polarToCartesian(cx, cy, minR, adj.adjustedLongitude, rotationOffset);
            minuteEl = (
                <text x={minPos.x} y={minPos.y} className="astro-planet-minute">
                    {minVal}'
                </text>
            );
        }

        // m/t indicators
        let indicatorEl = null;
        if (planet.id.includes('Mean') || planet.id.includes('True')) {
            const ind = planet.id.includes('Mean') ? 'm' : 't';
            indicatorEl = (
                <text x={symPos.x + 8} y={symPos.y - 8} className="astro-planet-indicator">
                    {ind}
                </text>
            );
        }

        return (
          <g 
            key={planet.id} 
            className={planetClass} 
            onClick={() => onPlanetClick?.(planet.id)}
            style={{ cursor: onPlanetClick ? 'pointer' : 'default' }}
          >
            {/* Tick */}
            {tick}
            
            {/* Symbol */}
            <text x={symPos.x} y={symPos.y} className="astro-planet-symbol">
                {char}
            </text>
            {indicatorEl}

            {/* Degree */}
            <text x={degPos.x} y={degPos.y} className="astro-planet-degree">
                {Math.floor(planet.degree)}°
            </text>
            
            {signEl}
            {minuteEl}
          </g>
        );
      })}
    </g>
  );
};