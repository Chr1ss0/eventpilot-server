"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const serverConfig_1 = require("./utils/serverConfig");
const corsConfig_1 = __importDefault(require("./utils/corsConfig"));
serverConfig_1.app.use((0, morgan_1.default)('dev'));
serverConfig_1.app.use((0, cors_1.default)(corsConfig_1.default));
serverConfig_1.app.use(express_1.default.json());
serverConfig_1.app.use((0, cookie_parser_1.default)());
serverConfig_1.app.use('/api/auth', authRoutes_1.default);
(async () => {
    try {
        await (0, serverConfig_1.startServer)();
        console.log('Server is Online');
    }
    catch (error) {
        console.log(`Error while starting Server: ${error}`);
    }
})();
//# sourceMappingURL=app.js.map