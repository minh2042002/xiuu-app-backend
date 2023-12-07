import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { countTaskByStatusWithUserLogin, getTaskByDateTimeWithUserLogin  } from '../controllers/dashboardController.js';
const dashboardRouter = express.Router();

dashboardRouter.use(authenticate);

dashboardRouter.get("/tasks/status", countTaskByStatusWithUserLogin);
dashboardRouter.get("/calendar", getTaskByDateTimeWithUserLogin);

export default dashboardRouter;