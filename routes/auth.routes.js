import express from 'express';
import { login, signup, logout, refreshToken } from '../controllers/auth.controller.js';
import { authenticate, refreshTokenMiddleware } from '../middleware/auth.middleware.js';

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/signup", signup);
authRouter.post("/refresh-token", refreshTokenMiddleware, refreshToken);
authRouter.post("/logout", authenticate, logout);
export default authRouter;