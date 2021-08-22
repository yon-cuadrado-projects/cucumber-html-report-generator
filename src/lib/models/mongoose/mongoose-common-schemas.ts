import type { ModuleResults, OverviewResults } from '../report/results';
import type { Document } from 'mongoose';
import type { Metadata } from '../report/feature';
import { Schema } from 'mongoose';
import { Status } from '../report/status';
import type { Tag } from '../report/scenario';

export interface MMetadata extends Metadata, Document {}
export interface MTag extends Tag, Document {}
export interface MModuleResults extends ModuleResults, Document {
  _id: any;
}
export interface MOverviewResults extends OverviewResults, Document {}

export enum statusSchema {
  ambiguous = 'ambiguous',
  failed = 'failed',
  passed = 'passed',
  pending = 'pending',
  skipped = 'skipped',
  undefined = 'undefined'
};

export const resultSchema = new Schema( {
  icon: { required: false, type: String },
  status: { default: 'passed', enum: statusSchema, required: false, type: String }
},{
  _id: false,
  id: false,
} );

export const metadataSchema = new Schema( {
  icon: { required: false, type: String },
  name: { required: true, type: String },
  value: { required: false, type: String }
},{
  _id: false,
  id: false,
} );

export const tagSchema = new Schema( {
  line: { required: false,type: Number },
  name: { required: false, type: String }
},{
  _id: false,
  id: false,
} );

export const moduleResultsSchema = new Schema( {
  ambiguous: { required: true, type: Number },
  ambiguousPercentage: { required: false, type: String },
  failed: { required: true, type: Number },
  failedPercentage: { required: false, type: String },
  passed: { required: true, type: Number },
  passedPercentage: { required: false, type: String },
  pending: { required: true, type: Number },
  pendingPercentage: { required: false, type: String },
  skipped: { required: true, type: Number },
  skippedPercentage: { required: false, type: String },
  status: { enum: Object.values( Status ), required: true, type: String },
  statusIcon: { required: false, type: String },
  time: { required: false, type: String },
  timeInNanoSeconds: { required: false, type: Number },
  total: { required: true, type: Number },
  undefined: { required: true , type: Number },
  undefinedPercentage: { required: false, type: String },
  various: { required: false, type: Number },
  variousPercentage: { required: false, type: String },
},{
  _id: false,
  id: false,
} );

export const overviewResultsSchema = new Schema( {
  ambiguous: { required: false, type: Number },
  ambiguousPercentage: { required: false, type: String },
  duration: { required: false,type: Number },
  durationHHMMSS: { required: false, type: String },
  failed: { required: false, type: Number },
  failedPercentage: { required: false, type: String },
  passed: { required: false, type: Number },
  passedPercentage: { required: false, type: String },
  pending: { required: false, type: Number },
  pendingPercentage: { required: false, type: String },
  skipped: { required: false, type: Number },
  skippedPercentage: { required: false, type: String },
  status: { enum: Object.values( Status ), required: false,type: String },
  time: { required: false, type: String },
  timeInNanoSeconds: { required: false, type: Number },
  total: { required: false, type: Number },
  undefined: { required: false, type: Number },
  undefinedPercentage: { required: false, type: String },
  various: { required: false, type: Number },
  variousPercentage: { required: false, type: String },
},{
  _id: false,
  id: false,
} );
