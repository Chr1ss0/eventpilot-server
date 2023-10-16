"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteToken = exports.verifyToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { JWT_SECRET } = process.env;
if (!JWT_SECRET || typeof JWT_SECRET !== 'string') {
    throw new Error('JWT_SECRET is undefined or not a string');
}
function createToken(payload) {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}
exports.createToken = createToken;
function verifyToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (error) {
        throw new Error(`Verify token failed! : ${error}`);
    }
}
exports.verifyToken = verifyToken;
function deleteToken(res) {
    res.clearCookie('token');
    res.sendStatus(200);
}
exports.deleteToken = deleteToken;
//# sourceMappingURL=token.js.map