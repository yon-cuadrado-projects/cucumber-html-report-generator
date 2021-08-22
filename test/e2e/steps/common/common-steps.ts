import { CommonPage } from '../../pages/common/common-page';
import { Given } from '@cucumber/cucumber';
import type { Urls } from '../../models/wdio-conf-additional-properties';
import { container } from 'tsyringe';

Given( /^The user navigates to the page '(.*)'$/, async ( url: keyof Urls ) => {
  const commonPage = container.resolve( CommonPage );
  await commonPage.navigateToUrl( url );
} );
