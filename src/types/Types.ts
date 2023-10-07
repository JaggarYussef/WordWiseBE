import { ErrorRequestHandler, Request, Response, NextFunction } from "express";

interface RequestError extends Error {
  statusCode?: number;
  Message?: string;
}

export interface MiddlwareParams {
  request: Request;
  response: Response;
  error: RequestError;
  next: NextFunction;
}
