"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_errors_1 = __importDefault(require("http-errors"));
var schema_js_1 = __importDefault(require("./schema.js"));
var schema_js_2 = __importDefault(require("../accomodation/schema.js"));
var tools_js_1 = require("../../auth/tools.js");
var token_js_1 = require("../../auth/token.js");
var host_js_1 = require("../../auth/host.js");
var userRouter = express_1.default.Router();
userRouter.post("/", host_js_1.hostOnlyMiddleware, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _id, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user = new schema_js_1.default(req.body);
                return [4 /*yield*/, user.save()];
            case 1:
                _id = (_a.sent())._id;
                res.send({ _id: _id });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                next(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
userRouter.post("/login", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, accessToken, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, schema_js_1.default.checkCredentials(email, password)];
            case 1:
                user = _b.sent();
                if (!user) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, tools_js_1.JWTAuthenticate)(user)];
            case 2:
                accessToken = _b.sent();
                res.send({ accessToken: accessToken });
                return [3 /*break*/, 4];
            case 3:
                next((0, http_errors_1.default)(401, "Credentials are not correct!"));
                _b.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_2 = _b.sent();
                next(error_2);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
userRouter.get("/me", token_js_1.JWTAuthMiddleware, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            res.send(req.user);
        }
        catch (error) {
            next(error);
        }
        return [2 /*return*/];
    });
}); });
userRouter.put("/me", token_js_1.JWTAuthMiddleware, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, role, updatedProfile, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                if (!req.body.password) return [3 /*break*/, 1];
                next((0, http_errors_1.default)(403, "You are not allowed to change password"));
                return [3 /*break*/, 3];
            case 1:
                _a = req.body, email = _a.email, role = _a.role;
                return [4 /*yield*/, schema_js_1.default.findByIdAndUpdate(req.user._id, { email: email, role: role }, { new: true })];
            case 2:
                updatedProfile = _b.sent();
                res.send(updatedProfile);
                _b.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                error_3 = _b.sent();
                next(error_3);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
userRouter.post("/forgot-password", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, payload, temporaryAccessToken, link, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, schema_js_1.default.findOne({ email: req.body.email })];
            case 1:
                user = _a.sent();
                if (!user) return [3 /*break*/, 3];
                console.log("found");
                payload = {
                    email: user.email,
                    id: user.id,
                };
                return [4 /*yield*/, (0, tools_js_1.generateTemporaryJWT)(payload)];
            case 2:
                temporaryAccessToken = _a.sent();
                link = "http://localhost:3000/reset-password/" + user._id + "/" + temporaryAccessToken;
                console.log(link);
                res.send({
                    message: "Password reset link has been sent to your email",
                    tmpToken: temporaryAccessToken,
                });
                return [3 /*break*/, 4];
            case 3:
                next((0, http_errors_1.default)(404, "User not found"));
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                err_1 = _a.sent();
                next(err_1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
userRouter.get("/reset-password/:id/:token", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, token, user, decodedToken, email, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.params, id = _a.id, token = _a.token;
                return [4 /*yield*/, schema_js_1.default.findById(id)];
            case 1:
                user = _b.sent();
                if (!user) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, tools_js_1.verifyJWT)(req.params.token)];
            case 2:
                decodedToken = _b.sent();
                console.log(decodedToken);
                email = decodedToken.email;
                res.send(email);
                return [3 /*break*/, 4];
            case 3:
                next((0, http_errors_1.default)(404, "User does not exists"));
                _b.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                err_2 = _b.sent();
                next(err_2);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
userRouter.post("/reset-password/:id/:token", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, decodedToken, email, id, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                return [4 /*yield*/, schema_js_1.default.findById(req.params.id)];
            case 1:
                user = _a.sent();
                return [4 /*yield*/, (0, tools_js_1.verifyJWT)(req.params.token)];
            case 2:
                decodedToken = _a.sent();
                email = decodedToken.email, id = decodedToken.id;
                if (!(user && user.email === email && user._id.toString() === id)) return [3 /*break*/, 4];
                user.password = req.body.password;
                return [4 /*yield*/, user.save()];
            case 3:
                _a.sent();
                res.send("password changed");
                return [3 /*break*/, 5];
            case 4:
                next((0, http_errors_1.default)(404, "User not found"));
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                err_3 = _a.sent();
                next(err_3);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
userRouter.delete("/me", token_js_1.JWTAuthMiddleware, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, req.user.deleteOne()];
            case 1:
                _a.sent();
                res.send("deleted");
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                next(error_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// not possible with only accessToken
userRouter.post("/me/logout", token_js_1.JWTAuthMiddleware, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log(req.user.accessToken);
                req.user.accessToken = null;
                return [4 /*yield*/, req.user.save()];
            case 1:
                _a.sent();
                res.send("logged out");
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                next(error_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
userRouter.get("/", token_js_1.JWTAuthMiddleware, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var users, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, schema_js_1.default.find()];
            case 1:
                users = _a.sent();
                res.send(users);
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                next(error_6);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
userRouter.get("/:userID", token_js_1.JWTAuthMiddleware, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.params.userID;
                return [4 /*yield*/, schema_js_1.default.findById(userId)];
            case 1:
                user = _a.sent();
                if (user) {
                    res.send(user);
                }
                else {
                    next((0, http_errors_1.default)(404, "user with " + userId + " not found!"));
                }
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                next(error_7);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
userRouter.post("/register", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var email, alreadyExists, user, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                email = req.body.email;
                return [4 /*yield*/, schema_js_1.default.checkIfExists(email)];
            case 1:
                alreadyExists = _a.sent();
                if (!alreadyExists) return [3 /*break*/, 2];
                // shoudl redirect to login page
                // res.redirect(`http://localhost:3000/login`);
                next((0, http_errors_1.default)(401, "user already exists go to log-in page"));
                return [3 /*break*/, 4];
            case 2:
                user = new schema_js_1.default(req.body);
                return [4 /*yield*/, user.save()];
            case 3:
                _a.sent();
                res.send(user);
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_8 = _a.sent();
                next(error_8);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
userRouter.put("/:userID", token_js_1.JWTAuthMiddleware, host_js_1.hostOnlyMiddleware, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, modifiedUser, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.params.userID;
                return [4 /*yield*/, schema_js_1.default.findByIdAndUpdate(userId, req.body, {
                        new: true,
                    })];
            case 1:
                modifiedUser = _a.sent();
                if (modifiedUser) {
                    res.send(modifiedUser);
                }
                else {
                    next((0, http_errors_1.default)(404, "user with id " + userId + " not found!"));
                }
                return [3 /*break*/, 3];
            case 2:
                error_9 = _a.sent();
                next(error_9);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
userRouter.delete("/:userID", token_js_1.JWTAuthMiddleware, host_js_1.hostOnlyMiddleware, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, deletedUser, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.params.userID;
                return [4 /*yield*/, schema_js_1.default.findByIdAndDelete(userId)];
            case 1:
                deletedUser = _a.sent();
                if (deletedUser) {
                    res.status(204).send();
                }
                else {
                    next((0, http_errors_1.default)(404, "user with id " + userId + " not found!"));
                }
                return [3 /*break*/, 3];
            case 2:
                error_10 = _a.sent();
                next(error_10);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
userRouter.post("/refreshToken", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var currentRefreshToken, _a, accessToken, refreshToken, error_11;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                currentRefreshToken = req.body.currentRefreshToken;
                return [4 /*yield*/, verifyRefreshAndGenerateTokens(currentRefreshToken)];
            case 1:
                _a = _b.sent(), accessToken = _a.accessToken, refreshToken = _a.refreshToken;
                res.send({ accessToken: accessToken, refreshToken: refreshToken });
                return [3 /*break*/, 3];
            case 2:
                error_11 = _b.sent();
                next(error_11);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
userRouter.get("/me/accomodation", token_js_1.JWTAuthMiddleware, host_js_1.hostOnlyMiddleware, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var accomodation, error_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, schema_js_2.default.find({
                        host: req.user._id,
                    }).populate({
                        path: "host",
                        select: "email",
                    })];
            case 1:
                accomodation = _a.sent();
                res.status(200).send(accomodation);
                return [3 /*break*/, 3];
            case 2:
                error_12 = _a.sent();
                next(error_12);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = userRouter;
