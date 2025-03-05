import { NextFunction, Request, Response } from 'express';
import { ObjectSchema } from 'joi';
import logger from '../../lib/logger';

export const validateRequest = (schema: ObjectSchema) => {

  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false })

    if (error) {
      const errors = error.details.map(detail => detail.message)

      logger.error(errors)
      res.status(400).json({
        ok: false,
        message: 'Error de validación',
        response: errors,
        code: 400
      })
    } else {
      next()
    }
  }
}