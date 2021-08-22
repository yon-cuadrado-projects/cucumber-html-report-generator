import { FeatureOverviewPage } from '../../pages/report-generation/feature-overview-page';
import { Then } from '@cucumber/cucumber';
import chai from 'chai';
chai.should();
import { container } from 'tsyringe';
const featureOverviewPage = container.resolve( FeatureOverviewPage );

Then( /^The '(.*)' graph is '(displayed|not displayed)' in the feature-overview page$/, async ( graphName: string, status: string ) =>{
  const graphStatus = await featureOverviewPage.isGraphDisplayed( graphName );
  graphStatus.should.be.equal( status === 'displayed' );
} );

Then( /^The additional data header title is '(.*)' in the feature-overview page$/, async ( expectedTitle: string ) =>{
  const applicationAdditionalDataTitle = await featureOverviewPage.getAdditionalDataTitleText();
  applicationAdditionalDataTitle?.should.be.equal( expectedTitle );
} );

Then( /^The '(.*)' field value is '(.*)' in the feature-overview page$/, async ( fieldName: string, expectedFieldValue: string ) =>{
  const appFieldValue = await featureOverviewPage.getAdditionalDataPropertyValue( fieldName );
  appFieldValue?.should.be.equal( expectedFieldValue );
} );
