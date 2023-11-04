import { Schema, model } from "mongoose";

const videogameSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    release_date: {
        type: Date,
        required: true,
        default: Date.now()
    },
    developer: {
        type: String,
        ref: "developer"
    },
    genre: [{type: String}],
    image: String
}) 

export default model("videogame", videogameSchema);