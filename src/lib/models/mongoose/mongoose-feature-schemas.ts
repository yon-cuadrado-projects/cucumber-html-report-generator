import * as CommonSchemas from './mongoose-common-schemas';
import type { Document, Model } from 'mongoose';
import type { FeatureResults, FeatureResultsOverview } from '../report/results';
import type { Feature } from '../report/feature';
import { Schema } from 'mongoose';

export interface MFeature extends Feature, Document {
  id: any;
  _id: any;
}

export interface MFeatureResults extends FeatureResults, Document {}
export interface MFeatureResultsOverview extends FeatureResultsOverview, Document {}

export const featureResultsOverviewSchema = new Schema( {
  duration: { required: false, type: Number },
  durationHHMMSS: { required: false, type: String },
  result: { required: false, type: [ CommonSchemas.resultSchema ] },
},{
  _id: false,
  id: false,
} );

export const featureResultsSchema = new Schema( {
  overview: featureResultsOverviewSchema,
  scenarios: CommonSchemas.moduleResultsSchema,
  steps: CommonSchemas.moduleResultsSchema,
},{
  _id: false,
  id: false,
} );

export const featureSchema: Schema<MFeature, Model<MFeature>>= new Schema( {
  ObjectId: { required: false, type: String },
  description: { required: false , type: String },
  id: { required: true, type: String },
  keyword: { required: true, type: String },
  line: { required: true, type: Number },
  metadata: [ { required: false, type: CommonSchemas.metadataSchema } ],
  metadataTitle: { required: false, type: String },
  name: { required: true, type: String },
  reportId: { ref: 'Report', type: Schema.Types.ObjectId },
  results: featureResultsSchema,
  tags: [ CommonSchemas.tagSchema ],
  uri: { required: true, type: String },
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

featureSchema.virtual( 'elements',{
  foreignField: 'featureId',
  justOne: false,
  localField: '_id',
  ref: 'Scenario',
} );
