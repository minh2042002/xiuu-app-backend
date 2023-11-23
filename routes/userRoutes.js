import express from 'express';
import { getAllUser, updateUserLogin, updateUser, deleteUserById } from '../controllers/userController.js';
import { authenticate, isAdmin } from '../middleware/authMiddleware.js';
const userRouter = express.Router();


// Middleware xác thực sẽ kiểm tra access token trước khi cho phép truy cập các API dưới
userRouter.use(authenticate);

userRouter.get("/", isAdmin, getAllUser);
userRouter.put("/update", updateUserLogin);
userRouter.put("/update/:id", updateUser);
userRouter.delete("/delete/:id", isAdmin, deleteUserById);

export default userRouter;