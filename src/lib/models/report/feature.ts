import type { Scenario, Tag } from './scenario';
import type { FeatureResults } from './results';
import type Mongoose from 'mongoose';
import type { ObjectId } from 'mongodb';

export interface Feature {
  _id: any;
  ObjectId?: ObjectId;
  description?: string;
  id?: string;
  keyword: string;
  line: number;
  metadata?: Metadata[];
  metadataTitle?: string;
  name: string;
  reportId?: Mongoose.Types.ObjectId;
  results: FeatureResults;
  tags: Tag[];
  uri: string;
  elements?: Scenario[] | null;
}

export interface Metadata {
  name: string;
  value: string;
  icon?: string;
}
