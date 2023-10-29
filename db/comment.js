import { Schema, model } from "mongoose";

const commentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    puntuation: {
        type: Number,
        required: true
    },
    videogame: {
        type: String,
        ref: "videogame"
    },
    date: Date,
    author: String
})

export default model("comment", commentSchema);