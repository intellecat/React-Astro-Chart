import { CelestialPosition, HouseCusp } from '@astrologer/astro-core';

export function degreeDiff(d1: number, d2: number): number {
  let diff = Math.abs(d1 - d2);
  if (diff > 180) diff = 360 - diff;
  return diff;
}

function norm(d: number): number {
    return (d + 360) % 360;
}

function clockwiseDist(d1: number, d2: number): number {
    return (d2 - d1 + 360) % 360;
}

export interface AdjustedPosition {
  id: string;
  originalLongitude: number;
  adjustedLongitude: number;
}

/**
 * Final Robust Global Resolver.
 */
export function resolveCollisions(
  planets: CelestialPosition[],
  houses: HouseCusp[],
  minDistance: number = 8,
  houseBuffer: number = 3.5,
  avoidHouses: boolean = true // New flag
): AdjustedPosition[] {
  if (planets.length === 0) return [];

  // 1. Define Order
  const data = [...planets]
    .sort((a, b) => a.longitude - b.longitude)
    .map(p => ({ id: p.id, original: p.longitude, current: p.longitude }));

  const n = data.length;
  const iterations = 100;

  for (let iter = 0; iter < iterations; iter++) {
    let moved = false;

    // Repulsion
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const dist = clockwiseDist(data[i].current, data[j].current);
      if (dist < minDistance - 0.001) {
        const overlap = minDistance - dist;
        const shift = overlap / 2 + 0.05;
        data[i].current = norm(data[i].current - shift);
        data[j].current = norm(data[j].current + shift);
        moved = true;
      }
    }

    // Cusp Buffer (Conditional)
    if (avoidHouses) {
        for (let i = 0; i < n; i++) {
            for (const h of houses) {
                let diff = Math.abs(data[i].current - h.longitude);
                if (diff > 180) diff = 360 - diff;
                if (diff < houseBuffer) {
                    const isCW = clockwiseDist(h.longitude, data[i].current) < 180;
                    const shift = houseBuffer - diff + 0.1;
                    data[i].current = norm(isCW ? data[i].current + shift : data[i].current - shift);
                    moved = true;
                }
            }
        }
    }

    // STRICT Order Integrity check
    for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        const dist = clockwiseDist(data[i].current, data[j].current);
        if (dist > 300) { 
            data[j].current = norm(data[i].current + minDistance);
            moved = true;
        }
    }

    if (!moved) break;
  }

  return data.map(d => ({
    id: d.id,
    originalLongitude: d.original,
    adjustedLongitude: d.current
  }));
}
