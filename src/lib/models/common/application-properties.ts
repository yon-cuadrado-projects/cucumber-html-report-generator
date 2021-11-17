import type { Metadata } from '../report/feature';

export interface ReportDisplay{
  showExecutionTime?: boolean;
  navigateToFeatureIfThereIsOnlyOne?: boolean;
  openReportInBrowser?: boolean;
  customStyle?: string;
  overrideStyle?: string;
  reportPath?: string;
  disableLog?: boolean;
  theme?: string;
  useCDN?: boolean;
}

export interface ReportGeneration extends ReportDisplay{
  reportTitle?: string;
  jsonDir: string;
  reportMetadata?: Metadata[];
  featuresFolder?: string;
  saveReportInMongoDb?: boolean;
  saveCollectedJSON?: boolean;
  saveEnrichedJSON?: boolean;
  reportMetadataTitle?: string;
  mongooseServerUrl?:string;
}
