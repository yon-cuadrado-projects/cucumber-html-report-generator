import * as lodash from 'lodash';
import type * as mongoose from 'mongoose';
import type { BeforeOrAfterResults, ScenarioResults } from './results';
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
  featureId?: mongoose.Types.ObjectId;
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
  reportId?: mongoose.Types.ObjectId;
  stepsId?: mongoose.Types.ObjectId;
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
