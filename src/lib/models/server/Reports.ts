import type * as Models from '../models';
import type { ObjectID } from 'bson';

export interface Reports{
  title: string;
  result: Models.Result[];
  executionDateTime: string;
  _id: ObjectID;
}
