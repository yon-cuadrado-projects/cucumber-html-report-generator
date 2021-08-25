import * as Messages from '../helpers/console-messages';
import * as Models from '../models/models';
import * as jsonFuture from 'json-future';
import * as path from 'path';
import fs, { promises as fsp } from 'fs';
import type { CucumberMessage } from '../types/cucumber-messages';
import type { Readable } from 'stream';
import type { Stats } from 'fs';
import moment from 'moment';
import os from 'os';



export const streamToArrayAsync = async ( stream: Readable ): Promise<CucumberMessage[]> => new Promise( ( resolve, reject ) => {
  const items = <CucumberMessage[]>[];
  stream.on( 'data',  ( item: CucumberMessage ) =>{
    items.push( item ); 
  } );
  stream.on( 'error', reject );
  stream.on( 'end', () => {
    resolve( items );
  } );
} );

export const updatePercentages = ( results: Models.FeatureModuleResults | Models.ModuleResults ): Models.FeatureModuleResults | Models.ModuleResults => {
  results.ambiguousPercentage = ( results.ambiguous ? results.ambiguous / results.total * 100 : 0 ).toFixed( 2 );
  results.failedPercentage = ( results.failed ? results.failed / results.total * 100 : 0 ).toFixed( 2 );
  results.undefinedPercentage = ( results.undefined ? results.undefined / results.total * 100 : 0 ).toFixed( 2 );
  results.passedPercentage = ( results.passed ? results.passed / results.total * 100 : 0 ).toFixed( 2 );
  results.pendingPercentage = ( results.pending ? results.pending / results.total * 100 : 0 ).toFixed( 2 );
  results.skippedPercentage = ( results.skipped ? results.skipped / results.total * 100 : 0 ).toFixed( 2 );
  if ( 'variousPercentage' in results ) {
    results.variousPercentage = ( results.various ? results.various / results.total * 100 : 0 ).toFixed( 2 );
    return results;
  }
  return results;
};

export const updateResultsAndPercentages = ( sourceResults: Models.ModuleResults, targetResults: Models.ModuleResults ): Models.ModuleResults => {
  sourceResults.passed += targetResults.passed;
  sourceResults.failed += targetResults.failed;
  sourceResults.skipped += targetResults.skipped;
  sourceResults.pending += targetResults.pending;
  sourceResults.undefined += targetResults.undefined;
  sourceResults.ambiguous += targetResults.ambiguous;
  sourceResults.total += targetResults.total;

  sourceResults.ambiguousPercentage = ( sourceResults.ambiguous ? sourceResults.ambiguous / sourceResults.total * 100 : 0 ).toFixed( 2 );
  sourceResults.failedPercentage = ( sourceResults.failed ? sourceResults.failed / sourceResults.total * 100 : 0 ).toFixed( 2 );
  sourceResults.undefinedPercentage = ( sourceResults.undefined ? sourceResults.undefined / sourceResults.total * 100 : 0 ).toFixed( 2 );
  sourceResults.passedPercentage = ( sourceResults.passed ? sourceResults.passed / sourceResults.total * 100 : 0 ).toFixed( 2 );
  sourceResults.pendingPercentage = ( sourceResults.pending ? sourceResults.pending / sourceResults.total * 100 : 0 ).toFixed( 2 );
  sourceResults.skippedPercentage = ( sourceResults.skipped ? sourceResults.skipped / sourceResults.total * 100 : 0 ).toFixed( 2 );
  return sourceResults;
};

export const updateStatus = ( featureResults: Models.FeatureResults ): Models.Result[] => {
  const result = <Models.Result[]>[];

  if ( featureResults.scenarios.ambiguous ) {
    result.push( { icon: 'fas fa-question-circle ambiguous-color', status: Models.Status.ambiguous } );
  }

  if ( featureResults.scenarios.pending ) {
    result.push( { icon: 'fas fa-question-circle pending-color', status: Models.Status.pending } );
  }

  if ( featureResults.scenarios.undefined ) {
    result.push( { icon: 'fa fa-question-circle undefined-color', status: Models.Status.undefined } );
  }

  if ( featureResults.scenarios.skipped ) {
    result.push( { icon: 'arrow-circle-right skipped-color', status: Models.Status.skipped } );
  }

  if ( featureResults.scenarios.failed ) {
    result.push( { icon: 'exclamation-circle failed-color', status: Models.Status.failed } );
  }

  if ( featureResults.scenarios.passed ) {
    result.push( { icon: 'check-circle passed-color', status: Models.Status.passed } );
  }

  return result;
};

export const isMetadata = ( metadata: Models.Metadata[] | undefined ): metadata is Models.Metadata[] =>
  Array.isArray( metadata )
    ? !metadata.filter( metadataElement => ( !( 'name' in metadataElement ) || !( 'value' in metadataElement ) ) ).length
    : false;

export const escapeHTML = ( value: string ): string => value
  .replace( /&/gu, '&amp;' )
  .replace( /</gu, '&lt;' )
  .replace( />/gu, '&gt;' );

export const isBase64 = ( value: string ): boolean => {
  const base64regex = /^(?<firstGroup>[0-9a-zA-Z+/]{4})*(?<secondGroup>(?<thirdGroup>[0-9a-zA-Z+/]{2}==)|(?<fourthGroup>[0-9a-zA-Z+/]{3}=))?$/u;

  return base64regex.test( value );
};

export const getFilesAsync = async ( dir: string ): Promise<string[]> => {
  let files: string[] = [];
  const getFiles = async ( folder: string ): Promise<string[]> => {
    files = await fsp.readdir( folder );
    const result: Promise<string[]>[] = files.map( async ( file ) => {
      const fileNameAndPath = path.join( folder, file );      
      return fsp.stat( fileNameAndPath ).then( ( stat ) => ( stat.isDirectory() ? getFiles( fileNameAndPath ) : [ fileNameAndPath ] ) );
    } );
    return <string[]>Array.prototype.concat( ...( await Promise.all( result ) ) );
  };

  return getFiles( dir );
};

export const checkFolder = ( file: string | undefined ): boolean => {
  if ( typeof file === 'undefined' ) {
    return false;
  }
  let stats = <Stats>{};
  try {
    stats = fs.statSync( file );
  } catch ( error: unknown ) {
    throw new Error( Messages.invalidPathProvided( file ) );
  }

  return stats.isDirectory();
};

export const readJsonFile = async <T> ( file: string, encoding: BufferEncoding = 'utf8' ): Promise<T | null> => {
  const report = await fsp.readFile( file, { encoding } );

  try{
    return <T>jsonFuture.parse( report );
  }catch( error: unknown ){
    console.log( ( Messages.invalidJsonProvided( file, ( <Error>error ).message ) )  );
  }
  return null;
};

export const saveJsonFile = async<T> ( filePath: string | undefined, fileName: string, json: T ): Promise<boolean> => {
  const fileNameAndPath = path.join( filePath!, fileName );
  const jsonString = await jsonFuture.stringifyAsync( { data: json, replacer: null, space: 4 } );  
  await fsp.writeFile( fileNameAndPath, jsonString, { encoding: 'utf8' } );
  return true;
};

export const getDateFormatted = ( date: Date ): string => moment( date ).format( 'YYYY-MM-DD HH:mm:ss' );

export const convertTimeFromNanoSecondsToHHMMSS = ( time: number, ceilBy = 'millisecond' ): string => {
  const value = moment.utc( time / 1000000 );
  return value.subtract( 1, <moment.unitOfTime.DurationConstructor>'millisecond' ).add( 1, <moment.unitOfTime.DurationConstructor>ceilBy ).startOf( <moment.unitOfTime.DurationConstructor>ceilBy ).format( 'HH:mm:ss.SSS' );
};

export const arraymove = <T> ( arr: T[], fromIndex: number, toIndex: number ): T[] => {
  const element = arr[fromIndex];
  const deleteCountOne = 1;
  arr.splice( fromIndex, deleteCountOne );
  const deleteCountZero = 0;
  arr.splice( toIndex, deleteCountZero, element );
  return arr;
};

export const exists = ( filePath: string ): boolean => {  
  try {
    fs.accessSync( filePath );
    return true;
  } catch {
    return false;
  }
};

export const initializePath =  ( reportPath?: string | undefined ): string  =>{
  let reportPathFixed = reportPath;
  const resultCheckReportCreationPath = checkFolder( reportPath );

  if ( !resultCheckReportCreationPath && typeof reportPath === 'undefined' ) {
    const date = moment().format( 'YYYY-MM-DD__HH-mm-ss' );
    reportPathFixed = path.join( os.tmpdir(), 'cucumber-html-report-generator', date );
    fs.mkdirSync( reportPathFixed, { recursive: true } );
  }
  
  return reportPathFixed!;
};

export const pathExists = async ( folderPath: string ): Promise<boolean> => {
  return new Promise( ( resolve ) => {
    fs.access( folderPath, fs.constants.F_OK, error => {
      resolve( !error );
    } );
  } );
};

export const emptyFolder = async ( folderPath: string ): Promise<void> => {
  /* istanbul ignore next */
  if ( await pathExists( folderPath ) ) {
    await fsp.rm( folderPath,{ recursive: true }  );
  }
  await fsp.mkdir( folderPath,{ recursive: true } );
};
