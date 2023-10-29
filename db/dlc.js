import { Schema, model } from "mongoose";

const dlcSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    price: {
        type: Number,
    },
    release_date: {
        type: Date,
        required: true,
        default: Date.now()
    },
    videogame: {
        type: String,
        ref: "videogame"
    }
})

export default model("dlc", dlcSchema);