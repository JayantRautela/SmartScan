import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config({});

const app: Express = express();

app.use(express.json());
app.use(cors({
    allowedHeaders: ['Content-Type', 'Authorization'],
    origin: ['http://localhost:5173', process.env.CLIENT_URL!]
}));
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server Started at PORT ${PORT}`);
});