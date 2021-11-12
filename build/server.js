"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var mongoose_1 = __importDefault(require("mongoose"));
var express_list_endpoints_1 = __importDefault(require("express-list-endpoints"));
var index_1 = __importDefault(require("./services/users/index"));
var errorHandlers_js_1 = require("./errorHandlers/errorHandlers.js");
var index_2 = __importDefault(require("./services/accomodation/index"));
process.env.TS_NODE_DEV && require("dotenv").config();
var server = (0, express_1.default)();
var _a = process.env.PORT, PORT = _a === void 0 ? 3009 : _a;
// MIDDLEWARE
server.use((0, cors_1.default)());
server.use(express_1.default.json());
// SERVICES
server.use("/accomodation", index_2.default);
server.use('/user', index_1.default);
server.use(errorHandlers_js_1.unauthorizedHandler);
server.use(errorHandlers_js_1.forbiddenHandler);
server.use(errorHandlers_js_1.catchAllHandler);
server.use(errorHandlers_js_1.notFoundHandler);
server.use(errorHandlers_js_1.badRequestHandler);
server.use(errorHandlers_js_1.genericErrorHandler);
server.listen(PORT, function () {
    // connect to mongoose Server
    mongoose_1.default.connect(process.env.MONGODB, {});
    console.log("Server is listening on port " + PORT);
    console.table((0, express_list_endpoints_1.default)(server));
});
server.on("error", function (error) {
    console.log("Server is stopped ", error);
});
