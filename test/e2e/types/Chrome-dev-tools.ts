export interface ResponseReceived{
  requestId: string;
  LoaderId:string;
  timestamp: number;
  type: string;
  response: Response;
  frameId?: string;
}
