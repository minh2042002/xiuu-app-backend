import express from 'express';
import { getAllUserInWorkspace, createWorkspace, getWorkspaceByName, addUserToWorkspace, createTaskInWorkspace , getWorkspaceByUid, getDocumentByWorkspaceId, getTaskByWorkspaceId, getTaskByWorkspaceIdAndStatus } from '../controllers/workspaceController.js';

const workspaceRouter = express.Router();

workspaceRouter.post("/create", createWorkspace);
workspaceRouter.get("/", getWorkspaceByName)
workspaceRouter.get("/user_id", getWorkspaceByUid);
workspaceRouter.get("/users", getAllUserInWorkspace);
workspaceRouter.post("/users/add", addUserToWorkspace);
workspaceRouter.get("/document", getDocumentByWorkspaceId);
workspaceRouter.get("/task", getTaskByWorkspaceId);
workspaceRouter.post("/task/create", createTaskInWorkspace);
workspaceRouter.get("/board");

export default workspaceRouter;