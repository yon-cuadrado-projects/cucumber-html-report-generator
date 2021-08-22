export default interface CommandLineParameters {
  [x: string]: unknown;
  _: ( number | string )[];
  $0: string;
  browser?: string;
  debug: boolean;
  maxInstances?: number;
}
