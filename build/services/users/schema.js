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
var mongoose_1 = __importDefault(require("mongoose"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var Schema = mongoose_1.default.Schema, model = mongoose_1.default.model;
var userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: [true, "Such email already exists"],
    },
    password: { type: String },
    role: { type: String, default: "Guest", enum: ["Guest", "Host"] },
    accessToken: { type: String },
}, {
    timestamps: true,
});
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function () {
        var user, plainpassword, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    user = this;
                    plainpassword = user.password;
                    console.log("coming from schema", plainpassword);
                    if (!user.isModified("password")) return [3 /*break*/, 2];
                    _a = user;
                    return [4 /*yield*/, bcrypt_1.default.hash(plainpassword, 10)];
                case 1:
                    _a.password = _b.sent();
                    console.log(user.password);
                    _b.label = 2;
                case 2:
                    next();
                    return [2 /*return*/];
            }
        });
    });
});
userSchema.methods.toJSON = function f(x) {
    var user = this;
    var userObject = user.toObject();
    delete userObject.password;
    delete userObject.createdAt;
    delete userObject.updatedAt;
    delete userObject.__v;
    delete userObject.accessToken;
    return userObject;
};
userSchema.statics.checkIfExists = function (email) {
    return __awaiter(this, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.findOne({ email: email })];
                case 1:
                    user = _a.sent();
                    if (user) {
                        console.log("user already exists");
                        return [2 /*return*/, true];
                    }
                    else {
                        console.log("new user");
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/];
            }
        });
    });
};
userSchema.statics.checkCredentials = function (email, plainpassword) {
    return __awaiter(this, void 0, void 0, function () {
        var user, isMatch;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.findOne({ email: email })];
                case 1:
                    user = _a.sent();
                    if (!user) return [3 /*break*/, 3];
                    console.log("user find:", user);
                    return [4 /*yield*/, bcrypt_1.default.compare(plainpassword, user.password)];
                case 2:
                    isMatch = _a.sent();
                    if (isMatch)
                        return [2 /*return*/, user];
                    else
                        return [2 /*return*/, null];
                    return [3 /*break*/, 4];
                case 3: return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
};
// userSchema.statics.checkResetCredentials = async function(email){
//     const user = await this.findOne({email: email});
//     if(user){
//     }
// }
exports.default = model("user", userSchema);
