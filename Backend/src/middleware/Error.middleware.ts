import { NextFunction, Request, Response } from 'express';

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'ValidationError') {
    const errors = Object.values((err as any).error).map((el: any) => ({
      message: el.message,
      field: el.path,
    }));

    return res.status(400).json({
      success: false,
      errors,
    });
  }

  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue)[0];
  }
};
