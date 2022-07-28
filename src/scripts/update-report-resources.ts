import * as CommonFunctions from '../lib/common-functions/common-functions';
import type * as Models from '../lib/models/models';
import * as dependencyModifycationFunctions from './dependency-modification-functions';
import * as path from 'path';


const updateResourcesProperties = async (): Promise<void> => {
  const resourcesData = path.join( __dirname,'./resources-data.json');
  const resourcesFolder = path.join( __dirname, '../resources/dependencies' );
  const featuresIndex = path.join( __dirname, '../resources/templates/components/features-overview/features-overview-index.tmpl' );
  const featureIndex = path.join( __dirname, '../resources/templates/components/feature-overview/feature-overview-index.tmpl' );
  const configurationData = await CommonFunctions.readJsonFile<Models.ResourceProperties[]>( resourcesData );
  if ( configurationData ) {
    await dependencyModifycationFunctions.updateResources( resourcesData, resourcesFolder, [ featureIndex, featuresIndex ] )
  }
};

updateResourcesProperties().catch( error => {
  console.log( error );
} );
