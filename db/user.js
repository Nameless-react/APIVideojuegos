import { Schema, model } from "mongoose";

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
            unique: true,
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
        throw new Error("Usuario no encontrado");
    }

    const usageEntry = user.usage.find((entry) => entry.date.getTime() === todayMidnight.getTime());

    usageEntry ? (usageEntry.count += 1) : user.usage.push({ date: todayMidnight, count: 1 });

    return user.save();
};

export default model("user", userSchema);