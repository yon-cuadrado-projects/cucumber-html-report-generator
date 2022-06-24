import * as CommonFunctions from '../lib/common-functions/common-functions';
import type * as Models from '../lib/models/models';
import * as dependencyModifycationFunctions from './dependency-modification-functions';
import * as path from 'path';
const resourcesData = './resources-data.json';
const resourcesFolder = path.join( __dirname, '../resources/dependencies' );
const featuresIndex = path.join( __dirname, '../resources/templates/components/features-overview/features-overview-index.tmpl' );
const featureIndex = path.join( __dirname, '../resources/templates/components/feature-overview/feature-overview-index.tmpl' );

const updateResourcesPropertiesInConfigurationFiles = async ( configurationData: Models.ResourceProperties[] ): Promise<boolean> => {
  const resourcesModification = configurationData.map( async dependency => dependencyModifycationFunctions.updateResourcesForOneDependency( dependency, resourcesFolder, [ indexEjsFile ] ) );

  return ( await Promise.all( resourcesModification ) ).filter( modification => modification ).length > 0;
};

const updateResourcesPropertiesConfigurationJson = async ( configurationData: Models.ResourceProperties[] ): Promise<void> => {
  await CommonFunctions.saveJsonFile<Models.ResourceProperties[]>( path.join( __dirname, './' ), resourcesData, configurationData );
};

const updateResourcesProperties = async (): Promise<void> => {
  const configurationData = await CommonFunctions.readJsonFile<Models.ResourceProperties[]>( path.join( __dirname, resourcesData ) );
  if ( configurationData ) {
    const isConfigurationUpdated = await updateResourcesPropertiesInConfigurationFiles( configurationData );
    if ( isConfigurationUpdated ) {
      await updateResourcesPropertiesConfigurationJson( configurationData );
    }
  }
};

updateResourcesProperties().catch( error => {
  console.log( error );
} );
