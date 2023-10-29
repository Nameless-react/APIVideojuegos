import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: {
        type: Stirng,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    apiKey: {
        type: String,
        required: true,
        unique: true
    },
    roles: [{type: String, ref: "role"}],
    usage: {
        date: {
            type: Date,
            default: Date.now()
        },
        count: {
            type: Number,
            default: 0
        }
    }
    
})


export default model("user", userSchema);