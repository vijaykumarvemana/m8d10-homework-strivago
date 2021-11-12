import mongoose from "mongoose";
const { Schema, model } = mongoose;

const AccomodationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    host: { type: Schema.Types.ObjectId, required: true, ref: "user" },
    description: { type: String, required: true },
    maxGuests: { type: Number, required: true },
    city: { type: String, required: true },
  },
  { timestamps: true }
);

export default model("Accomodation", AccomodationSchema);
