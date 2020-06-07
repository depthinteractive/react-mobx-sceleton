export interface IResponseError {
  messages: string;
  code?: number;
  locationss?: Array<{ line: number, column: number }>;
  data?: Array<{ message: string, field: string }>;
  errors?: IResponseError[];
}
export interface IResponse<T> {
  data: T;
  status: number;
  statusText: string;
}
export interface IGraphql<T> { [key: string]: T }
export interface IError<T extends IResponseError>  { response: IResponse<T> }
