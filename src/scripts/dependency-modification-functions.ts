import type * as Models from '../lib/models/models';
import * as fse from 'fs-extra';
import * as https from 'https';
import * as path from 'path';
import axios from 'axios';
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
      writeStream.close(  ); 
      resolve( true );
    } );
  } );
} ).catch( err => {
  if( ( <Error>err ).message.includes( 'Download error!' ) ){
    console.log( `error downloading file ${url}` );
  } else {
    console.log( ( <Error>err ).message ); 
  }
  return false;
} );
  
export const downloadResource = async ( destinationPath: string, url: string ): Promise<boolean> =>{
  if( ! fse.existsSync( destinationPath ) ){
    fse.mkdirSync( path.dirname( destinationPath ), { recursive: true } );  
    const downloadResult = await downloadFile( url, destinationPath );
    return downloadResult;
  }
  return false;
};
  
export const getCdnjsResourceInformation = async ( dependency: Models.ResourceProperties, resourcesFolder: string ): Promise<Models.ResourceProperties> =>{
  const resourceUrl = `https://api.cdnjs.com/libraries/${dependency.name}?fields=name,version,repository,assets,latest,name,filename`;
  let response = <Models.ResourcesCdnjsApiProperties>{};
  try{
    response = ( await axios.get<Models.ResourcesCdnjsApiProperties>( resourceUrl ) ).data;
  }catch( error:unknown ){
    console.log( `error ${( <Error>error ).message} in function getCdnjsResourceInformation with dependency ${dependency.name}` );
  }
  
  const filePropertiesArray = <Models.FileProperties[]>[];
  try{
    await Promise.all( dependency.files.map( async file =>{
      const destinationPath = path.join( resourcesFolder,`${dependency.name}-${response.version}` ,file.name );
      const url = response.latest.replace( response.filename,file.name );
      await downloadResource( destinationPath, url );
      const fileProperties = <Models.FileProperties>{
        name: file.name,
        path: destinationPath,
        sriValue: response.assets[response.assets.length - 1].sri[file.name],
        url
      };
      filePropertiesArray.push( fileProperties );
    } ) );
  }catch( error:unknown ){
    console.log( `error ${( <Error>error ).message} in function getCdnjsResourceInformation with dependency ${dependency.name}` );
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
  try{
    response = ( await axios.get<Models.ResourcesCdnDatatablesApiProperties>( resourceUrl ) ).data;
  }catch( error: unknown ){
    console.log( `error ${( <Error>error ).message} in function getDatatablesResourceInformation with dependency ${dependency.name}` );
  }
  const filePropertiesArray = <Models.FileProperties[]>[];
  
  try{
    await Promise.all( dependency.files.map( async file =>{
      const destinationPath = path.join( resourcesFolder,`${dependency.name}-${response[dependency.name].release.version}` ,file.name );
      const url = file.url?.replace( dependency.version, response[dependency.name].release.version );
      const fileDownloaded = await downloadResource( destinationPath, url ! );
      const fileProperties = <Models.FileProperties>{
        name: file.name,
        path: destinationPath,
        sriValue: fileDownloaded ? sri.fromData( fse.readFileSync( destinationPath ) ).toString() : '',
        url
      };
      if( fileDownloaded ){
        filePropertiesArray.push( fileProperties );
      }
    } ) );
  }catch( error: unknown ){
    console.log( `error ${( <Error>error ).message} in function getDatatablesResourceInformation with dependency ${dependency.name}` );
  }
  return <Models.ResourceProperties>{
    name: dependency.name,
    files: filePropertiesArray,
    version: response[dependency.name].release.version   
  };
};
  
export const updateResourcesForOneDependency = async( resourceProperties: Models.ResourceProperties, resourcesFolder: string, templateFiles: string[] ): Promise<boolean> =>{
  const resourceInformation = resourceProperties.cdn === 'cdnjs' ?
    await getCdnjsResourceInformation( resourceProperties, resourcesFolder ) : 
    await getDatatablesResourceInformation( resourceProperties, resourcesFolder );
  await Promise.all( templateFiles.map( async templateFile =>{
    let templateFileContent =  await fse.readFile( templateFile , { encoding: 'utf8' } );
    if( resourceInformation.files.length ){
      resourceInformation.files.forEach( resourceFile => {
        let regex = RegExp( `href.*${resourceFile.name}" integrity="[^"]+"`,'u' );
        const newFile = resourceInformation.files.filter( file => file.name === resourceFile.name )[0];
        let newUrl = `href="${newFile.url!}" integrity="${newFile.sriValue}"`;
        templateFileContent = templateFileContent.replace( regex, newUrl );
    
        regex = RegExp( `src.*${resourceFile.name}" integrity="[^"]+"`,'u' );
        newUrl = `src="${newFile.url!}" integrity="${newFile.sriValue}"`;
        templateFileContent = templateFileContent.replace( regex, newUrl );
    
        regex = RegExp( `resources.*${resourceFile.name}`,'u' );
        newUrl = `resources/${resourceProperties.name}-${resourceInformation.version}/${resourceFile.name}`;
        templateFileContent = templateFileContent.replace( regex, newUrl );
      } );
      await fse.writeFile( templateFile, templateFileContent, { encoding: 'utf8' } ).catch( error =>{
        console.log( ( <Error>error ).message );
      } );
    }
  } ) );
  try {
    if( resourceProperties.version !== resourceInformation.version && resourceInformation.files.length ){
      console.log( `Resource ${resourceProperties.name} updated to version ${resourceInformation.version}` );
      resourceProperties.files.map( file => {
        file.url = file.url?.replace( resourceProperties.version,resourceInformation.version );
        file.path = file.path.replace( resourceProperties.version,resourceInformation.version );
        return file;
      } );
      resourceProperties.version = resourceInformation.version;
      return true;
    }
  }catch( err: unknown ){
    console.log( ( <Error>err ).message );
  }
  return false;
}; 