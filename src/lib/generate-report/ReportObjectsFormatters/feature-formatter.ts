import * as CommonFunctions from '../../common-functions/common-functions';
import * as Models from '../../models/models';
import type * as messages from '@cucumber/messages';
import { ScenarioFormatter } from './scenario-formatter';

export class FeatureFormatter {
  private readonly gherkinFeature: messages.Feature | null | undefined;
  private jsonFeature: Models.Feature;
  private readonly scenarioFormatter: ScenarioFormatter;
  private readonly scenarioOutlines: Models.ScenarioOutline[];

  public constructor( gherkinFeature: messages.Feature | null | undefined, jsonFeature: Models.Feature ) {
    this.gherkinFeature = gherkinFeature;
    this.jsonFeature = jsonFeature;
    this.scenarioFormatter = new ScenarioFormatter( this.gherkinFeature );
    this.scenarioOutlines = this.getOutlineScenarios();
  }

  public parseFeature (): Models.Feature {
    this.initializeFeature();

    if ( this.jsonFeature.elements?.length ) {
      this.joinOutlineScenarios();
      for ( let index = 0; index < this.jsonFeature.elements.length; index++ ) {
        const jsonScenario = this.scenarioFormatter.parseScenario( this.jsonFeature.elements[ index ], this.jsonFeature.name );
        if ( jsonScenario !== null && typeof jsonScenario !== 'undefined' ) {
          this.jsonFeature.elements[ index ] = jsonScenario;
          this.updateFeatureStatistics( this.jsonFeature.elements[ index ]?.results );
          const gherkinScenario = this.gherkinFeature?.children.filter(
            scenario => scenario.scenario?.name === jsonScenario.name )[ 0 ]?.scenario;
          if ( this.isLastScenarioOutlineWithFeature( jsonScenario, index ) && gherkinScenario ) {
            const scenarios = this.addFirstScenarioOutline( this.jsonFeature.elements, jsonScenario, index, gherkinScenario );
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

  private addFirstScenarioOutline ( scenarios: Models.Scenario[], jsonScenario: Models.Scenario, index: number, gherkinScenario: messages.Scenario ): Models.Scenario[] {
    const scenarioName = jsonScenario.name;
    const scenarioOutlineLengthWithoutHeaders = this.scenarioOutlines.filter( scenario => scenario.name === scenarioName ).length - 1;
    const scenarioOutline = this.scenarioFormatter.createNewFirstScenarioOutline( jsonScenario, gherkinScenario, scenarios, index - scenarioOutlineLengthWithoutHeaders );
    scenarios.splice( index - scenarioOutlineLengthWithoutHeaders, 0, scenarioOutline );

    return scenarios;
  }

  private updateFeatureStatistics ( scenarioResults: Models.ScenarioResults ): void {
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
    this.jsonFeature.results.steps = CommonFunctions.updateResultsAndPercentages( this.jsonFeature.results.steps, scenarioResults.steps );
    this.jsonFeature.results.overview.result = CommonFunctions.updateStatus( this.jsonFeature.results );
    this.jsonFeature.results.overview.duration += scenarioResults.overview.duration;
  }

  private initializeFeature (): void {
    this.jsonFeature.description = typeof this.jsonFeature.description === 'undefined' ? '' : this.jsonFeature.description;
    this.jsonFeature.elements = this.jsonFeature.elements === null || typeof this.jsonFeature.elements === 'undefined' ? [] : this.jsonFeature.elements;
    this.jsonFeature.results = Models.featureResultsInitializer();
    this.jsonFeature.tags = typeof this.jsonFeature.tags === 'undefined' ? [] : this.jsonFeature.tags;
    this.jsonFeature.metadataTitle = this.jsonFeature.metadataTitle ?? 'Custom Data';
    this.jsonFeature.metadata = CommonFunctions.isMetadata( this.jsonFeature.metadata ) ? this.jsonFeature.metadata : [];
    this.jsonFeature.line = this.jsonFeature.line ?? 0;
    this.joinOutlineScenarios();
  }

  private joinOutlineScenarios (): void {
    const scenarioOutlines: {
      index: number;
      name: string;
    }[] = [];
    this.jsonFeature.elements?.forEach( scenario => {
      if ( this.scenarioFormatter.isOutlineScenario( scenario ) ) {
        scenarioOutlines.push( {
          index: parseInt( `${( this.jsonFeature.elements! ).indexOf( scenario )}`, 10 ),
          name: `${scenario.name}`
        } );
      }
    } );
    const scenarioOutlineNames = [ ...new Set( scenarioOutlines.map( item => item.name ) ) ];
    scenarioOutlineNames.forEach( name => {
      const scenarioOutlineElements = scenarioOutlines.filter( scenario => scenario.name === name );
      const firstScenarioIndex = scenarioOutlineElements[ 0 ].index;
      scenarioOutlineElements.forEach( ( scenarioOutlineElement, index ) => {
        CommonFunctions.moveArray( this.jsonFeature.elements!, scenarioOutlineElement.index, firstScenarioIndex + index );
      } );
    } );
  }

  private isLastScenarioOutlineWithFeature ( scenario: Models.Scenario, index: number  ): boolean {
    const occurrences = this.scenarioOutlines.filter( scenarioElement => scenarioElement.name === scenario.name );
    if ( occurrences[ occurrences.length - 1 ]?.index === index ) {
      return true;
    }
    return false;
  }

  private getOutlineScenarios (): Models.ScenarioOutline[] {
    const scenarioOutlines: Models.ScenarioOutline[] = [];
    this.jsonFeature.elements?.forEach( scenario => {
      if ( this.scenarioFormatter.isOutlineScenario( scenario ) ) {
        scenarioOutlines.push( {
          index: parseInt( `${( this.jsonFeature.elements! ).indexOf( scenario )}`, 10 ),
          name: `${scenario.name}`
        } );
      }
    } );

    return scenarioOutlines;
  }
}
