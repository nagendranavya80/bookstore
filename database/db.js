import "dotenv/config";
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error("Set MONGO_URI or MONGODB_URI in .env");
        }
        await mongoose.connect(mongoUri);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Datbase connection failed!: ", error.message);
        process.exit(1);
    }
};

export default connectDB;
