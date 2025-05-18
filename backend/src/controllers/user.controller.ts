import { Request, Response, RequestHandler } from "express";
import getDataUri from "../utils/getDataUri";
import cloudinary from "../config/cloudinary.config";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../utils/password";

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

        const hashedPassoword = hashPassword(password);

        await client.user.create({
            data: {
                username: username,
                email: email,
                password: hashedPassoword,
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