import express from 'express';
import { login, signup, logout, refreshToken } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/signup", signup);
authRouter.post("/refresh-token", authenticate, refreshToken);
authRouter.post("/logout", authenticate, logout);
export default authRouter;