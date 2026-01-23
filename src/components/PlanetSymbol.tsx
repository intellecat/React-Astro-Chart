import React from 'react';
import { CelestialPosition, BodyId } from '@astrologer/astro-core';

export const UNICODE_MAP: Record<string, string> = {
  [BodyId.Sun]: '☉', [BodyId.Moon]: '☽', [BodyId.Mercury]: '☿', [BodyId.Venus]: '♀', [BodyId.Mars]: '♂',
  [BodyId.Jupiter]: '♃', [BodyId.Saturn]: '♄', [BodyId.Uranus]: '♅', [BodyId.Neptune]: '♆', [BodyId.Pluto]: '♇',
  [BodyId.Chiron]: '⚷', [BodyId.MeanNode]: '☊', [BodyId.TrueNode]: '☊', [BodyId.SouthNode]: '☋',
  [BodyId.LilithMean]: '⚸', [BodyId.LilithTrue]: '⚸', [BodyId.ParsFortunae]: '⊗',
  [BodyId.Vertex]: 'Vx', [BodyId.AntiVertex]: 'Av',
};

export interface PlanetSymbolProps {
  planet: CelestialPosition;
  x: number;
  y: number;
  className?: string;
  showRetrograde?: boolean;
}

export const PlanetSymbol: React.FC<PlanetSymbolProps> = ({
  planet,
  x,
  y,
  className = "astro-planet-symbol",
  showRetrograde = true
}) => {
  const char = UNICODE_MAP[planet.id] || '?';

  return (
    <g className="astro-planet-symbol-group">
      <text x={x} y={y} className={className}>
        {char}
      </text>
      
      {/* m/t indicators */}
      {(planet.id.includes('Mean') || planet.id.includes('True')) && (
        <text 
          x={x + 8} y={y - 8} 
          className="astro-planet-indicator"
        >
          {planet.id.includes('Mean') ? 'm' : 't'}
        </text>
      )}

      {/* Retrograde Indicator (r) */}
      {showRetrograde && planet.isRetrograde && (
        <text 
          x={x + 6} y={y + 2} 
          className="astro-planet-retrograde"
          style={{ fontSize: '0.6em', dominantBaseline: 'hanging' }}
        >
          r
        </text>
      )}
    </g>
  );
};
