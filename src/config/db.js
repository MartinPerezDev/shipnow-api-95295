import mongoose from "mongoose";
import logger from "./logger.js";
import { config } from "../config/index.js";

const connectDB = async () => {
  const mongoUri = config.mongoDbUri;

  if (!mongoUri) {
    throw new Error("Falta la variable MONGODB_URI");
  }

  await mongoose.connect(mongoUri);
  logger.info("MongoDB conectado");
};

export default connectDB;
