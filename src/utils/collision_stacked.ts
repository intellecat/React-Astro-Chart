import { CelestialPosition } from '@astrologer/astro-core';

function clockwiseDist(d1: number, d2: number): number {
    return (d2 - d1 + 360) % 360;
}

export interface StackedAdjustedPosition {
  id: string;
  originalLongitude: number;
  adjustedLongitude: number;
  radialOffset: number; // 0 = outer track, 1, 2... = inner tracks
}

/**
 * Resolves collisions between planets by distributing them across multiple radial tracks.
 * 
 * @param planets List of celestial positions
 * @param minDistance Minimum angular distance between planets on the same track
 * @param maxTracks Maximum number of radial tracks to use
 */
export function resolveStackedCollisions(
  planets: CelestialPosition[],
  minDistance: number = 6,
  maxTracks: number = 2
): StackedAdjustedPosition[] {
  if (planets.length === 0) return [];
  if (maxTracks < 1) maxTracks = 1;

  let data = [...planets]
    .sort((a, b) => a.longitude - b.longitude)
    .map(p => ({
        id: p.id,
        original: p.longitude,
        current: p.longitude,
        track: 0
    }));

  const lastInTrack: (number | null)[] = new Array(maxTracks).fill(null);

  // Pass 1: Greedy track assignment
  data.forEach((p) => {
    let assigned = false;
    for (let t = 0; t < maxTracks; t++) {
        const lastPos = lastInTrack[t];
        if (lastPos === null || clockwiseDist(lastPos, p.current) >= minDistance) {
            p.track = t;
            lastInTrack[t] = p.current;
            assigned = true;
            break;
        }
    }
    
    if (!assigned) {
        // Fallback: find track with maximum distance to its last element
        let maxDist = -1;
        let bestTrack = 0;
        for (let t = 0; t < maxTracks; t++) {
            const d = lastInTrack[t] !== null ? clockwiseDist(lastInTrack[t]!, p.current) : 361;
            if (d > maxDist) {
                maxDist = d;
                bestTrack = t;
            }
        }
        p.track = bestTrack;
        lastInTrack[bestTrack] = p.current;
    }
  });

  // Pass 2: Lateral Spreading per track
  for (let t = 0; t < maxTracks; t++) {
      const trackIndices = data.map((_, i) => i).filter(i => data[i].track === t);
      if (trackIndices.length <= 1) continue;
      
      const iterations = 50;
      for (let iter = 0; iter < iterations; iter++) {
          let moved = false;
          for (let k = 0; k < trackIndices.length; k++) {
              const i = trackIndices[k];
              const nextK = (k + 1) % trackIndices.length;
              const j = trackIndices[nextK]; 
              
              const p1 = data[i];
              const p2 = data[j];
              
              const dist = clockwiseDist(p1.current, p2.current);
              
              if (dist < minDistance - 0.01) {
                  const overlap = minDistance - dist;
                  const shift = overlap / 2 + 0.01;
                  
                  p1.current = (p1.current - shift + 360) % 360;
                  p2.current = (p2.current + shift + 360) % 360;
                  moved = true;
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
