"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = exports.app = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
const { MONGO_URI, PORT } = process.env;
async function startServer() {
    try {
        if (!MONGO_URI || typeof MONGO_URI !== 'string')
            throw new Error('MONGO_URI is not undefined or not of type String');
        await mongoose_1.default.connect(MONGO_URI);
        exports.app.listen(PORT, () => console.log(`Port in use: ${PORT}`));
    }
    catch (error) {
        console.error(error);
    }
}
exports.startServer = startServer;
//# sourceMappingURL=serverConfig.js.map