import * as CommonFunctions from '../common-functions/common-functions';
import * as Messages from './console-messages';
import type * as Models from '../models/models';

class ApplicationPropertiesValidation {
  public checkReportGenerationParameters ( reportGenerationParameters: Models.ReportGeneration | null ): Models.ReportGeneration {
    if ( !reportGenerationParameters ) {
      throw new Error( Messages.optionsNotProvided );
    }

    CommonFunctions.checkFolder( reportGenerationParameters.jsonDir );

    return this.initializeReportGenerationParameters( reportGenerationParameters );
  }

  public initializeReportGenerationParameters ( reportGenerationParameters: Models.ReportGeneration ): Models.ReportGeneration {
    reportGenerationParameters.mongooseServerUrl = reportGenerationParameters.mongooseServerUrl ?? 'http://localhost:3000';
    reportGenerationParameters.reportTitle = reportGenerationParameters.reportTitle ?? 'Cucumber HTML Report Generator';

    return reportGenerationParameters;
  }

  public initializeReportDisplayParameters ( reportConfigurationParameters: Models.ReportDisplay | undefined ): Models.ReportDisplay {
    const localReportDisplayParameters = reportConfigurationParameters ?? <Models.ReportDisplay>{};
    localReportDisplayParameters.theme = localReportDisplayParameters.theme === 'Light' ? localReportDisplayParameters.theme : 'Dark' ;
    localReportDisplayParameters.reportPath = CommonFunctions.initializePath( localReportDisplayParameters.reportPath );

    return localReportDisplayParameters;
  }
}

export const userPropertiesValidation = new ApplicationPropertiesValidation();
