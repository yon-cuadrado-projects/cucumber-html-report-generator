import * as lodash from 'lodash';
import type { Metadata } from './feature';
import { Status } from './status';
export interface ModuleResults {
  _id?: any;
  passed: number;
  failed: number;
  undefined: number;
  skipped: number;
  pending: number;
  ambiguous: number;
  total: number;
  passedPercentage: string;
  failedPercentage: string;
  undefinedPercentage: string;
  skippedPercentage: string;
  pendingPercentage: string;
  ambiguousPercentage: string;
  status: Status;
  statusIcon?: string;
  time: string;
  timeInNanoSeconds: number;
}

export interface FeatureModuleResults extends ModuleResults{
  various: number;
  variousPercentage: string;
}

export interface OverviewResults{
  duration: number;
  durationHHMMSS: string;
}

export interface ReportResultsOverview extends OverviewResults{
  _id?: any;
  result: Result[];
  duration: number;
  durationHHMMSS: string;
  metadata?: Metadata[];
  date: Date;
  resultStatusesJoined: string;
}

export interface FeatureResultsOverview extends OverviewResults{
  result: Result[];
}

export interface ScenarioResultsOverview extends OverviewResults{
  status: Status;
  isFirstScenarioOutline?: boolean;
}

export interface StepResultsOverview extends OverviewResults {
  status: Status;
  error_message?: string;
  icon: string;
  title: string;
  color: string;
}

export interface FeatureResults {
  overview: FeatureResultsOverview;
  scenarios: ModuleResults;
  steps: ModuleResults;
}

export interface ScenarioResults {
  overview: ScenarioResultsOverview;
  before: OverviewResults;
  after: OverviewResults;
  steps: ModuleResults;
}

export interface ReportResults {
  overview: ReportResultsOverview;
  features: FeatureModuleResults;
  scenarios: ModuleResults;
  steps: ModuleResults;
}

export interface BeforeOrAfterOverviewResults extends OverviewResults{
  status: Status;
}

export interface BeforeOrAfterResults{
  overview: BeforeOrAfterOverviewResults;
}

export const featureModuleResultsInitializer = (): FeatureModuleResults => lodash.cloneDeep( {
  ambiguous: 0,
  ambiguousPercentage: '',
  failed: 0,
  failedPercentage: '',
  passed: 0,
  passedPercentage: '',
  pending: 0,
  pendingPercentage: '',
  skipped: 0,
  skippedPercentage: '',
  status: Status.passed,
  time: '',
  timeInNanoSeconds: 0,
  total: 0,
  undefined: 0,
  undefinedPercentage: '',
  various: 0,
  variousPercentage: ''
} );

export const moduleResultsInitializer = (): ModuleResults => lodash.cloneDeep( {
  ambiguous: 0,
  ambiguousPercentage: '',
  failed: 0,
  failedPercentage: '',
  passed: 0,
  passedPercentage: '',
  pending: 0,
  pendingPercentage: '',
  skipped: 0,
  skippedPercentage: '',
  status: Status.passed,
  time: '',
  timeInNanoSeconds: 0,
  total: 0,
  undefined: 0,
  undefinedPercentage: '',
} );

export const beforeOrAfterOverviewInitializer = (): OverviewResults => lodash.cloneDeep( {
  duration: 0,
  durationHHMMSS: '',
} );

export const overviewInitializer = (): ScenarioResultsOverview => lodash.cloneDeep( {
  duration: 0,
  durationHHMMSS: '',
  status: Status.passed
} );


export const scenarioResultsInitializer = (): ScenarioResults => lodash.cloneDeep( {
  after: beforeOrAfterOverviewInitializer(),
  before: beforeOrAfterOverviewInitializer(),
  overview: overviewInitializer(),
  steps: moduleResultsInitializer()
} );

export const featureResultsInitializer = (): FeatureResults => lodash.cloneDeep( {
  overview: {
    duration: 0,
    durationHHMMSS: '',
    result: [],
  },
  scenarios: moduleResultsInitializer(),
  steps: moduleResultsInitializer()
} );

export const reportResultsInitializer = (): ReportResults => lodash.cloneDeep( {
  features: featureModuleResultsInitializer(),
  overview: {
    date: new Date(),
    duration: 0,
    durationHHMMSS: '',
    metadata: <Metadata[]>[],
    metadataTitle: '',
    result: <Result[]>[],
    resultStatusesJoined: ''
  },
  scenarios: moduleResultsInitializer(),
  steps: moduleResultsInitializer()
} );

export interface Result{
  status: Status;
  icon: string;
}
