import * as CommonFunctions from '../../src/lib/common-functions/common-functions';
import type * as Models from '../../src/lib/models/models';
import * as fs from 'fs';
import * as fse from 'fs-extra';
import * as generateReport from '../../src/lib/generate-report/generate-report';
import * as os from 'os';
import * as path from 'path';
import { expect, use } from 'chai';
import Chaifs from 'chai-fs';
import axios from 'axios';
import sinon from 'sinon';

use( Chaifs );

const readDirAsync = fs.promises.readdir;
const statAsync = fs.promises.stat;

describe( 'GenerateReport.ts', () => {
  const getReportPathInTempFolder = async (): Promise<string> => {
    const tempDir = path.join( os.tmpdir(), 'cucumber-html-report-generator/' );
    const foldersInTempDir = await readDirAsync( tempDir );

    const stats = await Promise.all(
      foldersInTempDir.map( async ( folder: string ) => {
        const stat = await statAsync( path.join( tempDir, folder ) );
        return { folder: tempDir + folder, stat };
      } )
    );

    return stats.sort( ( firstStats: { folder: string; stat: fs.Stats }, secondStats: { readonly folder: string; stat: fs.Stats } ) =>
      secondStats.stat.mtime.getTime() - firstStats.stat.mtime.getTime() )[0].folder;
  };

  describe( 'Happy flows', () => {
    it( 'should create a report from the merged json files with metadata', async () => {
      // Given
      const reportPath = `${path.resolve( './' )}/.tmp/unit/report01`;
      await CommonFunctions.emptyFolder( reportPath );
      const featuresFolder = path.resolve( reportPath, 'features/' );
      await fse.mkdir( featuresFolder );

      const options: Models.ReportGeneration = {
        openReportInBrowser: false,
        reportPath,
        showExecutionTime: true,
        customStyle: `${path.resolve( './' )}/src/resources/templates/css/style-dark-theme.css`,
        useCDN: false,
        featuresFolder: `${path.resolve( './' )}/test/unit/data/features/correct/`,
        jsonDir: `${path.resolve( './' )}/test/unit/data/cucumber-report-jsons/`,
        saveCollectedJSON: true,
        saveEnrichedJSON: true,
        saveReportInMongoDb: false,
        reportMetadataTitle: 'Additional Data',
        reportMetadata: [
          { name: 'Project', value: 'custom project' },
          { name: 'Release', value: '1.2.3' },
          { name: 'Cycle', value: '2' },
          { name: 'Execution Start Date', value: '2021-03-26 14:01' },
          { name: 'Execution End Date', value: '2021-03-26 16:05' }
        ]
      };

      // When
      await generateReport.generate( options );

      // Then
      expect( await fse.pathExists( path.join( reportPath, 'index.html' ) ) ).to.equal( true );
      expect( await fse.pathExists( path.join( reportPath, 'merged-output.json' ) ) ).to.equal( true );
      expect( await fse.pathExists( path.join( reportPath, 'enriched-output.json' ) ) ).to.equal( true );
    } );

    it( 'should create a report from the merged json files without metadata', async () => {
      // Given
      const options: Models.ReportGeneration = {
        disableLog: true,
        navigateToFeatureIfThereIsOnlyOne: true,
        showExecutionTime: false,
        overrideStyle: `${path.resolve( './' )}/src/resources/templates/css/style-dark-theme.css`,
        theme: 'Light',
        useCDN: true,
        saveEnrichedJSON: false,
        jsonDir: `${path.resolve( './' )}/test/unit/data/no-metadata-jsons`
      };

      // When
      await generateReport.generate( options );

      // Then
      const reportPath = await getReportPathInTempFolder();
      expect( ( path.join( reportPath, 'index.html' ) ) ).to.be.a.file();
      sinon.restore();
    } );
    it( 'should create a report from a json file without parameters', async () => {
      // Given
      const jsonFile = path.resolve( path.resolve( './' ), './test/unit/data/enriched-joined-cucumber-jsons/enriched-output1.json' );
      const reportSaved = ( await CommonFunctions.readJsonFile( jsonFile ) );

      // When
      await generateReport.generateHtmlReport( undefined, <Models.ExtendedReport>reportSaved );

      // Then
      const reportPath = await getReportPathInTempFolder();
      expect( ( path.join( reportPath, 'index.html' ) ) ).to.be.a.file();
    } );
    it( 'should call to insertReport api', async () => {
      // Given
      const options: Models.ReportGeneration = {
        disableLog: true,
        navigateToFeatureIfThereIsOnlyOne: false,
        openReportInBrowser: false,
        showExecutionTime: false,
        reportTitle: 'New report',
        theme: 'Light',
        useCDN: true,
        saveEnrichedJSON: false,
        saveReportInMongoDb: true,
        mongooseServerUrl: 'http://localhost:3000',
        jsonDir: `${path.resolve( './' )}/test/unit/data/cucumber-report-jsons`
      };

      // When
      const spy = sinon.stub( axios, 'request' ).resolves( Promise.resolve( { data: { reportId: '609c40e971b5b53a1965cec1' } } ) );
      await generateReport.generate( options );

      // Then
      expect( spy.called );
      expect( await generateReport.generate( options ) ).equal( '609c40e971b5b53a1965cec1' );
      sinon.restore();
    } );
  } );

  describe( 'failures', () => {
    it( 'should throw an error when no options are provided', async () => {
      // Given
      const options: Models.ReportGeneration | null = null;

      // When
      await generateReport.generate( options ).catch( ( error: Error ) => {
        // Then
        expect( error.message ).to.equal( 'Options need to be provided.' );
      } );
    } );

    it( 'should throw an error when the json dir si not provided', async () => {
      // Given
      const reportPath = `${path.resolve( './' )}/.tmp/unit/reports/report02/`;
      const options: Models.ReportGeneration = {
        reportPath,
        jsonDir: '',
        reportMetadata: [
          { name: 'browser', value: 'chrome 81' }
        ],
        saveEnrichedJSON: false,
        saveReportInMongoDb: true
      };

      // When
      await generateReport.generate( options ).catch( ( error: Error ) => {
        // Then
        expect( error.message ).to.equal( `The path provided: '${options.jsonDir}' is invalid` );
      } );
    } );

    it( 'should throw an error when the report folder is invalid', async () => {
      // Given
      const reportPath = '/home/user1/test/test2';
      const options: Models.ReportGeneration = {
        disableLog: true,
        navigateToFeatureIfThereIsOnlyOne: false,
        reportPath,
        jsonDir: `${path.resolve( './' )}/test/unit/data/cucumber-report-jsons`,
        reportMetadata: [
          { name: 'browser', value: 'chrome 81' }
        ],
      };

      // When
      await generateReport.generate( options ).catch( ( error: Error ) => {
        // Then
        expect( error.message ).to.equal( `The path provided: '${options.reportPath!}' is invalid` );
      } );
    } );

    it( 'should throw an error when the features folder is invalid', async () => {
      // Given
      const featuresFolder = '/home/user1/test/test2';
      const options: Models.ReportGeneration = {
        disableLog: true,
        navigateToFeatureIfThereIsOnlyOne: false,
        featuresFolder,
        jsonDir: `${path.resolve( './' )}/test/unit/data/cucumber-report-jsons`,
        reportMetadata: [
          { name: 'browser', value: 'chrome 81' }
        ],
      };

      // When
      await generateReport.generate( options ).catch( ( error: Error ) => {
        // Then
        expect( error.message ).to.equal( `The path provided: '${options.featuresFolder!}' is invalid` );
      } );
    } );
    it( 'should throw an error when the json folder does not exist', async () => {
      // Given
      const options: Models.ReportGeneration = {
        disableLog: true,
        navigateToFeatureIfThereIsOnlyOne: false,
        jsonDir: './invalid-folder',
        reportMetadata: [
          { name: 'browser', value: 'chrome 81' }
        ],
      };

      // When
      await generateReport.generate( options ).catch( ( error: Error ) => {
        // Then
        expect( error.message ).to.equal( `The path provided: '${options.jsonDir}' is invalid` );
      } );
    } );
  } );
} );
