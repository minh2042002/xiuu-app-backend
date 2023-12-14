import TaskMember from "../models/TaskMember.js";
import mongoose from "mongoose";

export const countTaskByStatusWithUserLogin = async (req, res) => {
    const uid = req.user.id;
    let result;
    try {
        result = await TaskMember.aggregate([
            {
                $match: {
                    users: new mongoose.Types.ObjectId(uid),
                },
            },
            {
                $lookup: {
                    from: "tasks",
                    localField: "task",
                    foreignField: "_id",
                    as: "tasks",
                },
            },
            {
                $unwind: "$tasks",
            },
            {
                $group: {
                    _id: "$users",
                    todoCount: {
                        $sum: {
                            $cond: {
                                if: { $eq: ["$tasks.status", "To do"] },
                                then: 1,
                                else: 0,
                            },
                        },
                    },
                    doneCount: {
                        $sum: {
                            $cond: {
                                if: { $eq: ["$tasks.status", "Done"] },
                                then: 1,
                                else: 0,
                            },
                        },
                    },
                    doneCount: {
                        $sum: {
                            $cond: {
                                if: { $eq: ["$tasks.status", "In Progress"] },
                                then: 1,
                                else: 0,
                            },
                        },
                    },
                    totalCount: { $count: {} }, // Sử dụng $count để đếm số lượng documents trong mỗi nhóm
                },
            },
            {
                $project: {
                    _id: 0,
                    task: 0,
                    users: 0,
                    __v: 0,
                },
            },
        ]);
        if (!result) {
            return res.status(404).json({ message: "Tasks not found!" });
        }

        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error!" });
    }
};

export const getTaskByDateTimeWithUserLogin = async (req, res) => {
    const { datetime } = req.body;
    const date = new Date(datetime);
    const uid = req.user.id;
    let tasks;
    try {
        tasks = await TaskMember.aggregate([
            {
                $match: {
                    users: new mongoose.Types.ObjectId(uid),
                },
            },
            {
                $lookup: {
                    from: "tasks", 
                    localField: "task",
                    foreignField: "_id",
                    as: "tasks",
                },
            },
            {
                $unwind: "$tasks",
            },
            {
                $match: {
                    $and: [
                        { 'tasks.starting_time': { $lte: date } },
                        { 'tasks.deadline': { $gte: date } },
                    ],
                },
            },
            {
                $project: {
                    _id: 0,
                    users: 0,
                    task: 0,
                    __v: 0,
                    tasks: {
                        __v: 0,
                    }
                    // id: { $push: "$tasks._id"},
                    // deadline: { $push: "$tasks._id"},
                    // starting_time: { $push: "$tasks._id"},
                    // name: { $push: "$tasks._id"},
                    // status: { $push: "$tasks._id"},
                    // priority: { $push: "$tasks._id"},
                    // description: { $push: "$tasks._id"},
                    // workspace: { $push: "$tasks._id"},
                }
            }
        ]);

        if (!tasks) {
            return res.status(404).json({ message: "Tasks not found!" });
        }

        return res.status(200).json(tasks);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error!" });
    }
}