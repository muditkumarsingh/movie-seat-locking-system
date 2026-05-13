import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async () => {
    try {
        await mongoose.connect(config.databaseUrl as string)
        console.log("Connected to database")
    } catch (err) {
        console.log("Failed to connect to database", err)
        process.exit(1);
    }
}

export default connectDB;