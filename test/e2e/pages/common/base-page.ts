import * as CommonFunctions from '../../../../src/lib/common-functions/common-functions';

export class BasePage {
  public mainObjectXpath: string | undefined;

  public constructor( mainObjectXpath?: string ) {
    this.mainObjectXpath = mainObjectXpath;
  }

  public async navigateToUrl ( url: string ): Promise<void> {
    await browser.url( url );
  }

  public async clickOnCheckbox( checkboxLabel: string ): Promise<void>{
    ( await this.getCheckBox( checkboxLabel ) )?.click();
  }

  public async getCheckBox ( label: string ): Promise<WebdriverIO.Element | undefined> {
    const mainObject = await $( this.mainObjectXpath ?? '' );
    return mainObject.$( `.//*[.='${label}']/../..//input` );
  }

  public async getCheckboxStatus ( checkboxLabel: string ): Promise<string> {
    const checkbox = await this.getCheckBox( checkboxLabel );
    const checkboxParentElement = await checkbox?.parentElement();
    return await checkboxParentElement?.getAttribute( 'class' ) === 'checked' ? 'activated' : 'deactivated';
  }

  public async deleteFolderContent( folderPath: string ): Promise<void>{
    await CommonFunctions.emptyFolder( folderPath );
  }

  public getConsoleErrors(): string[] | undefined{
    return  browser.config.params?.consoleLog;
  }
}
