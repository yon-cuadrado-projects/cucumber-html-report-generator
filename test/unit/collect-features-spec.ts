import type * as Models from '../../src/lib/models/models';
import * as chai from 'chai';
import * as path from 'path';
import { describe, it } from 'mocha';
import { CollectFeatureFiles } from '../../src/lib/feature-collector/feature-collector';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';

const { expect } = chai;
chai.use( sinonChai );
chai.use( chaiAsPromised );
chai.use( sinonChai );

describe( 'CollectFeatures.ts', () => {
  describe( 'Happy flows', () => {
    it( 'should return an output from folder with features', async () => {
      // Given
      const reportGenerationProperties: Models.ReportGeneration = {
        featuresFolder: path.resolve( process.cwd(), './test/unit/data/features/correct' ),
        jsonDir: ''
      };

      const collectFeatures = new CollectFeatureFiles( reportGenerationProperties );

      // When
      const collectedFeatures = await collectFeatures.collectFeatures();

      // Then
      expect( collectedFeatures?.length ).to.be.equal( 3 );
    } );
  } );
  describe( 'failures', () => {
    it( 'should not return an output if it does not find features', async () => {
      // Given
      const reportGenerationProperties: Models.ReportGeneration = {
        featuresFolder: path.resolve( process.cwd(), './test/unit/data/cucumber-report-jsons' ),
        jsonDir: ''
      };
      const collectFeatures = new CollectFeatureFiles( reportGenerationProperties );

      // When
      const collectedFeatures = await collectFeatures.collectFeatures();

      // Then
      expect( collectedFeatures ).to.be.equal( null );
    } );
    it( 'should not return an output with a null folder', async () => {
      // Given
      const reportGenerationProperties: Models.ReportGeneration = {
        jsonDir: ''
      };
      const collectFeatures = new CollectFeatureFiles( reportGenerationProperties );

      // When
      await collectFeatures.collectFeatures().catch( ( error: Error ) => {
        // Then
        expect( error.message ).equal( "ENOENT: no such file or directory, stat 'null'" );
      } );
    } );

    it( 'should return a null with an undefined folder', async () => {
      // Given
      const reportGenerationProperties: Models.ReportGeneration = {
        jsonDir: '',
      };
      const collectFeatures = new CollectFeatureFiles( reportGenerationProperties );

      // When
      const result = await collectFeatures.collectFeatures();

      // Then
      expect( result?.length ).to.equal( 0 );
    } );

    it( 'should not return the features with the examples label written twice', async () => {
      // Given
      const reportGenerationProperties: Models.ReportGeneration = {
        featuresFolder: path.resolve( process.cwd(), './test/unit/data/features//with failures/with-label-written-twice' ),
        jsonDir: ''
      };
      const collectFeatures = new CollectFeatureFiles( reportGenerationProperties );

      // When
      const collectedFeatures = await collectFeatures.collectFeatures();

      // Then
      expect( collectedFeatures?.length ).to.equal( 1 );
    } );
  } );
} );
