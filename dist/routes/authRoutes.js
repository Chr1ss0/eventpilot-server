"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../controller/userController"));
const authRoutes = express_1.default.Router();
authRoutes.get('/', userController_1.default);
exports.default = authRoutes;
//# sourceMappingURL=authRoutes.js.map