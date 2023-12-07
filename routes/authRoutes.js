import express from 'express';
import { login, signup, logout, refreshToken } from '../controllers/authController.js';
import { authenticate, refreshTokenMiddleware } from '../middleware/authMiddleware.js';

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/signup", signup);
authRouter.post("/refresh-token", refreshTokenMiddleware, refreshToken);
authRouter.post("/logout", authenticate, logout);
export default authRouter;