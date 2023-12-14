import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { countTaskByStatusWithUserLogin, getTaskByDateTimeWithUserLogin  } from '../controllers/dashboard.controller.js';
const dashboardRouter = express.Router();

dashboardRouter.use(authenticate);

dashboardRouter.get("/tasks/status", countTaskByStatusWithUserLogin);
dashboardRouter.get("/calendar", getTaskByDateTimeWithUserLogin);

export default dashboardRouter;