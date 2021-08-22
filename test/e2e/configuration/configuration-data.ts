import type { Urls } from '../models/wdio-conf-additional-properties';
import path from 'path';

export const configurationParameters =
{
  urls: <Urls>{
    reportInit: path.join( path.resolve( './' ), '' )
  },
  consoleLog: []
};
