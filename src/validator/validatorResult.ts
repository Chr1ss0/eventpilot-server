import { Request } from 'express';
import { validationResult } from 'express-validator';

function validatorResult(req: Request) {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const errorString = validationErrors.array().reduce((accumulator, error) => `${accumulator + error.msg}\n`, '');
    throw new Error(errorString);
  }
}

export default validatorResult;
