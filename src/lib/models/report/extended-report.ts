import type { Feature, Metadata } from './feature';
import type { ReportResults } from './results';

export interface ExtendedReport {
  _id: any;
  id: any;
  features: Feature[];
  results: ReportResults;
  metadata?: Metadata[];
  metadataTitle?: string;
  reportTitle?: string;
  haveFeaturesMetadata: boolean;
}
