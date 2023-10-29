import { Schema, model } from "mongoose";

const teamSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    achievements: [{type: String}],
    games: [{type: String, ref: "videogame"}]
})

export default model("team", teamSchema);