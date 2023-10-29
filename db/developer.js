import { Schema, model } from "mongoose";

const developerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    foundation: {
        type: Date,
        required: true
    },
    number_employees: {
        type: Number,
        required: true
    },
    web: String
})

export default model("developer", developerSchema);