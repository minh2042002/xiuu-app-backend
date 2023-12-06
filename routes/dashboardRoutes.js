import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { countTaskByStatusWithUserLogin  } from '../controllers/dashboardController.js';
const dashboardRouter = express.Router();

dashboardRouter.use(authenticate);

dashboardRouter.get("/tasks/status", countTaskByStatusWithUserLogin);

export default dashboardRouter;