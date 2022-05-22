import type { ChartData, ChartOptions, Plugin } from 'chart.js';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

export class HtmlScriptsFunctions {
  public document: Document = <Document>{};
  public theme: string;

  public constructor( theme: string ) {
    this.theme = theme;
  }

  public graphOptions = (): ChartOptions => <ChartOptions>{
    responsive: true,
    elements: {
    },
    legend: {
      display: false
    },
    maintainAspectRatio: true,
    plugins: {
      title: {
        display: true,
        text: 'Chart',
        color: this.theme === 'Dark' ? '#73879c' : '#73879c',
        padding: {
          bottom: 20,
          top: 3
        }
      },
      legend: {
        display: false
      },
      datalabels: {
        color: '#ffffff',
        formatter: ( value: string ): string | null => {
          return Number( value ) > 0 ? value : '';
        }
      }
    },
  };

  public writeValueInCenter = (): Plugin => <Plugin>{
    id: 'paint_number_in_center',
    beforeDraw: ( chart: Chart ): void => {
      const { width } = chart;
      const { height } = chart;
      const ctx = chart.ctx;
      const textX = Math.round( ( width - ctx.measureText( chart.options.elements!.text! ).width ) / 2 );
      const textY = ( height + chart.chartArea.top ) / 2;

      ctx.fillStyle = this.theme === 'Dark' ? '#73879c' : '#73879c';
      ctx.fillText( chart.options.elements!.text!, textX, textY );
      ctx.save();
    }
  };

  public generateChart = ( chartName: string, chartData: ChartData, graphOptions: ChartOptions, chartCenterValue: string ): Chart => {
    const canvas = <HTMLCanvasElement>document.getElementById( chartName );
    const ctx = canvas.getContext( '2d' )!;
    ( graphOptions.elements! ).text = chartCenterValue;

    const chart = new Chart( ctx, {
      data: chartData,
      options: graphOptions,
      plugins: [ this.writeValueInCenter(), ChartDataLabels ],
      type: 'doughnut'
    } );

    return chart;
  };
}
