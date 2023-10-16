"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = require("../utils/token");
const errorHandlers_1 = require("../utils/errorHandlers");
function auth(req, res, next) {
    const { token } = req.cookies;
    try {
        (0, token_1.verifyToken)(token);
        next();
    }
    catch (error) {
        console.error(error);
        (0, errorHandlers_1.notAcceptedError)(res, 'Token ungültig.');
    }
}
exports.default = auth;
//# sourceMappingURL=authMiddleware.js.map