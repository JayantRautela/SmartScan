import { Request, Response, RequestHandler } from "express";
import getDataUri from "../utils/getDataUri";
import cloudinary from "../config/cloudinary.config";
import { PrismaClient } from "@prisma/client";
import { hashPassword, verifyPassword } from "../utils/password";
import { generateTokens } from "../utils/generateTokens";
import generateOtp from "../utils/generateOtp";
import crypto from 'crypto';

const client = new PrismaClient();

export const register:RequestHandler = async (req: Request, res: Response) => {
    try {
        const { username, email, password, fullName } = req.body;
        const file = req.file;
        let profilePicture = null;

        if (file) {
            const fileUri = getDataUri(file);
            if (!fileUri.content)  {
                res.status(400).json({
                    message: "Invalid file content",
                    success: false
                });
                return;
            }
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            profilePicture = cloudResponse.secure_url;
        }

        if (!username || !email || !password || !fullName) {
            res.status(400).json({
                message: "All fields are required",
                success: false
            });
            return;
        }

        if (username.length < 5) {
            res.status(400).json({
                message: "Username should contain atleast 5 characters",
                success: false
            });
            return;
        }

        if (password.length < 6) {
            res.status(400).json({
                message: "Password should contain atleast 6 characters",
                success: false
            });
            return;
        }

        const user = await client.user.findFirst({
            where: {
                OR: [
                    { username: username },
                    { email: email}
                ]
            }
        });

        if (user) {
            res.status(400).json({
                message: user.username === username ? "User with username already exists" : "User with email already exists",
                success: false
            });
            return;
        }

        const hashedPassword = hashPassword(password);

        await client.user.create({
            data: {
                username: username,
                email: email,
                password: hashedPassword,
                fullName: fullName,
                profilePicture: profilePicture
            }
        });

        res.status(201).json({
            message: "user registered successfully",
            success: true
        });
        return;

    } catch (error: any) {
        console.log(`Error:- ${error}`);
        res.status(500).json({
            message: "Some error occured",
            success: true,
            error: error
        });
        return;
    }
}

export const login: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).json({
                message: "All fields are required",
                success: false
            });
            return;
        }

        const user = await client.user.findFirst({
            where: {
                username: username
            }
        });

        if (!user) {
            res.status(400).json({
                message: "User with username does not exists",
                success: false
            });
            return;
        }

        const isPasswordCorrect = verifyPassword(password, user.password);

        if (!isPasswordCorrect) {
            res.status(401).json({
                message: "Incorrect Password",
                success: false
            });
            return;
        }

        const { accessToken, refreshToken } = generateTokens({
            username: user.username,
            id: user.id,
            email: user.email,
            fullName: user.fullName
        });

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'none', 
            maxAge: 15 * 60 * 1000,
            path: '/'
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'none', 
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/'
        });

        await client.user.update({
            where: {
                username: username
            },
            data: {
                refreshToken: refreshToken
            }
        });

        res.status(200).json({
            message: "User logged in successfully",
            success: true,
            user: {
                userId: user.id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture
            }
        });
        return;
    } catch (error: any) {
        console.log(`Error:- ${error}`);
        res.status(500).json({
            message: "Some error occured",
            success: false,
            error: error
        });
        return;
    }
}

export const logout: RequestHandler = (req: Request, res: Response) => {
    try {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 0,
            path: '/'
        });
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 0,
            path: '/'
        });

        res.status(200).json({
            message: "User logged out successfully",
            success: true
        });
        return;
    } catch (error: any) {
        console.log(`Error:- ${error}`);
        res.status(500).json({
            message: "Some error occured",
            success: false,
            error: error
        });
        return;
    }
}

export const sendOtp: RequestHandler = async (req: Request, res: Response) => {
    try {
        const email = req.body.email;

        const user = await client.user.findFirst({
            where: {
                email: email
            }
        });

        if (!user) {
            res.status(400).json({
                message: "User does not exists",
                success: false
            });
            return;
        }

        await client.oTP.deleteMany({
            where: { 
                userId: user.id 
            }
        });

        const otp = generateOtp();
        console.log(otp); //for testing

        await client.oTP.create({
            data: {
                userId: user.id,
                code: otp,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000),
            },
        });

        //TODO: send OTP to mail

        res.status(200).json({
            message: "OTP sent",
            success: true
        });
        return;
    } catch (error: any) {
        console.log(`Error:- ${error}`);
        res.status(500).json({
            message: "Some error occured",
            error: error.message,
            success: false
        });
        return;
    }
}

export const verifyOtp: RequestHandler = async (req: Request, res: Response) => {
    const { email, otp } = req.body;

    try {
        const user = await client.user.findFirst({
            where: {
                email: email
            }
        });
    
        if (!user) {
            res.status(404).json({
                message: "User not found",
                success: false
            });
            return;
        }
    
        const validOtp = await client.oTP.findFirst({
            where: {
                userId: user.id,
                code: otp,
                expiresAt: { gt: new Date() },
            },
        });
    
        if (!validOtp) {
            res.status(400).json({ 
                message: "Invalid or expired OTP" 
            });
            return;
        }
    
        await client.oTP.deleteMany({
            where: { 
                userId: user.id
            },
        });
        
        const { accessToken, refreshToken } = generateTokens({ 
            id: user.id, 
            email: user.email, 
            username: user.username,
            fullName: user.fullName 
        });
        
        await client.user.update({
            where: { 
                id: user.id 
            },
            data: { 
                refreshToken 
            },
        });
        
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'none', 
            maxAge: 15 * 60 * 1000,
            path: '/'
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'none', 
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/'
        });
        
        res.status(200).json({ 
            message: "User logged in successfully",
            success: true,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            }
        });
        return;
    } catch (error: any) {
        console.log(`Error:- ${error}`);
        res.status(500).json({
            message: "Some error occured",
            error: error.message,
            success: false
        });
        return;
    }
}

export const forgotPassword: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            res.status(400).json({ 
                message: "Email is required",
                success: false 
            });
            return;
        }

        const user = await client.user.findUnique({ 
            where: { 
                email : email
            } 
        });

        if (!user) {
            res.status(404).json({ 
                message: "User not found",
                success: false 
            });
            return;
        }

        const token = crypto.randomBytes(32).toString("hex");
        const expiry = new Date(Date.now() + 1000 * 60 * 15); 

        await client.user.update({
            where: { email },
            data: {
                resetPasswordToken: token,
                resetTokenExpiry: expiry,
            },
        });

        const resetLink = `${process.env.RESET_PASSWORD_LINK}?token=${token}`;

        //send forgotpasswords enail

        res.status(200).json({ 
            message: "Password reset link sent to your email",
            success: true 
        });
        return;
    } catch (error: any) {
        console.log(`Error: ${error}`);
        res.status(500).json({
            message: "Internal Server error",
            error: error.message,
            success: false
        });
        return;
    }
}

export const resetPassword: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            res.status(400).json({ 
                message: "Token and new password are required",
                success: false 
            });
            return;
        }

        const user = await client.user.findFirst({
            where: {
                resetPasswordToken: token,
                resetTokenExpiry: {
                    gte: new Date(),
                },
            },
        });

        if (!user) {
            res.status(400).json({ 
                message: "Invalid or expired token",
                success: false
            });
            return;
        }

        const hashedPassword = hashPassword(newPassword);

        await client.user.update({
            where: { 
                id: user.id 
            },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetTokenExpiry: null,
            },
        });

        res.status(200).json({ 
            message: "Password has been reset successfully",
            success: true
        });
        return;
    } 
    catch (error: any) {
        console.log(`Error: ${error}`);
        res.status(500).json({
            message: "Internal Server error",
            error: error.message,
            success: false
        });
        return;
    }
}

export const getUser: RequestHandler = async (req: Request, res: Response) => {
    try {
        const id  = req.user?.id;

        const user = await client.user.findUnique({
            where: { 
                id: id 
            }, 
            select: {
                username: true,
                email: true,
                createdAt: true
            }
        });

        if (!user) {
            res.status(404).json({ 
                message: "User not found",
                success: false
            });
            return;
        }

        res.status(200).json({
            message: "User fetched successfully",
            success: true,
            user
        });
    } catch (error: any) {
        console.log(`Error: ${error}`);
        res.status(500).json({
            message: "Internal Server error",
            error: error.message,
            success: false
        });
        return;
    }
}

export const generateAccessToken: RequestHandler = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            res.status(401).json({
                message: "Invalid Token or Token Expired",
                success: false
            });
            return;
        }

        const user = await client.user.findFirst({
            where: {
                refreshToken: refreshToken
            }
        });

        if (!user) {
            res.status(401).json({
                message: "Invalid Token or Token Expired",
                success: false
            });
            return;
        }

        const { accessToken } = generateTokens({ 
            id: user.id, 
            email: user.email, 
            username: user.username,
            fullName: user.fullName
        });

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'none', 
            maxAge: 15 * 60 * 1000,
            path: '/'
        });

        res.status(200).json({
            message: "Access token generated successfully",
            success: true
        });
        return;
    } catch (error: any) {
        console.log(`Error: ${error}`);
        res.status(500).json({
            message: "Internal Server error",
            error: error.message,
            success: false
        });
        return;
    }
}