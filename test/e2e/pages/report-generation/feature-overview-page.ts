import { BasePage } from '../common/base-page';
import { injectable } from 'tsyringe';

@injectable()
export class FeatureOverviewPage extends BasePage{
  public static mainObjectXpath = ".//*[@class='feature-overview-report']";
  public constructor( ) {
    super( FeatureOverviewPage.mainObjectXpath );
  }

  public async getMainObject(): Promise<WebdriverIO.Element|null>{
    const mainObject = this.mainObjectXpath ? await $( this.mainObjectXpath ) : null;
    return mainObject;
  }
  
  public async isGraphDisplayed( graphName: string ): Promise<boolean>{
    const graph = await ( await this.getMainObject() )?.$( `.//*[@id='${graphName}']` );
    return graph ? graph.isElementDisplayed() : false;
  }

  public async getAdditionalDataTitleText(): Promise<string|undefined>{
    const additionalDataTitle = await ( await this.getMainObject() )?.$( ".//*[@test-id='additional-data.title']" );
    const additionalDataTitleText = await additionalDataTitle?.getText();
    return additionalDataTitleText;
  }

  public async getAdditionalDataPropertyValue( propertyName: string ): Promise<string|undefined>{
    const propertyCell = await ( await this.getMainObject() )?.$( `.//*[@test-id='additional-data.table']//td[contains(text(),'${propertyName}')]//ancestor::tr//td[2]` );
    const propertyCellText = await propertyCell?.getText();
    return propertyCellText;
  }

  public async getScenarioTitle( titleText: string ): Promise<WebdriverIO.Element|undefined>{
    const title = await ( await this.getMainObject() )?.$( `.//h2[@test-id='scenario.header' and contains(.,'${titleText}')]//*[not(ancestor::tr)]` );
    return title;
  }

  public async clickOnScenarioTitle( titleText: string ): Promise<void>{
    ( await this.getScenarioTitle( titleText ) )?.click();
  }

  public async clickOnScenarioOutlineTableCell( rowNumber: number, columnNumber: number, scenarioName: string ): Promise<void>{
    const row = await ( await this.getScenarioOutlineTable( scenarioName ) )?.getRow( rowNumber );
    await ( await row?.getCell( columnNumber ) )?.click();
  }

  public async clickOnScenarioTitleInScenariosOutlineTableRow( title: string, rowNumber: string ): Promise<void>{
    const row = await ( await this.getScenarioOutlineTable( title ) )?.getRow( parseInt( rowNumber,10 ) + 1 );
    const scenarioTitle = await row?.$( ".//h2[contains(.,'Scenario Outline')]" );
    await scenarioTitle?.click();
  }

  public async getStepTextInScenarioOutline( testName: string, rowNumber: string, stepNumber: string ): Promise<string|undefined>{
    const row = await ( await this.getScenarioOutlineTable( testName ) )?.getRow( parseInt( rowNumber,10 ) + 1 );
    const titleElement = await row?.$( `.//tr[${stepNumber}]//span[@class='scenarioStepName']` );
    await browser.waitUntil(
      async () => await titleElement?.getSize( 'height' ) !== 0 && titleElement?.getSize( 'height' ) !== undefined,
      {
        timeout: 2000,
        timeoutMsg: 'expected height to be different than 0'
      }
    );
    return titleElement?.getText();
  }

  private async getScenarioOutlineTable( scenarioName: string ): Promise<WebdriverIO.Element | undefined>{
    const table = await ( await this.getMainObject() )?.$( `.//h2[@test-id='scenario.header' and contains(.,'${scenarioName}')]//ancestor::div[contains(@class,'x_panel')]//*[@test-id='scenario-outline.scenarios']` );
    return table;
  }
}
