import createHttpError from "http-errors";
import mongoose from "mongoose";
import AccomodationModel from "../services/accomodation/schema.js";

const { Types } = mongoose;

export const isAccomodationOwner = async (req, res, next) => {
  try {
    // console.log(Types.ObjectId(req.params.id));
    const accomodation = await AccomodationModel.findById(req.params.id);
    if (accomodation) {
      const isOwner = accomodation.host.equals(req.user._id);
      console.log(isOwner);
      if (isOwner) {
        next();
      } else {
        res.status(404).send("not the owner of the accomodation");
      }
    } else {
      res.status(404, "Accomodation not found");
    }
  } catch (err) {
    next(err);
  }
};
