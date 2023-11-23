import mongoose from "mongoose";

const workspaceMemberSchema = new mongoose.Schema({
    workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspace",
        require: true,
    },
    workspace_admin: {
        type: Boolean,
        require: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
    },
});

export default mongoose.model("WorkspaceMember", workspaceMemberSchema);
