import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { notAcceptedError } from '../utils/errorHandlers';

function validatorResult(req: Request, res: Response) {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const errorString = validationErrors.array().reduce((accumulator, error) => `${accumulator + error.msg}\n`, '');
    notAcceptedError(res, errorString);
    throw new Error('Validation Errors');
  }
}

export default validatorResult;
