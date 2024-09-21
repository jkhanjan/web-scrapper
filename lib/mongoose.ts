import mongoose from "mongoose";

let isConnected = false; // Variable to track the connection status

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not defined");
    throw new Error("MONGODB_URI is not defined");
  }

  if (isConnected) {
    console.log("=> using existing database connection");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      socketTimeoutMS: 30000, // Optional: Set a longer timeout
    });

    isConnected = true;

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Failed to connect to MongoDB");
  }
};
