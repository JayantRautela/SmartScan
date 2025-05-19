import { Request, RequestHandler, Response } from 'express';
import pdfParse from 'pdf-parse';
import cloudinary from '../config/cloudinary.config';
import getDataUri from '../utils/getDataUri';
import natural from "natural";
import { removeStopwords } from "stopword";
import { PrismaClient } from '@prisma/client';
import { extractSkills } from '../utils/extractSkills';

const SKILLS = {
    languages: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Ruby'],
    software: ['Git', 'Docker', 'Jira', 'Figma', 'Photoshop', 'VSCode', 'Postman', 'Excel'],
    communication: ['communication', 'leadership', 'teamwork', 'public speaking', 'collaboration', 'adaptability', 'problem solving'],
    backend: ['Node.js', 'Express', 'Django', 'Flask', 'PostgreSQL', 'MongoDB', 'REST API', 'GraphQL', 'SQL'],
    frontend: ['React', 'Redux', 'HTML', 'CSS', 'Vue.js', 'Angular', 'Next.js', 'Tailwind', 'Bootstrap']
};

const client = new PrismaClient();

export const calculateATSScore: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { jobDescription } = req.body;
        const file = req.file;
        const userId = req.user?.id!;

        if (!jobDescription) {
            res.status(400).json({
                message: "Job Description is required",
                success: false
            });
            return;
        }
        if (!file) {
            res.status(400).json({
                message: "Resume is required",
                success: false
            });
            return;
        }

        const dataUri = getDataUri(file);

        const cloudinaryResult = await cloudinary.uploader.upload(dataUri.content!, {
        resource_type: 'raw',
        folder: 'resumes',
        });

        console.log('File Uploaded to Cloudinary:', cloudinaryResult.secure_url);

        const pdfData = await pdfParse(file.buffer);
        console.log(pdfData);
        const resumeText = pdfData.text;
        console.log(resumeText);

        await client.resume.create({
            data: {
                userId: userId,
                resumeText: resumeText,
                resumeUrl: cloudinaryResult.secure_url
            }
        });

        const tokenizer = new natural.WordTokenizer();

        const jobTokens = removeStopwords(tokenizer.tokenize(jobDescription.toLowerCase()));
        const resumeTokens = removeStopwords(tokenizer.tokenize(resumeText.toLowerCase()));

        const jobKeywordsSet = new Set(jobTokens);
        const resumeWordsSet = new Set(resumeTokens);

        const matchedKeywords = Array.from(jobKeywordsSet).filter(word => resumeWordsSet.has(word));
        const missingKeywords = Array.from(jobKeywordsSet).filter(word => !resumeWordsSet.has(word))
        const score = Math.round((matchedKeywords.length / jobKeywordsSet.size) * 100);

        res.status(200).json({
            message: "ATS score calculated successfully",
            success: true,
            score: score,
            matchedKeywords: matchedKeywords,
            missingKeywords: missingKeywords
        });
        return;
    } catch (error: any) {
        console.log(`Error: ${error}`);
        res.status(500).json({
            message: "Some Error Occured",
            error: error.message,
            success: false
        });
        return;
    }
}

export const fetchSKills: RequestHandler = async (req: Request, res: Response) => {
    try {
        const file = req.file;
        const userId = req.user?.id!;

        if (!file) {
            res.status(400).json({
                message: "Resume is required",
                success: false
            });
            return;
        }

        const dataUri = getDataUri(file);

        const cloudinaryResult = await cloudinary.uploader.upload(dataUri.content!, {
        resource_type: 'raw',
        folder: 'resumes',
        });

        console.log('File Uploaded to Cloudinary:', cloudinaryResult.secure_url);

        const pdfData = await pdfParse(file.buffer);
        console.log(pdfData);
        const resumeText = pdfData.text;
        console.log(resumeText);

        await client.resume.create({
            data: {
                userId: userId,
                resumeText: resumeText,
                resumeUrl: cloudinaryResult.secure_url
            }
        });

        const extracted = extractSkills(resumeText);
        const feedback = generateFeedback(extracted, SKILLS)

        res.status(200).json({
            message: "Skills fetched successfully",
            success: true,
            skills: extracted,
            feedback: feedback
        });
        return;
    } catch (error: any) {
        console.log(`Error: ${error}`);
        res.status(500).json({
            message: "Some Error Occured",
            error: error.message,
            success: false
        });
        return;
    }
}