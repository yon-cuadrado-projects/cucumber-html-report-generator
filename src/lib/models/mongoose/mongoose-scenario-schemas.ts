import * as CommonSchemas from './mongoose-common-schemas';
import * as StepChemas from './mongoose-step-schemas';
import type { BeforeOrAfter,Scenario } from '../report/scenario';
import type { Document, Model } from 'mongoose';
import type { ScenarioResults } from '../report/results';
import { Schema } from 'mongoose';

export interface MScenario extends Scenario, Document {
  id: any;
  _id: any;
}
export interface MScenarioResults extends ScenarioResults, Document {}
export interface MBeforeOrAfter extends BeforeOrAfter, Document {}

export const scenarioResultsSchema = new Schema( {
  after: CommonSchemas.overviewResultsSchema,
  before: CommonSchemas.overviewResultsSchema,
  overview: CommonSchemas.overviewResultsSchema,
  steps: { required: false, type: CommonSchemas.overviewResultsSchema } ,
},{
  _id: false,
  id: false,
} );

export const beforeOrAfterSchema = new Schema( {
  results: {
    overview: { required: false, type: CommonSchemas.overviewResultsSchema }
  },
  steps:  { required: false, type: [ StepChemas.stepSchema ] , _id: false, id: false } ,
},{
  _id: false,
  id: false,
} );

export const scenarioTag = new Schema( {
  line: { required: false, type: Number },
  location:{
    column: { required: false, type: Number },
    line: { required: false, type: Number }
  },
  name: { required: false, type: String }
},{
  _id: false,
  id: false,
} );

export const scenarioSchema: Schema<MScenario, Model<MScenario>> = new Schema( {
  after: { required: false, type: beforeOrAfterSchema },
  before: { required: false, type: beforeOrAfterSchema },
  description: { required: false, type: String },
  examples: [ [ { default: undefined, required: false, type: String } ] ],
  featureId: { ref: 'Features', type: Schema.Types.ObjectId },
  id: String,
  isFirstScenarioOutline: { required: false,type: Boolean },
  keyword: { required: false,type: String },
  line: { required: false, type: Number },
  name: { required: false,type: String },
  reportId: Schema.Types.ObjectId,
  results: scenarioResultsSchema,
  stepsId: Schema.Types.ObjectId,
  tags: [ { required: false , type: scenarioTag } ],
  type: { required: false, type: String },
}, {
  toJSON: {
    versionKey: false,
    virtuals: true
  },
  toObject: {
    versionKey: false,
    virtuals: true
  }
} );

scenarioSchema.virtual( 'steps',{
  foreignField: 'scenarioId',
  justOne: false,
  localField: '_id',
  ref: 'Step',
} );
