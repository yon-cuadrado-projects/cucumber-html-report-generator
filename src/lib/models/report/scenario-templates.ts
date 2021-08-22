import type { ReportDisplay } from '../common/application-properties';
import type { Scenario } from './scenario';

export interface ScenariosTemplates{
  scenarioIndex: number;
  scenario: Scenario;
  scenarioId: string;
  config: ReportDisplay;
  index: number;
  tags: string;
  nameAndResults: string;
  results: string;
  steps: string;
  before: string;
  after: string;
}
