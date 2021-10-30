import * as CommonFunctions from '../../common-functions/common-functions';
import * as Messages from '../../helpers/console-messages';
import * as Models from '../../models/models';
import { FeatureFormatter } from './feature-formatter';
import { messages } from 'cucumber-messages';
import { v4 as uuidv4 } from 'uuid';
import GherkinDocument = messages.GherkinDocument;
import IFeature = GherkinDocument.IFeature;

export class SuiteFactory {
  private readonly userProperties: Models.ReportGeneration;
  private readonly suite: Models.ExtendedReport;

  public constructor ( userProperies: Models.ReportGeneration ) {
    this.userProperties = userProperies;
    this.suite = this.initializeSuite();
  }

  public async parseJsons ( collectedJsons: Models.Feature[], providedFeatures: GherkinDocument[] | null ): Promise<Models.ExtendedReport> {
    const  features = await Promise.all(
      collectedJsons.map( jsonFeature => {
        const gherkinFeature = this.getGherkinFeature( providedFeatures, jsonFeature.name );
        const feature = new FeatureFormatter( gherkinFeature, jsonFeature ).parseFeature();
        this.updateSuiteStadistics( feature );
        
        if( !feature.elements?.length ){
          console.log( Messages.featureRemoved( feature.name ) );
          return null;
        }
        return feature;
      } )
    );
    this.suite.features = features.flatMap ( feature => feature ? [ feature ] :[] ) ;

    this.updateSuiteProperties();
    this.suite.results.overview.result = [ ...new Map( this.suite.results.overview.result.map( item => [ item.status, item ] ) ).values() ];
    this.suite.results.overview.resultStatusesJoined = this.suite.results.overview.result.map( ( value ) => value.status.toString() ).sort().join( ';' );

    if( this.suite.features.some( feature => feature.metadata?.length ) ){
      this.suite.haveFeaturesMetadata = true;
    }

    if ( this.userProperties.saveEnrichedJSON ) {
      await this.saveEnrichedJson();
    }

    return this.suite;
  }

  private updateSuiteProperties(): void{
    this.suite.features = this.suite.features.sort( ( firstFeature, secondFeature ) => ( firstFeature.id! > secondFeature.id! ? 1 : -1 ) );
    this.addMissingMetadataToFeatures( );
    this.suite.results.overview.durationHHMMSS = CommonFunctions.convertTimeFromNanoSecondsToHHMMSS( this.suite.results.overview.duration );
    this.suite.metadata = CommonFunctions.isMetadata( this.userProperties.reportMetadata ) ? this.userProperties.reportMetadata : <Models.Metadata[]>[];
    this.suite.features = this.setUniqueIdForEachFeature( this.suite.features );
  } 

  private async saveEnrichedJson():Promise<void>{
    await CommonFunctions.saveJsonFile( this.userProperties.reportPath, 'enriched-output.json' ,this.suite );
  }

  private getGherkinFeature( providedFeatures: GherkinDocument[] | null, jsonFeatureName: string ): IFeature | null | undefined{
    return providedFeatures?.length ? providedFeatures.filter( document => document.feature?.name === jsonFeatureName )[0]?.feature : null;
  }

  private updateSuiteStadistics( feature: Models.Feature ): void{
    const overview = feature.results.overview;
    this.suite.results.overview.duration += overview.duration;
    this.suite.results.features.passed += overview.result.filter( result => result.status === Models.Status.passed ).length === overview.result.length && overview.result.length ? 1 : 0;
    this.suite.results.features.failed += overview.result.filter( result => result.status === Models.Status.failed ).length === overview.result.length && overview.result.length ? 1 : 0;
    this.suite.results.features.pending += overview.result.filter( result => result.status === Models.Status.pending ).length === overview.result.length && overview.result.length ? 1 : 0;
    this.suite.results.features.skipped += overview.result.filter( result => result.status === Models.Status.skipped ).length === overview.result.length && overview.result.length ? 1 : 0;
    this.suite.results.features.ambiguous += overview.result.filter( result => result.status === Models.Status.ambiguous ).length === overview.result.length && overview.result.length ? 1 : 0;
    this.suite.results.features.undefined += overview.result.filter( result => result.status === Models.Status.undefined ).length === overview.result.length && overview.result.length ? 1 : 0;
    this.suite.results.features.various += Number( [ ... new Set( overview.result ) ].length > 1 ); 
    this.suite.results.features.total++;

    this.suite.results.scenarios = CommonFunctions.updateResultsAndPercentages( this.suite.results.scenarios,feature.results.scenarios );
    this.suite.results.steps = CommonFunctions.updateResultsAndPercentages( this.suite.results.steps,feature.results.steps );
    this.suite.results.features = <Models.FeatureModuleResults>CommonFunctions.updatePercentages( this.suite.results.features );
    this.suite.results.overview.result.push( ...feature.results.overview.result );
  }

  private initializeSuite(): Models.ExtendedReport{
    const suite = <Models.ExtendedReport>{};
    suite.results = Models.reportResultsInitializer();
    suite.metadata = <Models.Metadata[]>[];
    suite.metadataTitle = this.userProperties.reportMetadataTitle;
    suite.reportTitle = this.userProperties.reportTitle;
    suite.haveFeaturesMetadata = false;
    return suite;
  }

  private setUniqueIdForEachFeature( features: Models.Feature[] ): Models.Feature[]{
    const seen = new Set();
    const modifiedFeatures = features.map( feature => {
      if ( seen.size === seen.add( feature.id ).size ){
        feature.id += uuidv4();
      }
      return feature;
    } );
    return modifiedFeatures;
  }

  private addMissingMetadataToFeatures( ): void{
    const allMetadata: Models.Metadata[] = [];
    this.suite.features.forEach( feature => {
      if( feature.metadata?.length ){
        feature.metadata.forEach( metadataElement =>{
          if( !allMetadata.filter( metadataObject => metadataObject.name === metadataElement.name ).length ){
            allMetadata.push( metadataElement );
          }
        } );
      }
    } );
    this.suite.results.overview.metadata = allMetadata;

    this.suite.features.forEach( feature => {
      allMetadata.forEach( metadataElement =>{
        const featureMetadataName = feature.metadata?.filter( featureMetadataElement => featureMetadataElement.name === metadataElement.name );
        if( ! featureMetadataName?.length ){
          feature.metadata!.push( { name: metadataElement.name, value: '' } );
        }
      } );
    } );
  }
}
