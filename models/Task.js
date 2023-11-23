import mongoose from "mongoose";

const enumPriority = ["High", "Medium", "Low"];
const enumStatus = ["Done", "In Progress", "To do"];

const taskSchema = new mongoose.Schema({
    deadline: {
        type: Date,
        require: true,
    },
    starting_time: {
        type: Date,
        require: true,
    },
    name: {
        type: String,
        require: true,
    },
    status: {
        type: String,
        enum: enumStatus,
        default: "To do",
    },
    priority: {
        type: String,
        enum: enumPriority,
    },
    description: {
        type: String,
        require: false,
    },
    workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspace",
        require: true,
    }
});

export default mongoose.model("Task", taskSchema);