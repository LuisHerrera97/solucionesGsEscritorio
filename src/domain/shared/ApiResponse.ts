export type ApiResponse<T> = {
  httpCode: number;
  hasError: boolean;
  message: string;
  errorCode?: number;
  result: T;
};
