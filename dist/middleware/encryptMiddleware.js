"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
function encrypt(req, _, next) {
    const hmac = (0, crypto_1.createHmac)('sha256', req.body.password);
    req.body.password = hmac.digest('hex');
    next();
}
exports.default = encrypt;
//# sourceMappingURL=encryptMiddleware.js.map