import * as CommonFunctions from '../../common-functions/common-functions';
import * as Models from '../../models/models';
import { ScenarioFormatter } from './scenario-formatter';
import type { messages } from 'cucumber-messages';

export class FeatureFormatter {
  private readonly gherkinFeature: messages.GherkinDocument.IFeature | null | undefined ;
  private jsonFeature: Models.Feature;
  private readonly scenarioFormater: ScenarioFormatter;
  private readonly scenarioOutlines: Models.ScenarioOutline[];

  public constructor ( gherkinFeature: messages.GherkinDocument.IFeature | null | undefined, jsonFeature: Models.Feature ) {
    this.gherkinFeature = gherkinFeature;
    this.jsonFeature = jsonFeature;    
    this.scenarioFormater = new ScenarioFormatter( this.gherkinFeature );
    this.scenarioOutlines = this.getOutlineScenarios();
  }

  public parseFeature (): Models.Feature {
    this.initalizeFeature( );

    if( this.jsonFeature.elements?.length ){
      this.joinOutlineScenarios();
      for( let index = 0; index < this.jsonFeature.elements.length; index++ ) {
        const jsonScenario = this.scenarioFormater.parseScenario( this.jsonFeature.elements[index], this.jsonFeature.name );
        if( jsonScenario !== null && typeof jsonScenario !== 'undefined' ){
          this.jsonFeature.elements[index] = jsonScenario;
          this.updateFeatureStadistics( this.jsonFeature.elements[index]?.results );
          if( this.isLastScenarioOutlineWithFeature( jsonScenario, index ) ){
            const scenarios = this.addFirstScenarioOutline( this.jsonFeature.elements, jsonScenario, index );
            this.jsonFeature.elements = scenarios;
            index++;
          }
        }
      }
      
      this.jsonFeature.results.overview.durationHHMMSS =
      CommonFunctions.convertTimeFromNanoSecondsToHHMMSS( this.jsonFeature.results.overview.duration );
      this.jsonFeature.elements = this.jsonFeature.elements.filter( scenario => Object.keys( scenario ).length && scenario.steps?.length );
    }

    return this.jsonFeature;
  }

  private addFirstScenarioOutline( scenarios: Models.Scenario[], jsonScenario: Models.Scenario, index: number ): Models.Scenario[]{
    const scenarioName = jsonScenario.name;
    const gherkinScenario = this.gherkinFeature?.children?.filter(
      scenario => scenario.scenario?.name === scenarioName )[0]?.scenario;
    const scenarioOutlineLengthWithoutHeaders = this.scenarioOutlines.filter( scenario => scenario.name === scenarioName ).length - 1;
    const scenarioOutline = this.scenarioFormater.createNewFirstScenarioOutline( jsonScenario, gherkinScenario, scenarios, index - scenarioOutlineLengthWithoutHeaders );
    scenarios.splice( index - scenarioOutlineLengthWithoutHeaders, 0, scenarioOutline );

    return scenarios;
  }

  private updateFeatureStadistics( scenarioResults: Models.ScenarioResults ): void{
    this.jsonFeature.results.scenarios.undefined += scenarioResults.steps.undefined ? 1 : 0;
    this.jsonFeature.results.scenarios.failed += !scenarioResults.steps.undefined && scenarioResults.steps.failed ? 1 : 0;
    this.jsonFeature.results.scenarios.ambiguous += scenarioResults.steps.ambiguous &&
                  !scenarioResults.steps.undefined &&
                  !scenarioResults.steps.failed ? 1 : 0;
    this.jsonFeature.results.scenarios.pending += scenarioResults.steps.pending &&
                  !scenarioResults.steps.failed &&
                  !scenarioResults.steps.ambiguous &&
                  !scenarioResults.steps.undefined ? 1 : 0;
    this.jsonFeature.results.scenarios.skipped += scenarioResults.steps.skipped &&
                  !scenarioResults.steps.failed &&
                  !scenarioResults.steps.ambiguous &&
                  !scenarioResults.steps.pending &&
                  !scenarioResults.steps.undefined ? 1 : 0;
    this.jsonFeature.results.scenarios.passed += 
                  scenarioResults.steps.passed &&
                  !scenarioResults.steps.failed &&
                  !scenarioResults.steps.skipped &&
                  !scenarioResults.steps.pending &&
                  !scenarioResults.steps.ambiguous &&
                  !scenarioResults.steps.undefined ? 1 : 0;
    this.jsonFeature.results.scenarios.total =
                  this.jsonFeature.results.scenarios.passed +
                  this.jsonFeature.results.scenarios.skipped +
                  this.jsonFeature.results.scenarios.pending +
                  this.jsonFeature.results.scenarios.undefined +
                  this.jsonFeature.results.scenarios.ambiguous +
                  this.jsonFeature.results.scenarios.failed;
    this.jsonFeature.results.scenarios = CommonFunctions.updatePercentages( this.jsonFeature.results.scenarios );                  
    this.jsonFeature.results.steps = CommonFunctions.updateResultsAndPercentages( this.jsonFeature.results.steps,scenarioResults.steps );
    this.jsonFeature.results.overview.result = CommonFunctions.updateStatus( this.jsonFeature.results );
    this.jsonFeature.results.overview.duration += scenarioResults.overview.duration;
  }

  private initalizeFeature(  ): void{
    this.jsonFeature.description = typeof this.jsonFeature.description === 'undefined' ? '' : this.jsonFeature.description;
    this.jsonFeature.elements = this.jsonFeature.elements === null || typeof this.jsonFeature.elements === 'undefined' ? [] : this.jsonFeature.elements;
    this.jsonFeature.results = Models.featureResultsInitializer();
    this.jsonFeature.tags = typeof this.jsonFeature.tags === 'undefined' ? [] : this.jsonFeature.tags;
    this.jsonFeature.metadataTitle = this.jsonFeature.metadataTitle ?? 'Custom Data';
    this.jsonFeature.metadata = CommonFunctions.isMetadata( this.jsonFeature.metadata ) ? this.jsonFeature.metadata : [];
    this.jsonFeature.line = this.jsonFeature.line ?? 0;
    this.joinOutlineScenarios();
  }

  private joinOutlineScenarios(): void{
    const scenarioOutlines: {
      index: number;
      name: string;
    }[] = [];
    this.jsonFeature.elements?.forEach( scenario => {
      if ( this.scenarioFormater.isOutlineScenario( scenario ) ){
        scenarioOutlines.push( { index: parseInt( `${( this.jsonFeature.elements! ).indexOf( scenario )}`, 10 ),
                                 name: `${scenario.name}` } );
      }
    } );
    const scenarioOutlineNames = [ ...new Set( scenarioOutlines.map( item => item.name ) ) ];
    scenarioOutlineNames.forEach( name =>{
      const scenarioOutlineElements = scenarioOutlines.filter( scenario => scenario.name === name );
      const firstScenarioIndex = scenarioOutlineElements[0].index;
      scenarioOutlineElements.forEach( ( scenarioOutlineElement, index ) =>{
        CommonFunctions.arraymove( this.jsonFeature.elements!,scenarioOutlineElement.index, firstScenarioIndex + index );
      } );
    } );
  }

  private isLastScenarioOutlineWithFeature( scenario: Models.Scenario, index: number ): boolean{
    const ocurrences = this.scenarioOutlines.filter( scenarioElement => scenarioElement.name === scenario.name );
    if( ocurrences[ocurrences.length - 1]?.index === index ){
      return true;
    }
    return false;
  }

  private getOutlineScenarios(): Models.ScenarioOutline[]{
    const scenarioOutlines: Models.ScenarioOutline[] = [];
    this.jsonFeature.elements?.forEach( scenario => {
      if ( this.scenarioFormater.isOutlineScenario( scenario ) ){
        scenarioOutlines.push( { index: parseInt( `${( this.jsonFeature.elements! ).indexOf( scenario )}`, 10 ),
                                 name: `${scenario.name}` } );
      }
    } );
    
    return scenarioOutlines;
  }
}
