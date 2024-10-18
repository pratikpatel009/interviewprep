import { NextFunction, Request, Response } from "express";

const sendErrorDev = (err: any, req: Request, res: Response) => {
  return res.status(err.statusCode).json({
    status: err.status,
    statusCode: err.statusCode,
    success: false,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

export default (err: any, req: Request, res: Response, next: NextFunction) => {
  console.log("ERROR - > ", err);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  sendErrorDev(err, req, res);
};
