import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    }
});

export default mongoose.model('Workspace', workspaceSchema);