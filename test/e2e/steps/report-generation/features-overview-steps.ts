import * as CommonFunctions from '../../../../src/lib/common-functions/common-functions';
import { Given, Then, When } from '@cucumber/cucumber';
import { CommonPage } from '../../pages/common/common-page';
import { FeaturesOverviewPage } from '../../pages/report-generation/features-overview-page';
import { ReportGenerationApiPage } from '../../pages/report-generation/report-generation-api-page'; 
import chai from 'chai';
import { container } from 'tsyringe';
import path from 'path';
chai.should();
const reportGenerationApiPage: ReportGenerationApiPage = container.resolve( ReportGenerationApiPage );
const commonPage = container.resolve( CommonPage );
const featuresOverviewPage = container.resolve( FeaturesOverviewPage );

Given( /^The folder '(.*)' is deleted$/, async ( reportFolder: string ) =>{
  await CommonFunctions.emptyFolder( reportFolder );
} );

Given( /^The user generates a report with '(.*)' theme in the folder '(.*)'$/, async ( theme: string, folder: string ) =>{
  const reportPath = path.join( path.resolve( './' ), folder );
  await reportGenerationApiPage.generateReport( theme, reportPath );
} );

When( /^The user opens the report in the '(.*)' folder$/, async ( folder: string ) =>{
  const reportPath = path.join( 'file://', path.resolve( './' ), folder, 'index.html' );
  await commonPage.navigateToUrl( reportPath );
} );

Then( /^The browser have the errors '(.*)' in the console$/, ( consoleErrors: string ) =>{
  const errors = commonPage.getConsoleErrors();
  const expectedConsoleErrors = typeof consoleErrors === 'undefined' ? [] : consoleErrors.split( ';' );
  errors?.should.be.deep.equal( expectedConsoleErrors );
} );

Then( /^The '(.*)' graph is '(displayed|not displayed)' in the features-overview page$/, async ( graphName: string, status: string ) =>{
  const isgraphDisplayed = await featuresOverviewPage.isGraphDisplayed( graphName );
  isgraphDisplayed.should.be.equal( status === 'displayed' );
} );

Then( /^The additional data header title is '(.*)' in the features-overview page$/, async ( expectedAdditionalDataTitle: string ) =>{
  const expectedTitleText = await featuresOverviewPage.getAdditionalDataTitleText();
  expectedTitleText?.should.be.equal( expectedAdditionalDataTitle );
} );

Then( /^The '(.*)' field value is '(.*)' in the features-overview page$/, async ( propetyName: string, expectedPropertyValue: string ) =>{
  const propertyValue = await featuresOverviewPage.getAdditionalDataPropertyValue( propetyName );
  propertyValue?.should.be.equal( expectedPropertyValue );
} );


When( /^The user opens the feature '(.*)'$/, async ( featureName: string ) =>{
  await featuresOverviewPage.clickOnFeatureLink( featureName );
} );
