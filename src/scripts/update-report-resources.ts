import * as CommonFunctions from '../lib/common-functions/common-functions';
import type * as Models from '../lib/models/models';
import * as dependencyModifycationFunctions from './dependency-modification-functions';
import * as path from 'path';
const resourcesData = './resources-data.json';
const resourcesFolder = path.join( __dirname,'../resources/dependencies' );
const featuresIndex = path.join( __dirname,'../resources/templates/components/features-overview/features-overview-index.tmpl' );
const featureIndex = path.join( __dirname,'../resources/templates/components/feature-overview/feature-overview-index.tmpl' );

const updateResourcesProperties = async ( ): Promise<void> =>{
  const configurationData = await CommonFunctions.readJsonFile<Models.ResourceProperties[]>( path.join( __dirname,resourcesData ) );
  let dependenciesUpdated = false;
  for ( const dependency of configurationData ! ){
    // eslint-disable-next-line no-await-in-loop
    const updatedDependency = await dependencyModifycationFunctions.updateResourcesForOneDependency( dependency, resourcesFolder,[ featuresIndex,featureIndex ] );
      
    if( updatedDependency ){
      dependenciesUpdated = true;
    }
  }

  if( dependenciesUpdated ){
    await CommonFunctions.saveJsonFile<Models.ResourceProperties[]>( path.join( __dirname,'./' ),resourcesData, configurationData! );
  }else{
    console.log( 'All the html resources are already updated' );
  }
};

updateResourcesProperties( ).catch( error => {
  console.log( error ); 
} );
