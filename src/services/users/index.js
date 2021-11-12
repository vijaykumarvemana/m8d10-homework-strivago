import express from "express";
import createHttpError from "http-errors";
import UserModel from "./schema.js";
import AccomodationModel from "../accomodation/schema.js";
import bcrypt from "bcrypt";
import {
  JWTAuthenticate,
  generateTemporaryJWT,
  verifyJWT,
} from "../../auth/tools.js";
import { JWTAuthMiddleware } from "../../auth/token.js";
import { hostOnlyMiddleware } from "../../auth/host.js";
import { calculateObjectSize } from "bson";
const userRouter = express.Router();

userRouter.post("/", hostOnlyMiddleware, async (req, res, next) => {
  try {
    const user = new UserModel(req.body);
    const { _id } = await user.save();
    res.send({ _id });
  } catch (error) {
    next(error);
  }
});

userRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.checkCredentials(email, password);

    if (user) {
      const accessToken = await JWTAuthenticate(user);

      res.send({ accessToken });
    } else {
      next(createHttpError(401, "Credentials are not correct!"));
    }
  } catch (error) {
    next(error);
  }
});

userRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    next(error);
  }
});

userRouter.put("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    if (req.body.password) {
      next(createHttpError(403, `You are not allowed to change password`));
    } else {
      const { email, role } = req.body;
      const updatedProfile = await UserModel.findByIdAndUpdate(
        req.user._id,
        { email, role },
        { new: true }
      );
      res.send(updatedProfile);
    }
  } catch (error) {
    next(error);
  }

});

userRouter.post("/forgot-password", async (req, res, next) => {
  try {
    // const {email} = req.body
    // make sure user exists on the server, find by mail
    const user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      console.log("found");
      // create one time link valid for x time
      const payload = {
        email: user.email,
        id: user.id,
      };
      const temporaryAccessToken = await generateTemporaryJWT(payload);
      const link = `http://localhost:3000/reset-password/${user._id}/${temporaryAccessToken}`;
      console.log(link);

      res.send({
        message: "Password reset link has been sent to your email",
        tmpToken: temporaryAccessToken,
      });
    } else {
      next(createHttpError(404, "User not found"));
    }
  } catch (err) {
    next(err);
  }
});

userRouter.get("/reset-password/:id/:token", async (req, res, next) => {
  try {
    // find user and log in with id and token
    const { id, token } = req.params;
    const user = await UserModel.findById(id);
    if (user) {
      const decodedToken = await verifyJWT(req.params.token);
      console.log(decodedToken);
      const { email } = decodedToken;
      res.send(email);
    } else {
      next(createHttpError(404, "User does not exists"));
    }

    // res.send(req.params);
  } catch (err) {
    next(err);
  }
});

userRouter.post("/reset-password/:id/:token", async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.id);
    const decodedToken = await verifyJWT(req.params.token);
    const { email, id } = decodedToken;
    if (user && user.email === email && user._id.toString() === id) {
      user.password = req.body.password;
      await user.save();
      res.send("password changed");
    } else {
      next(createHttpError(404, "User not found"));
    }
  } catch (err) {
    next(err);
  }
});

userRouter.delete("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    await req.user.deleteOne();
    res.send("deleted");
  } catch (error) {
    next(error);
  }
});

// not possible with only accessToken
userRouter.post("/me/logout", JWTAuthMiddleware, async (req, res, next) => {
  try {
    console.log(req.user.accessToken);
    req.user.accessToken = null;
    await req.user.save();
    res.send("logged out");
  } catch (error) {
    next(error);
  }
});

userRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const users = await UserModel.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

userRouter.get("/:userID", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const userId = req.params.userID;
    const user = await UserModel.findById(userId);
    if (user) {
      res.send(user);
    } else {
      next(createHttpError(404, `user with ${userId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

userRouter.post("/register", async (req, res, next) => {
  try {
    const { email } = req.body;
    const alreadyExists = await UserModel.checkIfExists(email);
    if (alreadyExists) {
      // shoudl redirect to login page
      // res.redirect(`http://localhost:3000/login`);
      next(createHttpError(401, "user already exists go to log-in page"));
    } else {
      const user = new UserModel(req.body);
      await user.save();
      res.send(user);
    }
  } catch (error) {
    next(error);
  }
});


userRouter.put(
  "/:userID",
  JWTAuthMiddleware,
  hostOnlyMiddleware,
  async (req, res, next) => {
    try {
      const userId = req.params.userID;
      const modifiedUser = await UserModel.findByIdAndUpdate(userId, req.body, {
        new: true,
      });

      if (modifiedUser) {
        res.send(modifiedUser);
      } else {
        next(createHttpError(404, `user with id ${userId} not found!`));
      }
    } catch (error) {
      next(error);
    }
  }
);

userRouter.delete(
  "/:userID",
  JWTAuthMiddleware,
  hostOnlyMiddleware,
  async (req, res, next) => {
    try {
      const userId = req.params.userID;
      const deletedUser = await UserModel.findByIdAndDelete(userId);

      if (deletedUser) {
        res.status(204).send();
      } else {
        next(createHttpError(404, `user with id ${userId} not found!`));
      }
    } catch (error) {
      next(error);
    }
  }
);

userRouter.post("/refreshToken", async (req, res, next) => {
  try {
    const { currentRefreshToken } = req.body;
    const { accessToken, refreshToken } = await verifyRefreshAndGenerateTokens(
      currentRefreshToken
    );
    res.send({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
});

userRouter.get(
  "/me/accomodation",
  JWTAuthMiddleware,
  hostOnlyMiddleware,
  async (req, res, next) => {
    try {
      const accomodation = await AccomodationModel.find({
        host: req.user._id,
      }).populate({
        path: "host",
        select: "email",
      });
      res.status(200).send(accomodation);
    } catch (error) {
      next(error);
    }
  }
);



export default userRouter;
