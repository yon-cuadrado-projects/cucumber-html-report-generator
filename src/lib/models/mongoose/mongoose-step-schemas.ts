import * as CommonSchemas from './mongoose-common-schemas';
import type { Argument,Attachment, Embedding,Media, Row, Step } from '../report/step';
import type { Document, Model } from 'mongoose';
import { Schema } from 'mongoose';
import type { StepResultsOverview } from '../report/results';

export interface MSTep extends Step, Document {
  id: any;
}
export interface MArgument extends Argument, Document {}
export interface MEmbedding extends Embedding, Document {}
export interface MStepResultsOverview extends StepResultsOverview, Document {}
export interface MMedia extends Media, Document {}
export interface MAtachment extends Attachment, Document {}
export interface MRow extends Row, Document {}

export const sttachmentSchema = new Schema( {
  data: { required: false, type: String },
  type: { required: false, type: String },
},{
  _id: false,
  id: false,
} );

export const mediaSchema = new Schema( {
  type: { required: true, type: String },
},{
  _id: false,
  id: false,
} );

export const embeddingSchema = new Schema( {
  data: { required: false, type: String },
  media: { required: false, type: mediaSchema },
  mime_type: { required: false, type: String },
},{
  _id: false,
  id: false,
} );

export const locationsSchema = new Schema( {
  column: { required: false, type: Number },
  line: { required: false, type: Number }
},{
  _id: false,
  id: false,
} );

export const rowSchema = new Schema( {
  cells: [ { required: false, type: String } ],
  line: { required: false, type: Number },
  locations: { required: false, type: [ locationsSchema ], _id: false, id: false, default: undefined } 
},{
  _id: false,
  id: false,
} );

export const stepResultsOverviewSchema = new Schema( {
  color: { required: false, type: String },
  duration: { required: false , type: Number },
  durationHHMMSS: { required: false, type: String },
  error_message: { required: false, type: String },
  icon: { required: false, type: String },
  status: { enum: Object.values( CommonSchemas.statusSchema ), required: false, type: String },
  title: { required: false, type: String }
},{
  _id: false,
  id: false,
} );


export const argumentsRowsSchemaRow = new Schema( {
  cells: [ { required: false,type: String } ]
},{
  _id: false,
  id: false,
} );


export const argumentsRowsSchema = new Schema( {
  rows: { required: false, type: [ rowSchema ], _id: false, id: false },
},{
  _id: false,
  id: false,
} );

export const argumentSchema = new Schema( {
  offset: { required: false, type: Number },
  val: { required: false, type: String },
},{
  _id: false,
  id: false,
} );

export const matchSchemaArguments = new Schema( {
  arguments: { required: false, type: [ argumentSchema ] } ,
  location: { required: false, type: String }
},{
  _id: false,
  id: false,
} );

export const stepSchema: Schema<MSTep, Model<MSTep>> = new Schema( {
  argument: argumentSchema,
  arguments: { required: false,type: [ argumentsRowsSchema ], _id: false, id: false },
  argumentsCells: { required: false, type: String },
  attachments: [ { required: false, type: sttachmentSchema } ],
  audio: [ { required: false, type: String } ],
  embeddings: [ { required: false, type: embeddingSchema } ],
  examples: [ [ { required: true,type: String } ] ],
  hidden: { required: false, type: Boolean },
  html: [ { required: true, type: String } ],
  id: { required: false, type: String },
  image: [ { required: true, type: String } ],
  index: { required: false, type: Number },
  json: [ { required: false, type: String } ],
  keyword: { required: true, type: String },
  line: { required: false, type: Number },
  match: { required: false, type: matchSchemaArguments } ,
  name: { required: false, type: String },
  output: [ { required: false, type: String } ],
  result: { required: false, type: stepResultsOverviewSchema },
  rows:  { required: false, type: [ rowSchema ], _id: false, id: false } ,
  rowsCells: { required: false, type: String },
  scenarioId: { ref: 'Scenario', type: Schema.Types.ObjectId },
  text: { required: false, type: Schema.Types.Mixed },
  video: [ { required: false, type: String } ]
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
