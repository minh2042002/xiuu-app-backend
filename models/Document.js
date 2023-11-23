import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    workspace: {
        workspace_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workspace',
            require: true
        },
        name: {
            type: String,
            require: true
        }
    },
    user_requirements: {
        type: String,
        require: false
    },
    report: {
        type: String,
        require: false
    },
    slide: {
        type: String,
        require: false
    }
});

export default mongoose.model("Document", documentSchema);