"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const errorHandlers_1 = require("../utils/errorHandlers");
function validatorResult(req, res) {
    const validationErrors = (0, express_validator_1.validationResult)(req);
    if (!validationErrors.isEmpty()) {
        const errorString = validationErrors.array().reduce((accumulator, error) => `${accumulator + error.msg}\n`, '');
        (0, errorHandlers_1.notAcceptedError)(res, errorString);
        throw new Error('Validation Errors');
    }
}
exports.default = validatorResult;
//# sourceMappingURL=validatorResult.js.map