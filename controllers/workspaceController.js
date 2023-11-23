import Workspace from "../models/Workspace.js";
import WorkspaceMember from "../models/WorkspaceMember.js";
import Document from "../models/Document.js";
import Task from "../models/Task.js";
import TaskMember from "../models/TaskMember.js";

import mongoose from "mongoose";

// Create new workspace
export const createWorkspace = async (req, res) => {
    const { name } = req.body;
    let existWorkspace;
    try {
        existWorkspace = await Workspace.findOne({ name });
        if (existWorkspace) {
            return res
                .status(400)
                .json({ message: "Workspace already exists!" });
        }

        const workspace = new Workspace({ name });

        await workspace.save();
        return res.status(201).json({ workspace });
    } catch (error) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error!" });
    }
};

// Add user to workspace
export const addUserToWorkspace = async (req, res) => {
    const { wid, uid, admin } = req.body;
    const workspace_id = new mongoose.Types.ObjectId(wid);
    const user_id = new mongoose.Types.ObjectId(uid);

    let exists;
    try {
        exists = await WorkspaceMember.findOne({ 
            workspace: workspace_id, 
            user: user_id
        });
        if (exists) {
            return res
                .status(400)
                .json({ message: "User is already exists in workspace!" });
        }

        const wp_member = new WorkspaceMember({
            workspace: workspace_id,
            workspace_admin: admin,
            user: user_id,
        });

        await wp_member.save();
        return res.status(201).json({ message: "Add user into workspace success" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error!" });
    }
};

// Get all user in workspace
export const getAllUserInWorkspace = async (req, res) => {
    const { wid } = req.body;
    const workspace_id = new mongoose.Types.ObjectId(wid);
    let result;
    try {
        result = await WorkspaceMember.aggregate([
            {
                $match: {
                    workspace: workspace_id,
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'users',
                }
            },
            {
                $unwind: '$users',
            },
            {
                $group: {
                    _id: '$workspace',
                    users: { $push: '$users'},
                },
            },
            {
                $project: {
                    _id: 0,
                    users: {
                        _id: 1,
                        name: 1
                    }
                }
            }
        ]);

        if (!result) {
            return res.status(404).json({ message: "Users not found!"});
        }

        return res.status(200).json(result[0].users);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error!"});
    }
};

// Workspaces for user
export const getWorkspaceByUid = async (req, res) => {
    const { uid } = req.body;
    let workspaces;
    try {
        workspaces = await WorkspaceMember.findOne({ user: uid }).populate(
            "workspace"
        );

        if (!workspaces) {
            return res.status(404).json({ message: "Workspace is not found!" });
        }

        return res.status(200).json({ workspaces });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error!" });
    }
};

// Document for workspace
export const getDocumentByWorkspaceId = async (req, res) => {
    const { wid } = req.body;
    let document;
    try {
        document = await Document.findOne({ workspace: wid });

        if (!document) {
            return res.status(404).json({ message: "Document is not found!" });
        }

        return res.status(200).json({ document });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error!" });
    }
};

// Get all task by workspace id
export const getTaskByWorkspaceId = async (req, res) => {
    const { wid } = req.body;
    let tasks;
    try {
        tasks = await TaskMember.aggregate([
            {
                $lookup: {
                    from: 'tasks', // Tên bảng cần join
                    localField: 'task',
                    foreignField: '_id',
                    as: 'taskDetails',
                }
            },
            {
                $unwind: '$taskDetails', // Giải nén mảng taskDetails
            },
            {
                $match: {
                    'taskDetails.workspace': new mongoose.Types.ObjectId(wid),
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'users',
                    foreignField: '_id',
                    as: 'userDetails',
                }
            },
            {
                $group: {
                    _id: '$task',
                    taskDetails: { $first: '$taskDetails'},
                    users: { $first: '$userDetails'},
                },
            },
            {
                $project: {
                    _id: 0,
                    taskDetails: {
                        _id: 1,
                        deadline: 1,
                        starting_time: 1,
                        name: 1,
                        status: 1,
                        priority: 1,
                        description: 1,
                    },
                    users: {
                        _id: 1,
                        name: 1,
                    }
                }
            }
        ]);

        if (!tasks) {
            return res.status(404).json({ message: "Tasks not found!" });
        }

        return res.status(200).json({ tasks });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error!" });
    }
};

// Create task in workspace
export const createTaskInWorkspace = async (req, res) => {
    const taskData = req.body;

    const sessionTask = await mongoose.startSession();
    sessionTask.startTransaction();
    const sessionTaskMember = await mongoose.startSession();
    sessionTaskMember.startTransaction();

    let exists;
    try {
        let nameTask = taskData.name;
        console.log(nameTask);
        exists = await Task.findOne({ name: nameTask });
        if (exists) {
            return res
                .status(400)
                .json({ message: "Task is exists in workspace!" });
        } else {
            exists = await TaskMember.findOne({
                task: { $elemMatch: { name: taskData.name } },
            });

            if (exists) {
                return res
                    .status(400)
                    .json({ message: "Task is exists in workspace!" });
            }

            const newTask = new Task({
                deadline: new Date(taskData.deadline),
                starting_time: new Date(taskData.starting_time),
                name: taskData.name,
                priority: taskData.priority,
                description: taskData.description,
                workspace: taskData.wid,
            });

            const saveTask = await newTask.save({ sessionTask });

            const task = await Task.findOne({ name: saveTask.name });

            let userIds = taskData.users.map(uid => new mongoose.Types.ObjectId(uid));
            const task_member = new TaskMember({
                task: task._id,
                users: userIds,
            });

            await task_member.save({ sessionTaskMember });

            await sessionTask.commitTransaction();
            sessionTask.endSession();
            await sessionTaskMember.commitTransaction();
            sessionTaskMember.endSession();

            return res.status(201).json({ message: "Create task is success" });
        }
    } catch (error) {
        await sessionTask.abortTransaction();
        sessionTask.endSession();
        await sessionTaskMember.abortTransaction();
        sessionTaskMember.endSession();

        console.log(error);
        return res.status(500).json({ message: "Internal server error!" });
    }
};

// Get task and status task for workspace
export const getTaskByWorkspaceIdAndStatus = async (req, res) => {
    const { wid, status } = req.body;
    let tasks;
    try {
        tasks = await Task.find({
            workspace: { $elemMatch: { _id: wid } },
            status,
        });

        if (!tasks) {
            return res.status(404).json({ message: "Tasks is not found!" });
        }

        return res.status(200).json({ tasks });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error!" });
    }
};

// Get workspace by name
export const getWorkspaceByName = async (req, res) => {
    const { name } = req.body;
    let workspace;
    try {
        workspace = await Workspace.findOne({ name: {$regex: new RegExp(name, 'i')}}, '-__v');
    } catch (err) {
        return console.log(err);
    }

    if (!workspace) {
        return res
            .status(404)
            .json({ message: `Not found workspace with ${name}` });
    }

    return res.status(200).json({ workspace });
};
