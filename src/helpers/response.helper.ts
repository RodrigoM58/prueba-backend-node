import { Response } from 'express'
import IResponse from '../interfaces/response.interface'
import logger from '../../lib/logger'

export class ResponseHelper {
  static success<T>(res: Response, message: string, data: T, code = 200): Response {
    const response: IResponse = {
      ok: true,
      message,
      response: data,
      code,
    }

    return res.status(code).json(response)
  }
  
  static error(res: Response, message: string, error: any, code = 500): Response {
    const response: IResponse = {
      ok: false,
      message,
      response: error,
      code,
    }

    logger.error(`[ResponseHelper]: ${error}`)
    return res.status(code).json(response)
  }
}