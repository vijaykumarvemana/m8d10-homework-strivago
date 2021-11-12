"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hostOnlyMiddleware = void 0;
var http_errors_1 = __importDefault(require("http-errors"));
var hostOnlyMiddleware = function (req, res, next) {
    if (req.user.role === "Host") {
        next();
    }
    else {
        next((0, http_errors_1.default)(403, "host Only!"));
    }
};
exports.hostOnlyMiddleware = hostOnlyMiddleware;
