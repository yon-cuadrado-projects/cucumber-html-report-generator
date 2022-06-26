import * as dependencyModifycationFunctions from '../../src/scripts/dependency-modification-functions';
import * as path from 'path';
import { CommonFunctions } from 'index';
import type { Models } from 'index';
import { simpleGit } from 'simple-git';


describe( 'update-report-resources-spec', () => {
  describe( 'Happy flows', () => {
    it( 'should return the properties of a resource', async () => {
      // Given
      const resourcesDataFile = path.resolve( process.cwd(), './test/unit/data/update-report-resources/resources-data.json' );
      const configurationData = await CommonFunctions.readJsonFile<Models.ResourceProperties[]>( resourcesDataFile );
      const resourcesFolder = path.resolve( process.cwd(), './test/unit/data/update-report-resources/resources' );
      const featureIndex = path.resolve( process.cwd(), './test/unit/data/update-report-resources/templates/feature-overview-index.tmpl' );
      const featureIsndex = path.resolve( process.cwd(), './test/unit/data/update-report-resources/templates/features-overview-index.tmpl' );

      // When
      await dependencyModifycationFunctions.updateResources( configurationData!, resourcesDataFile, resourcesFolder, [ featureIsndex, featureIndex ] );

      // Then
      await dependencyModifycationFunctions.deleteOldDependencies( configurationData?.[ 0 ]!, resourcesFolder );
      await dependencyModifycationFunctions.deleteOldDependencies( configurationData?.[ 1 ]!, resourcesFolder );
      // const resource1Files = configurationData?.[ 0 ].files ?? [];
      // await Promise.all( resource1Files.map( async file => {
      //   await fse.remove( path.resolve( process.cwd(), 'test/unit/data/update-report-resources', file.path ) );
      // } ) );
      // configurationData?.[ 1 ].files.forEach( async file => fse.remove( path.resolve( process.cwd(), 'test/unit/data/update-report-resources', file.path ) ) );

      const updatedFiles = [
        'test/unit/data/update-report-resources/resources/Chart.js-3.7.1/chart.min.js',
        'test/unit/data/update-report-resources/resources/twitter-bootstrap-5.1.3/css/bootstrap.min.css',
        'test/unit/data/update-report-resources/resources/twitter-bootstrap-5.1.3/js/bootstrap.min.js',
        'test/unit/data/update-report-resources/templates/feature-overview-index.tmpl',
        'test/unit/data/update-report-resources/templates/features-overview-index.tmpl'
      ];
      updatedFiles.forEach( file => simpleGit().checkout( file ) );

      // check updated configurationData
      // check downloaded files
      // check that old files are deleted
      // Restore Configuration Data

    } );

    // it( 'should download a datatables resource', async () => {

    // } );

    // it( 'should download a cdnjs resource', async () => {

    // } );

    // it( 'should remove a resource', async () => {

    // } );
  } );
} );