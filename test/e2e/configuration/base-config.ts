import 'reflect-metadata';
import { CustomCommands } from '../custom-commands/custom-commands';
import { registerPagesInContainer } from '../container/container';

const enableBrowserLogging = async (): Promise<void> => {
  await browser.cdp( 'Runtime', 'enable' );
  await browser.cdp( 'Page', 'enable' );
  await browser.cdp( 'Log', 'enable' );
  await browser.cdp( 'Console', 'enable' );
  // browser.on( 'Network.responseReceived', ( params ) => {
  //   console.log( `Loaded ${( <ResponseReceived>params ).response.status}` );
  // } );
  browser.on( 'Runtime.consoleAPICalled', message => {
    browser.config.params?.consoleLog?.push( <string>message );
  } );
  browser.on( 'Runtime.exceptionThrown', message => {
    browser.config.params?.consoleLog?.push( <string>message );
  } );
  browser.on( 'Runtime._exceptionRevoked', message => {
    browser.config.params?.consoleLog?.push( <string>message );
  } );
  browser.on( 'Log.entryAdded', message => {
    browser.config.params?.consoleLog?.push( <string>message );
  } );
  browser.on( 'Console.messageAdded', message => {
    browser.config.params?.consoleLog?.push( <string>message );
  } );
};

const config: WebdriverIO.Config = {
  autoCompileOpts: {
    autoCompile: true,
    // see https://github.com/TypeStrong/ts-node#cli-and-programmatic-options
    // for all available options
    tsNodeOpts: {
      transpileOnly: true,
      project: 'tsconfig.json'
    },
    // tsConfigPathsOpts:{
    //   baseUrl: './',
    //   paths: { '@models': [ 'src/lib/models/models.ts' ], '@common-functions': [ 'src/lib/common-functions/common-functions.ts' ] }
    // }
  },
  //
  // ==================
  // Specify Test Files
  // ==================
  // Define which test specs should run. The pattern is relative to the directory
  // From which `wdio` was called. Notice that, if you are calling `wdio` from an
  // NPM script (see https://docs.npmjs.com/cli/run-script) then the current working
  // Directory is where your package.json resides, so `wdio` will be called from there.
  //
  maxInstances: 1,
  capabilities: [],
  //
  // ===================
  // Test Configurations
  // ===================
  // Define all options that are relevant for the WebdriverIO instance here
  //
  // By default WebdriverIO commands are executed in a synchronous way using
  // The wdio-sync package. If you still want to run your tests in an async way
  // E.g. using promises you can set the sync option to false.
  // Sync: true,

  logLevel: 'info',
  bail: 0,
  waitforTimeout: 15000,
  waitforInterval: 1000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  framework: 'cucumber',
  reporters: [
    'dot',
    'spec',
  ],

  //
  // =====
  // Hooks
  // =====
  // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
  // It and to build services around it. You can either apply a single function or an array of
  // Methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
  // Resolved to continue.

  before: async (): Promise<void> => {
    try {
      await browser.maximizeWindow();
    } catch ( error: unknown ) {
      console.log( ( <Error>error ).message );
    }
    new CustomCommands().createCutomCommands();
    registerPagesInContainer();

    await enableBrowserLogging();
  },

  // afterStep: async ( ): Promise<void> => {
  //   CucumberJsJsonReporter.attach( await browser.takeScreenshot(), 'image/png' );
  // },

  services: [
    'devtools',
    [
      'selenium-standalone',
      {
        logPath: './.tmp/',
        installArgs: {
          version: '4.7.0',
          drivers: {
            chrome: {
              version: 'latest',
              arch: process.arch,
              baseURL: 'https://chromedriver.storage.googleapis.com',
            },
            firefox: {
              version: 'latest',
              arch: process.arch,
              baseURL: 'https://github.com/mozilla/geckodriver/releases/download',
            },
            chromiumedge: {
              version: 'latest',
              arch: process.arch,
              baseURL: 'https://msedgedriver.azureedge.net/',
            },
          },
        },
        args: {
          version: '4.7.0',
          drivers: {
            chrome: {
              version: 'latest',
              arch: process.arch,
              baseURL: 'https://chromedriver.storage.googleapis.com',
            },
            firefox: {
              version: 'latest',
              arch: process.arch,
              baseURL: 'https://github.com/mozilla/geckodriver/releases/download',
            },
            chromiumedge: {
              version: 'latest',
              arch: process.arch,
              baseURL: 'https://msedgedriver.azureedge.net/',
            },
          },
        },
      } ] ],
};

export { config };
