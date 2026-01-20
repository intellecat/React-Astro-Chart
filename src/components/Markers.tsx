import React from 'react';
import { Point } from '../utils/geometry';

export type MarkerRenderer = (start: Point, target: Point, length: number, center: Point) => React.ReactNode;

/**
 * Default implementation: A line pointing from start towards the target.
 * Slopes if the target is laterally shifted (collision resolution).
 */
export const LineMarker: MarkerRenderer = (start, target, length) => {
  const dx = target.x - start.x;
  const dy = target.y - start.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  if (dist === 0) return null;

  const ratio = length / dist;

  const endX = start.x + dx * ratio;
  const endY = start.y + dy * ratio;

  return (
    <line 
      x1={start.x} y1={start.y} 
      x2={endX} y2={endY} 
      className="astro-marker" 
    />
  );
};

/**
 * Draws a marker radially from the start point towards (or away from) the center,
 * ignoring the angular shift of the target.
 */
export const RadialMarker: MarkerRenderer = (start, target, length, center) => {
  const startDist = Math.hypot(start.x - center.x, start.y - center.y);
  const targetDist = Math.hypot(target.x - center.x, target.y - center.y);
  
  // Angle from center to start point
  const angle = Math.atan2(start.y - center.y, start.x - center.x);
  
  // Determine direction: -1 (inwards) if target is closer to center, 1 (outwards) otherwise
  const direction = targetDist < startDist ? -1 : 1;
  
  const endX = start.x + (Math.cos(angle) * length * direction);
  const endY = start.y + (Math.sin(angle) * length * direction);
  
  return (
    <line 
      x1={start.x} y1={start.y} 
      x2={endX} y2={endY} 
      className="astro-marker" 
    />
  );
};
