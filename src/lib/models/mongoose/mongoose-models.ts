import type * as FeatureSchemas from './mongoose-feature-schemas';
import type * as ReportSchemas from './mongoose-extended-report-schema';
import type * as ScenarioSchemas from './mongoose-scenario-schemas';
import type * as StepSchemas from './mongoose-step-schemas';
import type mongoose from 'mongoose';

export interface MongooseModels {
  stepModel: mongoose.Model<StepSchemas.MSTep>;
  scenarioModel: mongoose.Model<ScenarioSchemas.MScenario>;
  reportModel: mongoose.Model<ReportSchemas.MExtendedReport>;
  featureModel: mongoose.Model<FeatureSchemas.MFeature>;
}
