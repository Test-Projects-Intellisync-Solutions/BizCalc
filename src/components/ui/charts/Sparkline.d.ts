import { FC } from 'react';

export interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  [key: string]: any;
}

declare const Sparkline: FC<SparklineProps>;

export default Sparkline;
