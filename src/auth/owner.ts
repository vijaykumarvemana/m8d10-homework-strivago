import createHttpError from "http-errors";
import mongoose from "mongoose";
import AccomodationModel from "../services/accomodation/schema";

const { Types } = mongoose;

export const isAccomodationOwner = async (req: { params: { id: any; }; user: { _id: any; }; }, res: { status: (arg0: number, arg1: string | undefined) => { (): any; new(): any; send: { (arg0: string): void; new(): any; }; }; }, next: (arg0: unknown) => void) => {
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
