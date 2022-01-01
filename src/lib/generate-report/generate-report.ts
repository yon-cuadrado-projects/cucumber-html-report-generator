import type * as Models from '../models/models';
import { CollectFeatureFiles } from '../feature-collector/feature-collector';
import { CollectJsons } from '../collect-jsons/collect-jsons';
import { GenerateHtml } from './helpers/generate-html';
import { SuiteFactory } from './ReportObjectsFormatters/suite-formatter';
import axios from 'axios';
import { userPropertiesValidation } from '../helpers/application-properties-validation';

export const generateHtmlReport = async ( reportConfiguration: Models.ReportDisplay | undefined, jsonReport: Models.ExtendedReport ): Promise<void> =>{
  const reportConfigurationInitialized = userPropertiesValidation.initializeReportDisplayParameters( reportConfiguration );
  await new GenerateHtml( jsonReport, reportConfigurationInitialized ).createHtmlPages();
};

export const insertReportIntoDatabase = async ( jsonReport: Models.ExtendedReport, userProperties: Models.ReportGeneration ): Promise<string | null> =>{
  return ( await axios.request<Models.Response>( {
    transitional:{
      silentJSONParsing: false
    },
    responseType: 'json',
    method: 'POST',
    url: `${userProperties.mongooseServerUrl!}/insertReport`,
    data: jsonReport,
    maxRedirects: 0,
    maxBodyLength: Infinity, 
    maxContentLength: Infinity,
    headers:{
      'content-type': 'application/json'
    }
  } ) ).data.reportId;
};

export const generate = async ( userProperties: Models.ReportGeneration | null ): Promise<string | null> =>{
  const checkedUserProperties = userPropertiesValidation.checkReportGenerationParameters( userProperties );
  const features = await new CollectFeatureFiles( checkedUserProperties ).collectFeatures();
  const jsonFiles = await new CollectJsons( checkedUserProperties ).createJoinedJson();
  const jsonReport = await new SuiteFactory( checkedUserProperties ).parseJsons( jsonFiles, features );
  let reportId: string | null = null;
  if ( checkedUserProperties.saveReportInMongoDb ) {
    reportId = await insertReportIntoDatabase( jsonReport, checkedUserProperties );
  }
  await generateHtmlReport( checkedUserProperties, jsonReport );
  return reportId;
};
