import { createError, errorResponse } from '../utils/apiResponse.js';
import { ERROR_CODES } from '../utils/errorDictionary.js';

export function errorHandler(error, req, res, next) {
  let handledError = error;

  if (error.name === 'CastError') {
    handledError = createError(ERROR_CODES.INVALID_ID_MONGOOSE);
  }

  return errorResponse(res, {
    statusCode: handledError.statusCode,
    message: handledError.message,
    code: handledError.code
  });
}
