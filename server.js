import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';


import userRouter from './routes/userRoutes.js';
import authRouter from './routes/authRoutes.js';
import workspaceRouter from './routes/workspaceRoutes.js';
import dashboardRouter from './routes/dashboardRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/xiuu/api/v1/auth", authRouter);
app.use("/xiuu/api/v1/users", userRouter);
app.use("/xiuu/api/v1/workspaces", workspaceRouter);
app.use("/xiuu/api/v1/dashboard", dashboardRouter);

const connect_string = process.env.CONNECT_DATABASE_STRING;
const port = process.env.PORT;

mongoose
    .connect(connect_string)
    .then(() => app.listen(port))
    .then(() => console.log(`Connect database and listen ${port}`))
    .catch((err) => console.log(err));
