import express from "express";
import AccomodationModel from "./schema.js";
import { hostOnlyMiddleware } from "../../auth/host.js";
import { JWTAuthMiddleware } from "../../auth/token.js";
import { isAccomodationOwner } from "../../auth/owner.js";
import createHttpError from "http-errors";
const accomodationRouter = express.Router();

accomodationRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const accomodations = await AccomodationModel.find().populate({
      path: "host",
      select: "email",
    });

    res.send(accomodations);
  } catch (err) {
    next(err);
  }
});

accomodationRouter.get("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const accomodation = await AccomodationModel.findById(
      req.params.id
    ).populate({
      path: "host",
      select: "email",
    });
    if (accomodation) {
      res.send(post);
    } else {
      res.status(404).send();
    }
  } catch (err) {
    next(err);
  }
});

// HOST ONLY

accomodationRouter.post(
  "/",
  JWTAuthMiddleware,
  hostOnlyMiddleware,
  async (req, res, next) => {
    try {
      req.body.host = req.user;

      const newAccomodation = new AccomodationModel(req.body);
      await newAccomodation.save();
      res.status(201).send(newAccomodation);
    } catch (err) {
      next(err);
    }
  }
);

accomodationRouter.put(
  "/:id",
  JWTAuthMiddleware,
  hostOnlyMiddleware,
  isAccomodationOwner,
  async (req, res, next) => {
    try {
      await AccomodationModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.send(`accomodation with id ${req.params.id} has been changed`);
    } catch (err) {
      next(err);
    }
  }
);

accomodationRouter.delete(
  "/:id",
  JWTAuthMiddleware,
  hostOnlyMiddleware,
  isAccomodationOwner,
  async (req, res, next) => {
    try {
      await AccomodationModel.findByIdAndDelete(req.params.id);
      res.send("deleted");
    } catch (err) {
      next(err);
    }
  }
);
export default accomodationRouter;
