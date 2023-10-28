import dotenv from "dotenv";
dotenv.config();

export default {
    port: process.env.PORT || 3000,
    mongoUri: `mongodb+srv://${process.env.USER}:${process.env.MONGO_PASSWORD}@cluster0.mqfrcip.mongodb.net/?retryWrites=true&w=majority`,
}