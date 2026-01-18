import { CelestialPosition } from '@astrologer/astro-core';

function clockwiseDist(d1: number, d2: number): number {
    return (d2 - d1 + 360) % 360;
}

export interface SynastryAdjustedPosition {
  id: string;
  originalLongitude: number;
  adjustedLongitude: number;
  radialOffset: number; // 0 = normal, 1 = inner track
}

export function resolveSynastryCollisions(
  planets: CelestialPosition[],
  minDistance: number = 6
): SynastryAdjustedPosition[] {
  if (planets.length === 0) return [];

  let data = [...planets]
    .sort((a, b) => a.longitude - b.longitude)
    .map(p => ({
        id: p.id,
        original: p.longitude,
        current: p.longitude,
        track: 0
    }));

  const n = data.length;

  for (let i = 1; i < n; i++) {
      const prev = data[i-1];
      const curr = data[i];
      
      const dist = clockwiseDist(prev.current, curr.current);
      if (dist < minDistance) {
          if (prev.track === 0) {
              curr.track = 1;
          } else {
              curr.track = 0;
          }
      }
  }
  
  // Wrap check
  const last = data[n-1];
  const first = data[0];
  if (clockwiseDist(last.current, first.current) < minDistance) {
      if (last.track === first.track) {
          last.track = (first.track + 1) % 2;
      }
  }

  // Lateral Spreading
  for (let t = 0; t <= 1; t++) {
      const trackIndices = data.map((_, i) => i).filter(i => data[i].track === t);
      
      const iterations = 50;
      for (let iter = 0; iter < iterations; iter++) {
          let moved = false;
          if (trackIndices.length > 1) {
              for (let k = 0; k < trackIndices.length; k++) {
                  const i = trackIndices[k];
                  const j = trackIndices[(k + 1) % trackIndices.length]; 
                  
                  const p1 = data[i];
                  const p2 = data[j];
                  
                  const dist = clockwiseDist(p1.current, p2.current);
                  
                  if (dist < minDistance - 0.1) {
                      const overlap = minDistance - dist;
                      const shift = overlap / 2 + 0.05;
                      
                      p1.current = (p1.current - shift + 360) % 360;
                      p2.current = (p2.current + shift + 360) % 360;
                      moved = true;
                  }
              }
          }
          if (!moved) break;
      }
  }

  return data.map(d => ({
    id: d.id,
    originalLongitude: d.original,
    adjustedLongitude: d.current,
    radialOffset: d.track
  }));
}
