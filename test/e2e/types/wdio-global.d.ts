
import type { Params } from '../models/wdio-conf-additional-properties';


declare global {
  namespace WebdriverIO {
    interface Browser {
      browserCustomCommand: ( arg: string ) => void;
      config: Config;
      params: Params;
      destUrl: string;
    }

    interface Element {
    // Don't forget to wrap return values with Promise
      // waitForClickable: ( timeout: number ) => boolean;
      waitUntilIsEnabled: ( ms: number ) => boolean;
      // waitForDisplayed: ( timeout: number ) => boolean;
      GetWebElementLineNumbers: () => void;
      hoverAndClick: () => void;
      WaitUntilCheckIsEnabled: ( result: boolean, timeout: number ) => void;
      getCheckboxStatus: ( checkboxLabel: string ) => string;
      getCheckBox: ( label: string ) => Element;
      clickOnCheckbox: ( checkboxLabel: string, page: string ) => void;
      isElementDisplayed: () => Promise<boolean>;
      getRow: ( rowNumber: number ) => Promise<Element | undefined>;
      getCell: ( cellNumber: number ) => Promise<Element | undefined>;
    }

    interface Config {
      params?: Params;
    }

  }
}
