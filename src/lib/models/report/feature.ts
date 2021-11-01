import type { Scenario, Tag } from './scenario';
import type { FeatureResults } from './results';
import type { ObjectID } from 'bson';

export interface Feature {
  _id: any;
  ObjectId?: ObjectID;
  description?: string;
  id?: string;
  keyword: string;
  line: number;
  metadata?: Metadata[];
  metadataTitle?: string;
  name: string;
  reportId?: ObjectID;
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
