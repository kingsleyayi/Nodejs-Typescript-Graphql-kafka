import mongoose from "mongoose";
import { databaseUrl } from ".";
import eventLogger from "../services/eventLogger";

export const connectDatabase = async (): Promise<void> => {
  try{
  await mongoose.connect(databaseUrl!);
  eventLogger.logInfo("Connected to MongoDB");
} catch (err) {
  eventLogger.logError("Error connecting to MongoDB: " + err);
  throw err;
}
};
