import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction, RequestHandler } from "express";

export const isAuthenticated: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken;

    if (!token) {
        res.status(401).json({ 
            message: "Not authenticated" 
        });
        return; 
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload & {
            id: string;
            email: string;
            username?: string;
        };
        req.user = decoded; 
        next();
    } catch (err) {
        res.status(401).json({ 
            message: "Invalid or expired token" 
        });
        return;
    }
};