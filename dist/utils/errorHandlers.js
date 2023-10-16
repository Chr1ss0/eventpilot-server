"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forbiddenError = exports.notAcceptedError = exports.conflictError = exports.internalServerError = void 0;
function errorFunction(res, status, message) {
    res.status(status).json({ message: `${message}` });
}
function internalServerError(res, message) {
    errorFunction(res, 500, message);
}
exports.internalServerError = internalServerError;
function conflictError(res, message) {
    errorFunction(res, 409, message);
}
exports.conflictError = conflictError;
function notAcceptedError(res, message) {
    errorFunction(res, 406, message);
}
exports.notAcceptedError = notAcceptedError;
function forbiddenError(res, message) {
    errorFunction(res, 403, message);
}
exports.forbiddenError = forbiddenError;
//# sourceMappingURL=errorHandlers.js.map