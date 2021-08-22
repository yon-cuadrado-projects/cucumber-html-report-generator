import * as CommonFunctions from '../common-functions/common-functions';
import * as Messages from '../helpers/console-messages';
import type * as Models from '../models/models';

export class CollectJsons {
  private readonly userProperties: Models.ReportGeneration;

  public constructor( userProperties: Models.ReportGeneration ) {
    this.userProperties = userProperties;
  }

  public async createJoinedJson (): Promise<Models.Feature[]> {
    const jsonOutput = Array<Models.Feature>();

    const fileList = await this.getJsonReportFiles();

    if ( !fileList.length ) {
      throw new Error( Messages.noJsonFilesProvided( this.userProperties.jsonDir )  );
    }

    fileList.forEach( json => {
      json.forEach( feature => {
        feature.id = feature.id?.toString().replace( '/', '_' );
        jsonOutput.push( feature );
      } );
    } );

    if ( this.userProperties.saveCollectedJSON! ) {
      await CommonFunctions.saveJsonFile( this.userProperties.reportPath, '/merged-output.json', jsonOutput );
    }

    return jsonOutput;
  }

  private readonly getJsonReportFiles = async (): Promise<( Models.Feature[] )[]> => {
    let files = await CommonFunctions.getFilesAsync( this.userProperties.jsonDir );
    files = files.sort();
    const validReportsList = files.filter( file => file.endsWith( '.json' ) );

    const validReports = await Promise.all(
      validReportsList.map( async element => {
        const result = await CommonFunctions.readJsonFile<Models.Feature[]>( element );
        const resultFiltered = Array.isArray( result )
          ? result.filter( feature => typeof feature.id !== 'undefined' && typeof feature.keyword !== 'undefined' )
          : null;
        return Array.isArray( resultFiltered ) && resultFiltered.length ? resultFiltered : null;
      } )
    );
    const filteredReports: Models.Feature[][] = validReports.filter( ( feature ): feature is Models.Feature[] => feature !== null );
    return filteredReports;
  };
}
