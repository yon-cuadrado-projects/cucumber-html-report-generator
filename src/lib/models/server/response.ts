export interface ResponseBody{
  data: results[];
  htmlreport: string;
  reportInsertionResult: boolean;
  reportId?: string;
}
interface results{
  value: string;
}

export interface Response {
  reportId: string;
}
