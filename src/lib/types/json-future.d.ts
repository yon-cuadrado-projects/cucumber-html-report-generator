declare module 'json-future' {
  import type * as loadJsonFile from 'load-json-file';
  type JSONPrimitive = boolean | number | string | null;
  interface JSONObject { [k: string]: JSONValue }
  type JSONValue = JSONArray | JSONObject | JSONPrimitive;
  type JSONArray = JSONValue[];
  import type * as writeJsonFile from 'write-json-file';

  export function stringify( data: any, replacer?: any, space?: any ): string;
  export function stringifyAsync( data: any ): Promise<string>;
  export function parse( input: string, filepath?: string ): any;
  export function parseAsync( input: string, filepath?: string ): Promise<any>;
  export function load( filePath: string, options?: loadJsonFile.Options ): Promise<JSONValue>;
  export function loadAsync( filePath: string, options?: loadJsonFile.Options ): Promise<JSONValue>;
  export function save( filePath: string, data: unknown, options?: writeJsonFile.Options ): void;
  export function saveAsync( filePath: string, data: unknown, options?: writeJsonFile.Options ): Promise<void>;
}
