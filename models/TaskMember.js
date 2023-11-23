import mongoose from "mongoose";

const taskMemberSchema = new mongoose.Schema({
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        require: true,
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    }]
});

export default mongoose.model('TaskMember', taskMemberSchema);