import * as chai from 'chai';
import * as dependencyModifycationFunctions from '../../src/scripts/dependency-modification-functions';
import * as path from 'path';
import { CommonFunctions } from 'index';
import type { Models } from 'index';
import chaiAsPromised from 'chai-as-promised';
import { simpleGit } from 'simple-git';
chai.use( chaiAsPromised );
const { expect } = chai;


describe( 'update-report-resources-spec', () => {
  describe( 'Happy flows', () => {
    it( 'should return the properties of a resource', async () => {
      // Given
      const resourcesDataFile = path.resolve( process.cwd(), './test/unit/data/update-report-resources/resources-data.json' );
      const configurationData = await CommonFunctions.readJsonFile<Models.ResourceProperties[]>( resourcesDataFile );
      const tempConfigurationData = await CommonFunctions.readJsonFile<Models.ResourceProperties[]>( resourcesDataFile );
      const resourcesFolder = path.resolve( process.cwd(), './test/unit/data/update-report-resources/resources' );
      const featureIndex = path.resolve( process.cwd(), './test/unit/data/update-report-resources/templates/feature-overview-index.tmpl' );
      const featureIsndex = path.resolve( process.cwd(), './test/unit/data/update-report-resources/templates/features-overview-index.tmpl' );

      // When
      await dependencyModifycationFunctions.updateResources( configurationData!, resourcesDataFile, resourcesFolder, [ featureIsndex, featureIndex ] );

      // Then
      const updatedConfigurationData = await CommonFunctions.readJsonFile<Models.ResourceProperties[]>( resourcesDataFile );
      expect( updatedConfigurationData ).to.be.not.equal( configurationData );
      if ( updatedConfigurationData ) {
        updatedConfigurationData.forEach( elementConf => {
          elementConf.files.forEach( file => expect( CommonFunctions.exists( `${resourcesFolder}/${file.path.replace( 'resources/', '' )}` ) ).to.be.true
          );
        } );
      }

      if ( tempConfigurationData ) {
        tempConfigurationData.forEach( elementConf => {
          elementConf.files.forEach( file => expect( CommonFunctions.exists( `${resourcesFolder}/${file.path.replace( 'resources/', '' )}` ) ).to.be.false
          );
        } );
      }

      await dependencyModifycationFunctions.deleteOldDependencies( updatedConfigurationData?.[ 0 ]!, resourcesFolder );
      await dependencyModifycationFunctions.deleteOldDependencies( updatedConfigurationData?.[ 1 ]!, resourcesFolder );

      const updatedFiles = [
        'test/unit/data/update-report-resources/resources/Chart.js-3.7.1/chart.min.js',
        'test/unit/data/update-report-resources/resources/twitter-bootstrap-5.1.3/css/bootstrap.min.css',
        'test/unit/data/update-report-resources/resources/twitter-bootstrap-5.1.3/js/bootstrap.min.js',
        'test/unit/data/update-report-resources/templates/feature-overview-index.tmpl',
        'test/unit/data/update-report-resources/templates/features-overview-index.tmpl',
        'test/unit/data/update-report-resources/resources-data.json'
      ];
      updatedFiles.forEach( file => simpleGit().checkout( file ) );
    } );
  } );
} );