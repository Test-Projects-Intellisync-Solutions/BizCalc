import React from 'react';

interface BarChartProps {
  data: number[];
  width?: number;
  height?: number;
  barColor?: string;
  barWidth?: number;
  barGap?: number;
  [key: string]: any;
}

const BarChart: React.FC<BarChartProps> = ({
  data = [],
  width = 120,
  height = 40,
  barColor = 'currentColor',
  barWidth = 6,
  barGap = 2,
  ...props
}) => {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1; // Avoid division by zero
  
  const availableWidth = width - (barWidth + barGap) * data.length + barGap;
  const barSpacing = availableWidth / (data.length - 1) + barWidth + barGap;

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox={`0 0 ${width} ${height}`}
      className="inline-block align-middle"
      {...props}
    >
      {data.map((value, index) => {
        const barHeight = ((value - min) / range) * height;
        const x = index * barSpacing;
        const y = height - barHeight;
        
        return (
          <rect
            key={index}
            x={x}
            y={y}
            width={barWidth}
            height={barHeight}
            fill={barColor}
            rx={1}
            ry={1}
          />
        );
      })}
    </svg>
  );
};

export { BarChart };
export default BarChart;
