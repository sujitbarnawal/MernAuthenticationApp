import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("connected to MongoDB");
  });
  await mongoose.connect(`${process.env.MONGODB_URI}/mern_auth`);
};

export default connectDB;
