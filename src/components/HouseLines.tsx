import React from 'react';
import { useChart } from './AstroChart';
import { polarToCartesian } from '../utils/geometry';
import { clsx } from 'clsx';

export interface HouseLinesProps {
  radius?: number;     // Inner radius (start of line)
  endRadius?: number;  // Outer radius (end of line)
  showLabels?: boolean;
  labelRadius?: number;
  angleLabelRadius?: number;
  className?: string;
  dataSource?: 'primary' | 'secondary';
}

export const HouseLines: React.FC<HouseLinesProps> = ({
  radius,
  endRadius,
  showLabels = true,
  labelRadius,
  angleLabelRadius,
  className,
  dataSource = 'primary'
}) => {
  const { data, secondaryData, cx, cy, radius: mainRadius, rotationOffset } = useChart();
  const sourceData = dataSource === 'secondary' && secondaryData ? secondaryData : data;

  const startR = radius ?? mainRadius * 0.5;
  const endR = endRadius ?? mainRadius - 40;
  const textR = labelRadius ?? startR - 15;
  const angleR = angleLabelRadius ?? mainRadius * 0.45;

  return (
    <g className={clsx("astro-house-lines", className)}>
      <circle cx={cx} cy={cy} r={startR} className="astro-house-ring" />
      
      {sourceData.houses.map((house, i) => {
        const nextHouse = sourceData.houses[(i + 1) % 12];
        const isAngle = [1, 4, 7, 10].includes(house.house);
        
        const inner = polarToCartesian(cx, cy, startR, house.longitude, rotationOffset);
        const outer = polarToCartesian(cx, cy, endR, house.longitude, rotationOffset);

        // Angle Labels
        let angleLabel = null;
        if (showLabels && isAngle) {
            let label = '';
            if (house.house === 1) label = 'ASC';
            else if (house.house === 4) label = 'IC';
            else if (house.house === 7) label = 'DSC';
            else if (house.house === 10) label = 'MC';

            const pos = polarToCartesian(cx, cy, angleR, house.longitude, rotationOffset);
            const degPos = polarToCartesian(cx, cy, angleR - 12, house.longitude, rotationOffset);
            
            angleLabel = (
                <g>
                    <text x={pos.x} y={pos.y} className="astro-angle-label">{label}</text>
                    <text x={degPos.x} y={degPos.y} className="astro-angle-degree">{Math.floor(house.degree)}°</text>
                </g>
            );
        }

        // House Number
        let numLabel = null;
        if (showLabels) {
            let mid = (house.longitude + nextHouse.longitude) / 2;
            if (nextHouse.longitude < house.longitude) mid += 180;
            const pos = polarToCartesian(cx, cy, textR, mid, rotationOffset);
            numLabel = (
                <text x={pos.x} y={pos.y} className="astro-house-label">{house.house}</text>
            );
        }

        return (
          <g key={house.house}>
            <line 
                x1={inner.x} y1={inner.y} 
                x2={outer.x} y2={outer.y} 
                className={clsx("astro-house-line", isAngle && "angle")} 
            />
            {angleLabel}
            {numLabel}
          </g>
        );
      })}
    </g>
  );
};
