class CustomCommands {
  public createCutomCommands (): void {
    browser.addCommand( 'getCheckBox', async function ( this: WebdriverIO.Element, checkboxLabel: string ) {
      return this.$( `.//*[.='${checkboxLabel}']/../..//input` );
    }, true );

    browser.addCommand( 'getCheckBoxStatus', async function ( this: WebdriverIO.Element, checkboxLabel: string ) {
      await this.getCheckBox( checkboxLabel ).click();
    }, true );

    browser.addCommand( 'waitForClickable', async function ( this: WebdriverIO.Element ,ms: number = 5 ): Promise<boolean | void> {
      return await this.waitForDisplayed( { timeout: ms } ) && this.waitForEnabled( { timeout: ms } );
    }, true );

    browser.addCommand( 'waitForNotVisible', async function ( this: WebdriverIO.Element, ms = 0 ): Promise<boolean | void> {
      return this.waitForDisplayed( { reverse: true, timeout: <number>ms } );
    }, true );

    browser.addCommand( 'waitUntilIsEnabled', async function ( this: WebdriverIO.Element, ms = 0 ): Promise<boolean | void> {
      return this.waitForDisplayed( { reverse: false, timeout: <number>ms } );
    }, true );

    browser.addCommand( 'waitForNotExist', async function ( this: WebdriverIO.Element, ms = 0 ): Promise<boolean | void> {
      return this.waitForExist( { reverse: false, timeout: <number>ms } );
    }, true );

    browser.addCommand( 'getRandomInt', ( min: number, max: number ) => Math.floor( Math.random() * ( max - min + 1 ) ) + min );

    browser.addCommand( 'hoverAndClick', async function ( this: WebdriverIO.Element ): Promise<void> {
      const location = await this.getLocation();
      await browser.performActions( [
        {
          actions: [
            { duration: 0, type: 'pointerMove', x: parseInt( location.x.toString(), 10 ), y: location.y },
            { button: 0, type: 'pointerDown' },
            { duration: 500, type: 'pause' },
            { button: 0, type: 'pointerUp' },
          ],
          id: 'pointer1',
          parameters: {
            pointerType: 'mouse',
          },
          type: 'pointer',
        },
      ] );
    },
    true );

    browser.addCommand( 'isElementDisplayed', async function ( this: WebdriverIO.Element| null ): Promise<boolean> {
      return await this?.isDisplayed() ?? false;
    },
    true );

    browser.addCommand( 'getRow', async function( this: WebdriverIO.Element | undefined, rowNumber: number ): Promise<WebdriverIO.Element | undefined> {
      return this?.$( `./tbody/tr[${rowNumber}]` );
    }, true );

    browser.addCommand( 'getCell', async function( this: WebdriverIO.Element | undefined, cellNumber: number ): Promise<WebdriverIO.Element | undefined> {
      return this?.$( `.//td[${cellNumber}]` );
    }, true );
  }
}

export { CustomCommands };
