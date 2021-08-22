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
}
