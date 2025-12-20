import { Response } from 'express';

type ApiResponseOptions = {
  message?: string;
  data?: any;
  meta?: {
    pagination?: {
      page?: number;
      limit?: number;
      total?: number;
      totalPages?: number;
    };
    [key: string]: any;
  };
};

class ApiResonse {
  static success(
    res: Response,
    {
      message = 'Success',
      data = null,
      meta = {},
    }: ApiResponseOptions & { statusCode?: number } = {}
  ) {
    const statusCode = res.statusCode === 200 ? 200 : res.statusCode;

    return res.status(statusCode).json({
      success: true,
      message,
      data,
      ...(Object.keys(meta).length > 0 && { meta }),
      timestamp: new Date().toISOString(),
    });
  }

  static created(
    res: Response,
    data: any = null,
    message: string = 'Resource created successfully'
  ) {
    return res.status(201).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  static error(
    res: Response,
    message: string = 'Something went wrong',
    statusCode: number = 500,
    errors?: any[]
  ) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors: errors || [],
      timestamp: new Date().toISOString(),
    });
  }
}

export default ApiResonse;
