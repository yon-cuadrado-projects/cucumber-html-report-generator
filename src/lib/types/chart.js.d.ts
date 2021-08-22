import type Chart from 'chart.js';

declare module 'chart.js'{
  export interface ChartAnimationOptions {
    chart?: Chart;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface ElementOptionsByType<TType>{
    text?: string;
  }

  export interface ChartDataSets{
    labels?: string[];
  }

  export type AnyObject = Record<string, unknown>;
}
