import mongoose from "mongoose";
import config from "./../config/config.js";

export default async function connection () {
    try {
        const conn = await mongoose.connect(config.mongoUri);
        console.log("Connection establish to the database");
    } catch (error) {
        console.error(error.message);
    }
}