import * as  CommonFunctions from '../lib/common-functions/common-functions';
import type * as Models from '../lib/models/models';
import * as fse from 'fs-extra';
import * as https from 'https';
import * as path from 'path';
import axios from 'axios';
import semver from 'semver';
import sri from 'ssri';

export const downloadFile = async ( url: string, filePath: string ): Promise<boolean> => new Promise<boolean>( ( resolve, reject ) => {
  https.get( url, response => {
    const statusCode = response.statusCode;

    if ( statusCode !== 200 ) {
      reject( new Error( 'Download error!' ) );
      return;
    }

    const writeStream = fse.createWriteStream( filePath );
    response.pipe( writeStream );

    writeStream.on( 'error', () => {
      reject( new Error( 'Error writing to file!' ) );
    } );
    writeStream.on( 'finish', () => {
      writeStream.close();
      resolve( true );
    } );
  } );
} ).catch( err => {
  if ( ( <Error>err ).message.includes( 'Download error!' ) ) {
    console.log( `error downloading file ${url}` );
  } else {
    console.log( ( <Error>err ).message );
  }
  return false;
} );

export const downloadResource = async ( destinationPath: string, url: string ): Promise<boolean> => {
  if ( !fse.existsSync( destinationPath ) ) {
    fse.mkdirSync( path.dirname( destinationPath ), { recursive: true } );
    const downloadResult = await downloadFile( url, destinationPath );
    return downloadResult;
  }
  return false;
};

export const downloadResources = async ( dependency: Models.ResourceProperties ): Promise<void> => {
  try {
    await Promise.all( dependency.files.map( async file => {
      await downloadResource( file.path, file.url ?? '' );
    } ) );
  } catch ( error: unknown ) {
    console.log( `error ${( <Error>error ).message} in function downloadResources with file ${dependency.name} ` );
  }
};

export const getCdnjsResourceInformation = async ( dependency: Models.ResourceProperties, resourcesFolder: string ): Promise<Models.ResourceProperties> => {
  const resourceUrl = `https://api.cdnjs.com/libraries/${dependency.name}?fields=name,version,repository,assets,latest,name,filename`;
  let response = <Models.ResourcesCdnjsApiProperties>{};
  try {
    response = ( await axios.get<Models.ResourcesCdnjsApiProperties>( resourceUrl ) ).data;
  } catch ( error: unknown ) {
    console.log( `error ${( <Error>error ).message} in function getCdnjsResourceInformation with dependency ${dependency.name}` );
  }

  let filePropertiesArray = <Models.FileProperties[]>[];
  if ( semver.gt( response.version, dependency.version ) ) {
    try {
      filePropertiesArray = dependency.files.map( file => {
        const destinationPath = path.join( resourcesFolder, `${dependency.name}-${response.version}`, file.name );
        const url = response.latest.replace( response.filename, file.name );
        return <Models.FileProperties>{
          name: file.name,
          path: destinationPath,
          url
        };
      } );
    } catch ( error: unknown ) {
      console.log( `error ${( <Error>error ).message} in function getCdnjsResourceInformation with dependency ${dependency.name}` );
    }
  }
  return <Models.ResourceProperties>{
    name: dependency.name,
    files: filePropertiesArray,
    version: response.version
  };
};

export const getDatatablesResourceInformation = async ( dependency: Models.ResourceProperties, resourcesFolder: string ): Promise<Models.ResourceProperties> => {
  const resourceUrl = 'https://datatables.net/feeds/versions';
  let response = <Models.ResourcesCdnDatatablesApiProperties>{};
  try {
    response = ( await axios.get<Models.ResourcesCdnDatatablesApiProperties>( resourceUrl ) ).data;
  } catch ( error: unknown ) {
    console.log( `error ${( <Error>error ).message} in function getDatatablesResourceInformation with dependency ${dependency.name}` );
  }
  let filePropertiesArray = <Models.FileProperties[]>[];

  try {
    filePropertiesArray = dependency.files.map( file => {
      const destinationPath = path.join( resourcesFolder, `${dependency.name}-${response[ dependency.name ].release.version}`, file.name );
      const url = file.url?.replace( dependency.version, response[ dependency.name ].release.version );
      return <Models.FileProperties>{
        name: file.name,
        path: destinationPath,
        url
      };
    } );
  } catch ( error: unknown ) {
    console.log( `error ${( <Error>error ).message} in function getDatatablesResourceInformation with dependency ${dependency.name}` );
  }
  return <Models.ResourceProperties>{
    name: dependency.name,
    files: filePropertiesArray,
    version: response[ dependency.name ].release.version
  };
};

export const getResourceInformation = async ( dependency: Models.ResourceProperties, resourcesFolder: string ): Promise<Models.ResourceProperties> => {
  return dependency.cdn === 'cdnjs' ?
    getCdnjsResourceInformation( dependency, resourcesFolder ) :
    getDatatablesResourceInformation( dependency, resourcesFolder );
};

export const deleteOldDependencies = async ( resourceProperties: Models.ResourceProperties, resourcesFolder: string ): Promise<void> => {
  await Promise.all( resourceProperties.files.map( async file => {
    await fse.remove( `${resourcesFolder}/${resourceProperties.name}-${resourceProperties.version}/${file.name}` );
    console.log( `file: ${resourcesFolder}/${resourceProperties.name}-${resourceProperties.version}/${file.name}, removed` );
  } ) );
  await fse.remove( `${resourcesFolder}/${resourceProperties.name}-${resourceProperties.version}` );
  console.log( `folder: ${resourcesFolder}/${resourceProperties.name}-${resourceProperties.version}, removed` );
};

export const updateResourcesTemplates = async ( resourceInformation: Models.ResourceProperties, templateFiles: string[] ): Promise<void> => {
  await Promise.all( templateFiles.map( async templateFile => {
    let templateFileContent = await fse.readFile( templateFile, { encoding: 'utf8' } );
    resourceInformation.files.forEach( resourceFile => {
      let regex = RegExp( `href.*${resourceFile.name}" integrity="[^"]+"`, 'u' );
      const newFile = resourceInformation.files.filter( file => file.name === resourceFile.name )[ 0 ];
      const sriValue = sri.fromData( fse.readFileSync( newFile.path ) ).toString();
      let newUrl = `href="${newFile.url!}" integrity="${sriValue}"`;
      templateFileContent = templateFileContent.replace( regex, newUrl );

      regex = RegExp( `src.*${resourceFile.name}" integrity="[^"]+"`, 'u' );
      newUrl = `src="${newFile.url!}" integrity="${sriValue}"`;
      templateFileContent = templateFileContent.replace( regex, newUrl );

      regex = RegExp( `resources.*${resourceFile.name}`, 'u' );
      newUrl = `resources/${resourceInformation.name}-${resourceInformation.version}/${resourceFile.name}`;
      templateFileContent = templateFileContent.replace( regex, newUrl );
    } );
    await fse.writeFile( templateFile, templateFileContent, { encoding: 'utf8' } ).catch( error => {
      console.log( ( <Error>error ).message );
    } );
  } ) );
};

const updateResourcesPropertiesConfigurationJson = async ( configurationData: Models.ResourceProperties[], configurationFile: string ): Promise<void> => {
  await CommonFunctions.saveJsonFile<Models.ResourceProperties[]>( path.dirname( configurationFile ), path.basename( configurationFile ), configurationData );
};

export const updateResources = async ( configurationFile: string, resourcesFolder: string, templates: string[] ): Promise<void> => {
  const originalConfigurationData = ( await CommonFunctions.readJsonFile<Models.ResourceProperties[]>( configurationFile ) )!;
  const newConfigurationData = ( await CommonFunctions.readJsonFile<Models.ResourceProperties[]>( configurationFile ) )!;
  await Promise.all( newConfigurationData.map( async localResourceConf => {
    const remoteResourceConf = await getResourceInformation( localResourceConf, resourcesFolder );
    if ( remoteResourceConf.version && remoteResourceConf.files.length && semver.gt( remoteResourceConf.version, localResourceConf.version ) ) {
      await downloadResources( remoteResourceConf );
      await updateResourcesTemplates( remoteResourceConf, templates );
      await deleteOldDependencies( localResourceConf, resourcesFolder );
      console.log( `Resource ${localResourceConf.name} updated to version ${remoteResourceConf.version}` );
      localResourceConf.files.map( file => {
        file.url = file.url?.replace( localResourceConf.version, remoteResourceConf.version );
        file.path = file.path.replace( localResourceConf.version, remoteResourceConf.version );
        return file;
      } );
      localResourceConf.version = remoteResourceConf.version;
    }
    return localResourceConf;
  } ) );

  if ( JSON.stringify( originalConfigurationData ) === JSON.stringify( newConfigurationData ) ) {
    console.log( 'All the resources are in the latest version' );
  }else{    
    await updateResourcesPropertiesConfigurationJson( newConfigurationData, configurationFile );
  }
};
