import { Schema, model } from "mongoose";

const roleSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: String
})

export default model("role", roleSchema);