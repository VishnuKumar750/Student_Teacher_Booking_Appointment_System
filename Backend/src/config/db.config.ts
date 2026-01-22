import mongoose from "mongoose";
import { config } from "./app.config";

let isConnected: Boolean = false;

export const connectDB = async (): Promise<void> => {
  // resolve the problem of mongodb connection when it already connected
  if (isConnected) return;

  try {
    //  verify the req field is present in shcema if yes return response if no return empty
    mongoose.set("strictQuery", true);

    // connection
    await mongoose.connect(config.MONGO_URI, {
      autoIndex: false,
      serverSelectionTimeoutMS: 5000,
    });

    // mongodb is connected so isConnected will be true
    isConnected = true;

    console.log("mongoDB connected");
  } catch (err) {
    console.log(`mongoDB connection failed: ${err}`);
    // if error comes shutdown the connection between mongodb
    process.exit(1);
  }
};
