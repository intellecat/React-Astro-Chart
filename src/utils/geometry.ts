/**
 * Geometry and Coordinate Transformation Utilities for Astrological Charts.
 * 
 * Standard convention:
 * - 0 degrees (Aries) starts at the East (Right/3 o'clock).
 * - Zodiac signs progress Counter-Clockwise.
 * - In most Western charts, the Ascendant is fixed at the West (Left/9 o'clock).
 */

export interface Point {
  x: number;
  y: number;
}

/**
 * Converts degrees to radians.
 */
export function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Normalizes an angle to be within [0, 360).
 */
export function normalizeAngle(angle: number): number {
  return (angle + 360) % 360;
}

/**
 * Calculates the rotation offset required to put the Ascendant on the Left (180 deg).
 * SVG 0 deg is at 3 o'clock. 180 deg is at 9 o'clock.
 */
export function getAscendantOffset(ascDegree: number): number {
  return 180 - ascDegree;
}

/**
 * Translates a polar coordinate to SVG Cartesian coordinates.
 * 
 * @param cx Center X
 * @param cy Center Y
 * @param radius Radius
 * @param angleInDegrees Astrological angle (Counter-Clockwise)
 * @param rotationOffset Global rotation (to fix Ascendant at 180)
 */
export function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleInDegrees: number,
  rotationOffset: number = 0
): Point {
  // Add rotation offset and normalize
  const finalAngle = normalizeAngle(angleInDegrees + rotationOffset);
  
  // Note: Standard Math.cos/sin uses Clockwise for Y if we don't invert.
  // In SVG, Y increases downwards.
  // To make it Counter-Clockwise (astrological standard):
  // x = cx + r * cos(theta)
  // y = cy - r * sin(theta)
  const rad = toRad(finalAngle);
  
  return {
    x: cx + radius * Math.cos(rad),
    y: cy - radius * Math.sin(rad)
  };
}

/**
 * Calculates the SVG Path "d" attribute for a circular arc (zodiac slice).
 */
export function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number,
  rotationOffset: number = 0
): string {
  const start = polarToCartesian(x, y, radius, endAngle, rotationOffset);
  const end = polarToCartesian(x, y, radius, startAngle, rotationOffset);

  const arcSweep = (endAngle - startAngle + 360) % 360 <= 180 ? '0' : '1';

  return [
    'M', start.x, start.y,
    'A', radius, radius, 0, arcSweep, 0, end.x, end.y,
    'L', x, y,
    'L', start.x, start.y
  ].join(' ');
}

/**
 * Generates an SVG path for an annular sector (arc with thickness).
 */
export function describeRingSector(
  cx: number, 
  cy: number, 
  innerR: number, 
  outerRadius: number, 
  startAngle: number, 
  endAngle: number, 
  rotationOffset: number
): string {
    const outerStart = polarToCartesian(cx, cy, outerRadius, startAngle, rotationOffset);
    const outerEnd = polarToCartesian(cx, cy, outerRadius, endAngle, rotationOffset);
    const innerStart = polarToCartesian(cx, cy, innerR, startAngle, rotationOffset);
    const innerEnd = polarToCartesian(cx, cy, innerR, endAngle, rotationOffset);

    const largeArc = (endAngle - startAngle) <= 180 ? 0 : 1;

    // Sweep 0 for CCW (Outer), 1 for CW (Inner)
    return [
        `M ${outerStart.x} ${outerStart.y}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArc} 0 ${outerEnd.x} ${outerEnd.y}`,
        `L ${innerEnd.x} ${innerEnd.y}`,
        `A ${innerR} ${innerR} 0 ${largeArc} 1 ${innerStart.x} ${innerStart.y}`,
        `Z`
    ].join(" ");
}
