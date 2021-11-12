import mongoose from "mongoose";
const { Schema, model } = mongoose;
import { accomodation } from "../../types";

const AccomodationSchema = new mongoose.Schema<accomodation>(
  {
    name: { type: String, required: true },
    host : { type: Schema.Types.ObjectId, required: true, ref: "user" },
    description: { type: String, required: true },
    maxGuests: { type: Number, required: true },
    city: { type: String, required: true },
  },
  { timestamps: true }
);

export default model<accomodation>("Accomodation", AccomodationSchema);
