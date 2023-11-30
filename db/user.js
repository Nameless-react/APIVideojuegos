import { Schema, model } from "mongoose";
import { CustomError } from "../utils/customError.js";

const userSchema = new Schema({
    name: {
        type: String,
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
    usage: [{
        date: {
            type: Date,
            required: true,
            default: Date.now()
        },
        count: {
            type: Number,
            default: 0
        }
    }]
    
})


userSchema.statics.updateUsageCount = async function (userId) {
    const today = new Date();
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const user = await this.findById(userId);

    if (!user) {
        throw new CustomError(JSON.stringify({message: "User not found for update"}), 404, "Not found");
    }

    const usageEntry = user.usage.find((entry) => entry.date.getTime() === todayMidnight.getTime());

    usageEntry ? (usageEntry.count += 1) : user.usage.push({ date: todayMidnight, count: 1 });

    return user.save();
};

export default model("user", userSchema);