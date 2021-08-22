import * as chai from 'chai';
import * as fse from 'fs-extra';
import * as path from 'path';
chai.should();
import { CollectJsons } from '../../src/lib/collect-jsons/collect-jsons';
import type { ExtendedReport } from '../../src/lib/models/report/extended-report';
import type { ReportGeneration } from '../../src/lib/models/common/application-properties';
import chaiAsPromised from 'chai-as-promised';
chai.use( chaiAsPromised );
const { expect } = chai;

describe( 'CollectJsons.ts', () => {
  describe( 'Happy flows', () => {
    it( 'should return an output from the merged found json files', async () => {
      // Given
      const outputReportPath = `${process.cwd()}/dist/test/reports/.tmp1/`;

      if ( await fse.pathExists( outputReportPath ) ) {
        await fse.remove( outputReportPath );
      }

      await fse.mkdir( outputReportPath, { recursive: true } );

      const pathJsonsToBeJoined = path.resolve( process.cwd(), './test/unit/data/cucumber-report-jsons' );
      const resultsPath = path.resolve( process.cwd(), './test/unit/data/joined-cucumber-jsons/merged-output.json' );
      const userProperties: ReportGeneration = {
        reportPath: outputReportPath,
        jsonDir: pathJsonsToBeJoined,
        saveCollectedJSON: true
      };
      const collectionJsons = new CollectJsons( userProperties );

      // When
      const jsonRead = await collectionJsons.createJoinedJson();

      // Then
      const jsonExpected = <ExtendedReport>await fse.readJson( resultsPath );
      expect( jsonRead ).to.be.deep.equal( jsonExpected );
    } );
  } );

  describe( 'failures', () => {
    it( 'should return no report from incorrect files', async () => {
      const pathJsonsToBeJoined = path.resolve( process.cwd(), './test/unit/data/no-jsons' );
      const userProperties: ReportGeneration = {
        reportPath: '',
        jsonDir: pathJsonsToBeJoined
      };

      // When
      await new CollectJsons( userProperties ).createJoinedJson().catch( ( error: Error ) => {
        expect( error.message ).equal( `No JSON files found in '${pathJsonsToBeJoined}'. NO REPORT CAN BE CREATED!` );
      } );
    } );
    it( 'should throw an error when no json files could be found', async () => {
      const pathJsonsToBeJoined = path.resolve( process.cwd(), './test/unit/data/no-jsons' );
      const userProperties: ReportGeneration = {
        reportPath: '',
        jsonDir: pathJsonsToBeJoined
      };

      await new CollectJsons( userProperties ).createJoinedJson().catch( ( error: Error ) => {
        expect( error.message ).equal( `No JSON files found in '${pathJsonsToBeJoined}'. NO REPORT CAN BE CREATED!` );
      } );
    } );
  } );
} );
