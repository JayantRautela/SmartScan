import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config({});
import UserRouter from './routes/user.route';
import ResumeRouter from './routes/resume.route';

const app: Express = express();

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', process.env.CLIENT_URL!, 'https://smart-scan-eight.vercel.app',],
    credentials: true
}));
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.use('/api/v1/users', UserRouter);
app.use('/api/v1/resume', ResumeRouter);

app.listen(PORT, () => {
    console.log(`Server Started at PORT ${PORT}`);
});