import * as CommonFunctions from '../../common-functions/common-functions';
import * as ConsoleMessages from '../../helpers/console-messages';
import * as Models from '../../models/models';
import * as lodash from 'lodash';
import { StepFormatter } from './step-formatter';
import { messages } from 'cucumber-messages';
import GherkinDocument = messages.GherkinDocument;
import IFeature = GherkinDocument.IFeature;
import Feature = GherkinDocument.Feature;
import IScenario = Feature.IScenario;
import IStep = Feature.IStep;
import ITableRow = messages.GherkinDocument.Feature.ITableRow;
import TableRow = messages.GherkinDocument.Feature.TableRow;
import ITableCell = TableRow.ITableCell;

export class ScenarioFormatter {
  private readonly gherkinFeature: IFeature | null | undefined ;

  public constructor ( gherkinFeature: IFeature | null | undefined ) {
    this.gherkinFeature = gherkinFeature;
  }

  public parseScenario ( scenario: Models.Scenario, featureName: string ): Models.Scenario | null{
    let localScenario = this.initializeScenario( scenario, featureName );
    if( localScenario ){
      localScenario = this.parseSteps( localScenario );
      localScenario.results = this.updateScenarioResults( localScenario.results );
    }
    return localScenario;
  }

  public createNewFirstScenarioOutline (
    jsonScenario: Models.Scenario,
    gherkinScenario: IScenario | null | undefined,
    jsonScenarios: Models.Scenario[],
    scenarioIndex: number ): Models.Scenario {

    const firstScenarioOutline: Models.Scenario = lodash.cloneDeep( jsonScenario );
    firstScenarioOutline.id = `${firstScenarioOutline.id.substring( 0, firstScenarioOutline.id.length - 3 )  };;1`;
    firstScenarioOutline.name = CommonFunctions.escapeHTML( firstScenarioOutline.name );
    firstScenarioOutline.before = <Models.BeforeOrAfter>{ steps: <Models.Step[]>[] };
    firstScenarioOutline.after = <Models.BeforeOrAfter>{ steps: <Models.Step[]>[] };
    firstScenarioOutline.results = Models.scenarioResultsInitializer();
    firstScenarioOutline.steps = this.initializeScenarioOutlineSteps( firstScenarioOutline.steps!, gherkinScenario! );
    firstScenarioOutline.examples = this.initializeExamples( gherkinScenario!, jsonScenarios );

    firstScenarioOutline.examples.forEach( ( example, index, arr ) => {
      if ( index < arr.length - 1 ) {
        firstScenarioOutline.results.overview.duration += jsonScenarios[scenarioIndex + index].results.overview.duration;
        firstScenarioOutline.results.steps.passed += jsonScenarios[scenarioIndex + index].results.steps.passed;
        firstScenarioOutline.results.steps.failed += jsonScenarios[scenarioIndex + index].results.steps.failed;
        firstScenarioOutline.results.steps.undefined += jsonScenarios[scenarioIndex + index].results.steps.undefined;
        firstScenarioOutline.results.steps.pending += jsonScenarios[scenarioIndex + index].results.steps.pending;
        firstScenarioOutline.results.steps.ambiguous += jsonScenarios[scenarioIndex + index].results.steps.ambiguous;
        firstScenarioOutline.results.steps.skipped += jsonScenarios[scenarioIndex + index].results.steps.skipped;
      }
    } );

    firstScenarioOutline.results.overview.durationHHMMSS = CommonFunctions.convertTimeFromNanoSecondsToHHMMSS(
      firstScenarioOutline.results.overview.duration
    );

    firstScenarioOutline.isFirstScenarioOutline = true;
    return firstScenarioOutline;
  }

  public isOutlineScenario( scenario: Models.Scenario ): boolean{
    if( this.gherkinFeature?.children?.some( scenarioFromFeature =>
      scenarioFromFeature.scenario?.name === scenario.name 
                                             && scenarioFromFeature.scenario.examples?.length 
                                             && scenarioFromFeature.scenario.steps?.length ) ){
      return true;
    }
    return false;
  }

  private initializeExamples( gherkinScenario: IScenario, jsonScenarios: Models.Scenario[] ): string[][]{
    const examples = gherkinScenario.examples?.[0];
    const headerRow = examples?.tableHeader;
    const examplesHeaderCells = <string[]>headerRow!.cells!.map( cell => cell.value );
    const examplesRows = examples!.tableBody!.map( row => {
      if( this.isRowExecuted( headerRow!, row.cells!,gherkinScenario.steps!,jsonScenarios ) ){
        const rowContent: string[] = [];
        ( row.cells! ).forEach( cell => {
          rowContent.push( cell.value! );
        } );
        return rowContent;
      }
      return null;
    } ).flatMap ( row => row ? [ row ] :[] ) ;
    let rows = <string[][]>[];
    rows.push( examplesHeaderCells );
    rows = rows.concat( examplesRows );
    return rows;
  }

  private initializeScenarioOutlineSteps( steps: Models.Step[], gherkinScenario: IScenario ):Models.Step[]{
    steps.forEach( ( stepJs: Models.Step ) => {
      delete stepJs.text;
      stepJs.rows = [];
      delete stepJs.result.error_message;
      stepJs.embeddings = [];
      stepJs.attachments = [];
      stepJs.result.status = Models.Status.passed;
      ( gherkinScenario.steps! ).map( stepPd => {
        if ( ( stepPd.location! ).line === stepJs.line ) {
          stepJs.name = CommonFunctions.escapeHTML( String( stepPd.text ) );
        }
        return stepPd;
      } );
    } );
    return steps;
  }

  private parseSteps( scenario: Models.Scenario ): Models.Scenario{
    scenario.steps?.map( step =>{
      const parsedStep = new StepFormatter().parseStep( step );
      if( parsedStep.keyword.trim() ==='Before' ){
        scenario.before?.steps.push( parsedStep );
        scenario.before!.results = this.updateBeforeOrAfterStadistics( scenario.before!.results, parsedStep.result );
        scenario.results.before.duration += parsedStep.result.duration;
      }
      if( parsedStep.keyword.trim() ==='After' ){
        scenario.after?.steps.push( parsedStep );
        scenario.after!.results = this.updateBeforeOrAfterStadistics( scenario.after!.results, parsedStep.result );
        scenario.results.after.duration += parsedStep.result.duration;
      }
      
      scenario.results = this.updateScenarioStepsStadistics( scenario.results, parsedStep.result );
      
      return parsedStep;
    } );
    scenario.steps = scenario.steps?.filter( step => step.keyword.trim() !== 'Before' && step.keyword.trim() !== 'After' );
    return scenario;
  }

  private initializeScenario( scenario: Models.Scenario, featureName: string ): Models.Scenario | null{
    if( typeof scenario.id === 'undefined' ){
      console.log( ConsoleMessages.scenarioWithoutIdRemoved( scenario.name, featureName ) );
      return null;
    }

    if( ! scenario.steps?.length ){
      console.log( ConsoleMessages.scenarioWithoutStepsRemoved( scenario.name, featureName ) );
      return null;
    }

    if( this.isOutlineScenario( scenario ) ){
      scenario.keyword = 'Scenario Outline';
    }
    scenario.isFirstScenarioOutline = false;
    scenario.examples = [];
    scenario.keyword = typeof scenario.keyword === 'undefined' ? '' : scenario.keyword;
    scenario.name = typeof scenario.name === 'undefined' ? '' : scenario.name;
    scenario.type = typeof scenario.type === 'undefined' ? 'scenario' : scenario.type;
    scenario.results = Models.scenarioResultsInitializer();
    scenario.before = Models.beforeOrAfterInitializer() ;
    scenario.after = Models.beforeOrAfterInitializer() ;
    scenario.tags = typeof scenario.tags === 'undefined' ? [] : scenario.tags;
    return scenario;
  }

  private updateBeforeOrAfterStadistics( results: Models.BeforeOrAfterResults, stepResults: Models.StepResultsOverview ): Models.BeforeOrAfterResults{
    results.overview.duration += stepResults.duration;
    results.overview.status = stepResults.status === Models.Status.passed
      ? results.overview.status
      : stepResults.status;
    return results;
  }

  private updateScenarioStepsStadistics( results: Models.ScenarioResults ,stepResults: Models.StepResultsOverview ): Models.ScenarioResults{
    results.overview.duration += stepResults.duration ? stepResults.duration : 0 ;
    results.overview.status = stepResults.status === Models.Status.failed ? results.overview.status : Models.Status.failed;

    switch( stepResults.status ){
    case Models.Status.passed:
      results.steps.passed += 1;
      break;
    case Models.Status.failed:
      results.steps.failed += 1;
      break;
    case Models.Status.ambiguous:
      results.steps.ambiguous += 1;
      break;
    case Models.Status.pending:
      results.steps.pending += 1;
      break;
    case Models.Status.skipped:
      results.steps.skipped += 1;
      break;
    case Models.Status.undefined:
      results.steps.undefined += 1;
      break;
    // no default
    }

    results.steps.total += 1;
    return results;
  }

  private updateScenarioResults( scenarioResults: Models.ScenarioResults ): Models.ScenarioResults{
    scenarioResults.overview.durationHHMMSS = CommonFunctions.convertTimeFromNanoSecondsToHHMMSS( scenarioResults.overview.duration );
    scenarioResults.before.durationHHMMSS = CommonFunctions.convertTimeFromNanoSecondsToHHMMSS( scenarioResults.before.duration );
    scenarioResults.after.durationHHMMSS = CommonFunctions.convertTimeFromNanoSecondsToHHMMSS( scenarioResults.after.duration );
    scenarioResults.steps = CommonFunctions.updatePercentages( scenarioResults.steps );
    return scenarioResults;
  }

  private isRowExecuted( tableHeader: ITableRow, cells: ITableCell[], steps: IStep[], jsonScenarios: Models.Scenario[] ): boolean{
    const foundSteps = steps.filter( step =>{
      let stepText = step.text;
      tableHeader.cells?.forEach( ( cell, index ) =>{
        stepText = stepText?.replace( `<${cell.value!}>` , <string>( <ITableCell>( cells[index] ).value ) );
      } );
      return jsonScenarios.some( scenario => scenario.steps?.some( jsonStep => jsonStep.name === stepText ) );
    } ).length;
    return foundSteps === steps.length;
  }
}
