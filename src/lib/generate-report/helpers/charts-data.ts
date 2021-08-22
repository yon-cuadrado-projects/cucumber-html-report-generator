import type * as Models from '../../models/models';
import type { ChartData } from 'chart.js';

export class ChartsData{
  public suite: Models.ExtendedReport;

  public constructor( suite: Models.ExtendedReport ){
    this.suite = suite;
  }

  public dataFeatures = ( suite: Models.ExtendedReport ): ChartData => ( {
    datasets: [ {
      backgroundColor: [
        '#228B22',
        '#E74C3C',
        '#FFD119',
        '#3498DB',
        '#b73122',
        '#F39C12',
        '#9b59b6'
      ],
      data: [
        suite.results.features.passed,
        suite.results.features.failed,
        suite.results.features.pending ,
        suite.results.features.skipped ,
        suite.results.features.ambiguous ,
        suite.results.features.undefined,
        suite.results.features.various ],
    } ],
    labels: [
      'Passed',
      'Failed',
      'Pending',
      'Skipped',
      'Ambiguous',
      'Undefined',
      'Various'
    ]
  } );

  public dataScenarios = ( suite: Models.ExtendedReport ): any => ( {
    datasets: [ {
      backgroundColor: [
        '#228B22',
        '#E74C3C',
        '#FFD119',
        '#3498DB',
        '#b73122',
        '#F39C12'
      ],
      data: [
        suite.results.scenarios.passed,
        suite.results.scenarios.failed,
        suite.results.scenarios.pending,
        suite.results.scenarios.skipped,
        suite.results.scenarios.ambiguous,
        suite.results.scenarios.undefined,
      ]
    } ],
    labels: [
      'Passed',
      'Failed',
      'Pending',
      'Skipped',
      'Ambiguous',
      'Undefined'
    ]
  } );

  public dataSteps = ( suiteOrFeature: Models.ExtendedReport| Models.Feature ): any => ( {
    datasets: [ {
      backgroundColor: [
        '#228B22',
        '#E74C3C',
        '#FFD119',
        '#3498DB',
        '#b73122',
        '#F39C12'
      ],
      data: [
        suiteOrFeature.results.steps.passed,
        suiteOrFeature.results.steps.failed,
        suiteOrFeature.results.steps.pending,
        suiteOrFeature.results.steps.skipped,
        suiteOrFeature.results.steps.ambiguous,
        suiteOrFeature.results.steps.undefined
      ]
    } ],
    labels: [
      'Passed',
      'Failed',
      'Pending',
      'Skipped',
      'Ambiguous',
      'Undefined'
    ]
  } );
}
