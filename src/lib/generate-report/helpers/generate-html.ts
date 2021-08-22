import * as CommonFunctions from '../../common-functions/common-functions';
import * as ConsoleMessages from '../../helpers/console-messages';
import type * as Models from '../../models/models';
import * as fse from 'fs-extra';
import * as lodash from 'lodash';
import * as path from 'path';
import * as scripts from './html-charts-scripts-functions';
import fs, { promises as fsp } from 'fs';
import { ChartsData } from './charts-data';
import chalk from 'chalk';
import open from 'open';

const featureOverviewScriptsTemplate = 'resources/templates/scripts/feature-overview-scripts.tmpl';
const featuresOverviewScriptsTemplate = 'resources/templates/scripts/features-overview-scripts.tmpl';
const reportStylesheetDarkThemeTemplate = 'resources/templates/css/style-dark-theme.css';
const reportStylesheetLightThemeTemplate = 'resources/templates/css/style-light-theme.css';
const featuresOverviewIndexTemplate = 'resources/templates/components/features-overview/features-overview-index.tmpl';
const featuresOverviewTableTemplate = 'resources/templates/components/features-overview/features-overview-table.tmpl';
const featuresChartsTemplate = 'resources/templates/components/features-overview/features-charts.tmpl';
const featureChartsTemplate = 'resources/templates/components/feature-overview/feature-charts.tmpl';
const featureOverviewIndexTemplate = 'resources/templates/components/feature-overview/feature-overview-index.tmpl';
const scenarioStepsTemplate = 'resources/templates/components/feature-overview/scenario-elements/steps.tmpl';
const scenarioBeforeTemplate = 'resources/templates/components/feature-overview/scenario-elements/before.tmpl';
const scenarioAfterTemplate = 'resources/templates/components/feature-overview/scenario-elements/after.tmpl';
const tagsTemplate = 'resources/templates/components/feature-overview/scenario-elements/tags.tmpl';
const scenarioNameAndResultsTemplate = 'resources/templates/components/feature-overview/scenario-elements/name-and-results.tmpl';
const scenarioResultsTemplate = 'resources/templates/components/feature-overview/scenario-elements/results.tmpl';
const simpleScenarioTemplate = 'resources/templates/components/feature-overview/scenarios/simple-scenario.tmpl';
const outlineScenarioTemplate = 'resources/templates/components/feature-overview/scenarios/outline-scenario.tmpl';
const outlineScenarioChildTemplate = 'resources/templates/components/feature-overview/scenarios/outline-scenario-child.tmpl';
const resourcesFolder = 'src/resources/dependencies/';

export class GenerateHtml {
  private readonly suite: Models.ExtendedReport;
  private readonly scriptsFunctions: scripts.HtmlScriptsFunctions;
  private readonly chartsData: ChartsData;
  private readonly reportConfiguration: Models.ReportDisplay;
  private readonly featuresOverviewIndex: string;

  public constructor( suite: Models.ExtendedReport, reportConfiguration: Models.ReportDisplay ) {
    this.suite = suite;
    this.chartsData = new ChartsData( this.suite );
    this.reportConfiguration = reportConfiguration;
    this.scriptsFunctions = new scripts.HtmlScriptsFunctions( this.reportConfiguration.theme! );
    this.featuresOverviewIndex = path.join( this.reportConfiguration.reportPath!, 'index.html' );
  }

  public async createHtmlPages (): Promise<void> {
    this.createFeaturesOverviewIndexPage();
    await this.createFeatureIndexPages();
    if ( ! this.reportConfiguration.useCDN ) {
      await this.copyResourcesToTargetFolder();
    }
    await this.openReportInBrowser();
  }

  private async openReportInBrowser (): Promise<void> {
    /* istanbul ignore else */
    if ( this.reportConfiguration.disableLog ) {
      console.log( chalk.blue( ConsoleMessages.reportCreated( this.featuresOverviewIndex ) ) );
    }

    /* istanbul ignore next */
    if ( this.reportConfiguration.openReportInBrowser ) {
      const dir = path.join( this.reportConfiguration.reportPath!, 'features' );
      const files = await fsp.readdir( dir );

      /* istanbul ignore next */
      if ( files.length === 1 && this.reportConfiguration.navigateToFeatureIfThereIsOnlyOne ) {
        await open( path.join( dir, files[0] ) );
      } else {
        const result = await open( this.featuresOverviewIndex );
        console.log( result );
      }
    }
  }

  private createFeaturesOverviewIndexPage (): void {
    fs.writeFileSync(
      this.featuresOverviewIndex,
      this.generateTemplate( featuresOverviewIndexTemplate, {
        featuresOverview: this.generateTemplate( featuresOverviewTableTemplate, {
          suite: this.suite
        } ),
        config: this.reportConfiguration,
        featuresOverviewChart: this.generateTemplate( featuresChartsTemplate, {
          suite: this.suite
        } ),
        featuresOverviewScripts: this.generateTemplate( featuresOverviewScriptsTemplate, {
          config: this.reportConfiguration,
          chartsData: this.chartsData,
          scriptsFunctions: this.scriptsFunctions,
          suite: this.suite
        } ),
        projectName: this.suite.reportTitle,
        styles: this.generateTemplate( this.reportConfiguration.overrideStyle ?? ( this.reportConfiguration.theme === 'Dark' ? reportStylesheetDarkThemeTemplate : reportStylesheetLightThemeTemplate ) ),
        customStyle: this.reportConfiguration.customStyle ? this.generateTemplate( this.reportConfiguration.customStyle ) : '',
        suite: this.suite
      } )
    );
  }

  private async createFeatureIndexPages (): Promise<void> {
    const featuresPath = path.resolve( this.reportConfiguration.reportPath!, 'features/' );
    if ( ! CommonFunctions.exists( featuresPath ) ) {
      fs.mkdirSync( featuresPath );
    }

    await Promise.all( this.suite.features.map( feature => {
      const featurePage = `${featuresPath}/${feature.id!.toString().replace( '/', '_' )}.html`;
      fs.writeFileSync(
        featurePage,
        this.generateTemplate( featureOverviewIndexTemplate, {
          feature,
          featureOverviewScripts: this.generateTemplate( featureOverviewScriptsTemplate, {
            feature,
            chartsData: this.chartsData,
            scriptsFunctions: this.scriptsFunctions,
            suite: this.suite
          } ),
          config: this.reportConfiguration,
          featureScenariosOverviewChart: this.generateTemplate( featureChartsTemplate, {
            feature
          } ),
          scenarioOutlineTemplate: this.generateScenariosTemplate( feature ),
          styles: this.generateTemplate( this.reportConfiguration.theme === 'Dark' || this.reportConfiguration.theme !== 'Light' ? reportStylesheetDarkThemeTemplate : reportStylesheetLightThemeTemplate ),
          customStyle: this.reportConfiguration.customStyle ? this.generateTemplate( this.reportConfiguration.customStyle ) : '',
          suite: this.suite,
          tags: this.generateTemplate( tagsTemplate, {
            index: feature.id,
            tags: feature.tags
          } ),
        } )
      );
      return feature;
    } ) );
  }

  private generateScenariosTemplate ( feature: Models.Feature ): string {
    let scenariosTemplates = '';
    for ( let scenarioIndex = 0; scenarioIndex < feature.elements!.length; scenarioIndex++ ) {
      const scenario = ( feature.elements! )[scenarioIndex];
      const templates = this.getScenarioElementsTemplates( scenario, scenarioIndex );

      if ( scenario.isFirstScenarioOutline && scenario.examples?.length ) {
        let scenarioOutlineChildsTemplates = '';
        for ( let scenarioExamplesIndex = 1; scenarioExamplesIndex < scenario.examples.length; scenarioExamplesIndex++ ) {
          const scenarioTemplates = this.getScenarioElementsTemplates( ( feature.elements! )[scenarioIndex + scenarioExamplesIndex], scenarioIndex + scenarioExamplesIndex );
          scenarioOutlineChildsTemplates += this.generateTemplate( outlineScenarioChildTemplate, {
            templates: scenarioTemplates,
            scenarioExamplesIndex,
            scenarioExamples: ( feature.elements! )[scenarioIndex].examples
          } );
        }

        const scenarioOutline = this.generateTemplate( outlineScenarioTemplate, {
          templates,
          scenarioOutlineChilds: scenarioOutlineChildsTemplates
        } );
        scenariosTemplates += scenarioOutline;
        scenarioIndex += scenario.examples.length - 1;
      } else {
        const simpleScenario = this.generateTemplate( simpleScenarioTemplate, {
          templates
        } );

        scenariosTemplates += simpleScenario;
      }
    }
    return scenariosTemplates;
  }

  private getScenarioElementsTemplates ( scenario: Models.Scenario, scenarioIndex: number ): Models.ScenariosTemplates {
    return <Models.ScenariosTemplates>{
      config: this.reportConfiguration,
      scenarioIndex,
      scenario,
      scenarioId: scenario.id,
      tags: this.generateTemplate( tagsTemplate, { scenario } ),
      nameAndResults: this.generateTemplate( scenarioNameAndResultsTemplate, {
        config: this.reportConfiguration,
        scenario,
        scenarioIndex
      } ),
      results: this.generateTemplate( scenarioResultsTemplate, {
        scenario,
        scenarioIndex
      } ),
      steps: this.generateTemplate( scenarioStepsTemplate, {
        config: this.reportConfiguration,
        isFirstScenarioOutline: scenario.isFirstScenarioOutline,
        scenarioIndex,
        steps: scenario.steps,
      } ),
      before: this.generateTemplate( scenarioBeforeTemplate, {
        config: this.reportConfiguration,
        scenario,
        scenarioIndex,
        steps: this.generateTemplate( scenarioStepsTemplate, {
          config: this.reportConfiguration,
          isFirstScenarioOutline: scenario.isFirstScenarioOutline,
          scenarioIndex,
          steps: scenario.before?.steps
        } )
      } ),
      after: this.generateTemplate( scenarioAfterTemplate, {
        config: this.reportConfiguration,
        scenario,
        scenarioIndex,
        steps: this.generateTemplate( scenarioStepsTemplate, {
          config: this.reportConfiguration,
          isFirstScenarioOutline: scenario.isFirstScenarioOutline,
          scenarioIndex,
          steps: scenario.after?.steps
        } )
      } )
    };
  }

  private readTemplateFile ( fileName: string ): string {
    return fs.readFileSync( CommonFunctions.exists( fileName ) ? fileName : path.join( __dirname, '../../../', fileName ), 'utf-8' );
  }

  private generateTemplate ( templateName: string, parameters?: Record<string, any> ): string {
    const compiledTemplate = lodash.template( this.readTemplateFile( templateName ) );
    return compiledTemplate( parameters );
  }

  private async copyResourcesToTargetFolder (): Promise<void> {
    await fse.copy( path.resolve( process.cwd(), resourcesFolder ), path.resolve( this.reportConfiguration.reportPath!, 'resources' ) );
  }
}
