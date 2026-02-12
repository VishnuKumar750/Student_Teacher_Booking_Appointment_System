import { AxiosError } from "axios";

export interface ApiError {
  message?: string;
  error?: string;
}

export type TypedAxiosError = AxiosError<ApiError>;
