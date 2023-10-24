// import { Response } from 'express';
// import { errorFunction, internalServerError } from './errorHandlers';
// import { UserI } from '../shared/types/modelTypes';
//
// function processErrorResult(
//   res: Response,
//   result: UserI | number,
//   errorCode: number,
//   serverErrorCode: number,
//   message: string,
// ) {
//   if (typeof result === 'number') {
//     if (result === errorCode) return errorFunction(res, serverErrorCode, message);
//     return internalServerError(res, 'Ein Interner Serverfehler ist aufgetreten');
//   }
//   return result
// }
//
// export default processErrorResult;

// Maybe for refacoring
