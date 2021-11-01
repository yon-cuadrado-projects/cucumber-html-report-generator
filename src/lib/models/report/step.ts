import type { ObjectID } from 'bson';
import type { StepResultsOverview } from './results';

export interface Step {
  id: string | null;
  _id?: any;
  arguments?: Argument[] | Rows[];
  scenarioId?: ObjectID;
  argumentsCells: string;
  result: StepResultsOverview;
  keyword: string;
  hidden: boolean;
  match?: Match;
  text?: string[] | null;
  html: string[];
  embeddings: Embedding[];
  attachments: Attachment[];
  image: string[];
  rows?: Row[];
  rowsCells: string;
  examples: string[][];
  line: number | string;
  name?: string;
  json: string[];
  audio: string[];
  output: string[];
  video: string[];
}

export interface Argument {
  val: string;
  offset: number;
  rows?: Row[];
}

export interface Rows {
  rows?: Row[];
}

export interface Match {
  arguments: Argument[];
  location: string;
}

export interface Embedding {
  mime_type: string;
  media?: Media;
  data: string;
}

export interface Media {
  type?: string;
}

export interface Attachment {
  data: string;
  type: string;
}

export interface Location {
  line: number;
  column: number;
}

export interface Row {
  cells: string[];
  line?: number;
  locations?: Location[];
}
