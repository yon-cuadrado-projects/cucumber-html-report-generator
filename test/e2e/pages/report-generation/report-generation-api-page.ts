import * as generateReport from '../../../../src/lib/generate-report/generate-report';
import { injectable } from 'tsyringe';
import path from 'path';

@injectable()
export class ReportGenerationApiPage {
  public async generateReport( theme: string, folder: string ): Promise<string | null>{
    const parameters = {
      openReportInBrowser: false,
      reportPath: folder,
      showExecutionTime: true,
      customStyle: `${path.resolve( './' )}/src/resources/templates/css/style-dark-theme.css`,
      useCDN: false,
      featuresFolder: `${path.resolve( './' )}/test/unit/data/features/correct/`,
      jsonDir: `${path.resolve( './' )}/test/unit/data/cucumber-report-jsons/`,
      saveCollectedJSON: true,
      saveEnrichedJSON: true,
      saveReportInMongoDb: false,
      theme,
      reportMetadataTitle: 'Additional Data',
      reportMetadata: [
        { name: 'Project', value: 'custom project' },
        { name: 'Release', value: '1.2.3' },
        { name: 'Cycle', value: '2' },
        { name: 'Execution Start Date', value: '2021-03-26 14:01' },
        { name: 'Execution End Date', value: '2021-03-26 16:05' }
      ]
    };
    const reportId =  await generateReport.generate( parameters );
    return reportId;
  }
}
