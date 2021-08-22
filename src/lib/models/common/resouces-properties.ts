export interface ResourceProperties{
  name: string;
  version: string;
  cdn: string;
  files: FileProperties[];
}

export interface FileProperties{
  name: string;
  path: string;
  sriValue: string;
  url?: string;
}

export interface CollectionElement{
  [name: string]: string;
}

export interface Asset{
  version: string;
  files: CollectionElement;
  rawFiles: CollectionElement;
  sri: CollectionElement;
}

export interface ResourcesCdnjsApiProperties{
  name: string;
  version: string;
  assets:Asset[];
  latest: string;
  filename: string;
}

export interface DatatablesFilesElement{
  'debug':{
    'md5': string;
    'path': string;
  };
  'min':{
    'md5': string;
    'path': string;
  };
  'css':{
    'md5': string;
    'path': string;
  };
  'cssMin':{
    'md5': string;
    'path': string;
  };
}

export interface DatatablesElement{
  version: string;
  date: number;
  files:DatatablesFilesElement;
}

enum versions {
  release = 'release',
  nightly = 'nightly'
}

export interface ResourcesCdnDatatablesApiProperties {
  [name: string]:{
    [key in versions]: DatatablesElement;
  };
};
