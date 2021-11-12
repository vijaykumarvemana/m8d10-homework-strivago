"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema, model = mongoose_1.default.model;
var AccomodationSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    host: { type: Schema.Types.ObjectId, required: true, ref: "user" },
    description: { type: String, required: true },
    maxGuests: { type: Number, required: true },
    city: { type: String, required: true },
}, { timestamps: true });
exports.default = model("Accomodation", AccomodationSchema);
