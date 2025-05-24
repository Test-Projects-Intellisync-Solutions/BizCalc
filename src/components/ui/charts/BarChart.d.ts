import { FC } from 'react';

export interface BarChartProps {
  data: number[];
  width?: number;
  height?: number;
  barColor?: string;
  barWidth?: number;
  barGap?: number;
  [key: string]: any;
}

declare const BarChart: FC<BarChartProps>;

export default BarChart;
