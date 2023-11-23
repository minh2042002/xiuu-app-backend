import mongoose, { model } from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        trim: true,
        immutable: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    admin: {
        type: Boolean,
        immutable: true,
        default: false,
    },
    created: {
        type: Date,
        immutable: true,
        default: Date.now,
    },
    refreshToken: {
        type: String,
    }
});
export default mongoose.model("User", userSchema);
