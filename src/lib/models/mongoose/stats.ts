export interface Stats {
  db: string;
  collections: number;
  objects: number;
  avgObjSize: number;
  dataSize: number;
  storageSize: number;
  numExtents: number;
  indexes: number;
  indexSize: number;
  fileSize: number;
  nsSizeMB: number;
  dataFileVersion: {
    major: number;
    minor: number;
  };
  extentFreeList: {
    num: number;
    totalSize: number;
  };
  ok: number;
}
