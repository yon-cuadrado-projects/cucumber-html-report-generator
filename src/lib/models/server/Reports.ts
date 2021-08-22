import type * as Models from '../models';
import type { ObjectId } from 'mongodb';

export interface Reports{
  title: string;
  result: Models.Result[];
  executionDateTime: string;
  _id: ObjectId;
}
