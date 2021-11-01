import * as lodash from 'lodash';
import type { BeforeOrAfterResults, ScenarioResults } from './results';
import type { ObjectID } from 'bson';
import type { Step } from './step';
import { overviewInitializer } from './results';

export interface Tag {
  name: string;
  location?: {
    line?: number;
    column?: number;
  };
}

export interface Scenario {
  _id: any;
  id: string;
  featureId?: ObjectID;
  keyword: string;
  line?: number;
  name: string;
  steps?: Step[] | null;
  before?: BeforeOrAfter;
  after?: BeforeOrAfter;
  tags: Tag[];
  type: string;
  results: ScenarioResults;
  isFirstScenarioOutline: boolean;
  examples?: string[][];
  reportId?: ObjectID;
  stepsId?: ObjectID;
}

export interface BeforeOrAfter {
  results: BeforeOrAfterResults;
  steps: Step[];
}

export interface TableHeader {
  cells: string[];
}

export const beforeOrAfterInitializer = (): BeforeOrAfter =>
  lodash.cloneDeep( {
    results: {
      overview: overviewInitializer(),
    },
    steps: <Step[]>[],
  } );
