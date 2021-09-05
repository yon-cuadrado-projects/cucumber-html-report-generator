import { Then, When } from '@cucumber/cucumber';
import { FeatureOverviewPage } from '../../pages/report-generation/feature-overview-page';
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

When( /^The user clicks on the scenario title: '(.*)'$/, async ( scenarioTitle: string ) =>{
  await featureOverviewPage.clickOnScenarioTitle( scenarioTitle );
} );

When( /^The user clicks on the cell '(.*)' of the row '(.*)' at the scenario outline '(.*)' in the feature-overview page$/, async ( columnNumber: number, rowNumber: number, scenarioName: string ) =>{
  await featureOverviewPage.clickOnScenarioOutlineTableCell( rowNumber, columnNumber, scenarioName );
} );

When( /^The user clicks on the scenario title '(.*)' at the row '(.*)' in the scenarios table in the feature-overview page$/, async ( scenarioTitle: string, rowNumber: string ) =>{
  await featureOverviewPage.clickOnScenarioTitleInScenariosOutlineTableRow( scenarioTitle, rowNumber );
} );

Then( /^The step '(.*)' in the row '(.*)' of the scenario outline '(.*)' has the text '(.*)' in the feature-overview page$/, async ( stepNumber: string, rowNumber: string, scenarioNane: string, expectedText: string ) =>{
  const stepText = await featureOverviewPage.getStepTextInScenarioOutline( scenarioNane, rowNumber, stepNumber );
  stepText?.should.be.equal( expectedText );
} );
