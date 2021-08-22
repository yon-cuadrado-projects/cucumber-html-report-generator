import { CommonPage } from '../pages/common/common-page';
import { FeaturesOverviewPage } from '../pages/report-generation/features-overview-page';
import { ReportGenerationApiPage } from '../pages/report-generation/report-generation-api-page';
import { container } from 'tsyringe';

export const registerPagesInContainer = (): void =>{
  container.register<CommonPage>( CommonPage, { useValue: new CommonPage() } );
  container.register<ReportGenerationApiPage>( ReportGenerationApiPage, { useValue: new ReportGenerationApiPage() } );
  container.register<FeaturesOverviewPage>( FeaturesOverviewPage, { useValue: new FeaturesOverviewPage() } );
};
