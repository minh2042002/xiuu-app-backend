import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';


import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import workspaceRouter from './routes/workspace.routes.js';
import dashboardRouter from './routes/dashboard.routes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/workspaces", workspaceRouter);
app.use("/api/v1/dashboard", dashboardRouter);

const connect_string = process.env.CONNECT_DATABASE_STRING;
const port = process.env.PORT;

mongoose
    .connect(connect_string)
    .then(() => app.listen(port))
    .then(() => console.log(`Connect database and listen ${port}`))
    .catch((err) => console.log(err));
