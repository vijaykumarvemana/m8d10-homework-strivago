import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import listEndpoints from "express-list-endpoints";
import userRouter from "./services/users/index";


import {
  notFoundHandler,
  badRequestHandler,
  genericErrorHandler,
  unauthorizedHandler,
  forbiddenHandler,
  catchAllHandler,
} from "./errorHandlers/errorHandlers.js";
import accomodationRouter from "./services/accomodation/index";


process.env.TS_NODE_DEV && require("dotenv").config();

const server = express();


const { PORT = 3009 } = process.env;


// MIDDLEWARE

server.use(cors());
server.use(express.json());



// SERVICES
server.use("/accomodation", accomodationRouter);
server.use('/user', userRouter)

server.use(unauthorizedHandler);
server.use(forbiddenHandler);
server.use(catchAllHandler);
server.use(notFoundHandler);
server.use(badRequestHandler);
server.use(genericErrorHandler);



server.listen(PORT, () => {
  // connect to mongoose Server

  mongoose.connect(process.env.MONGODB!, {});

  console.log(`Server is listening on port ${PORT}`);
  console.table(listEndpoints(server))
});

server.on("error", (error) => {
  console.log("Server is stopped ", error);
});
