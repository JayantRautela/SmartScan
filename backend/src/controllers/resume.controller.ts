import { Request, RequestHandler, Response } from 'express';
import pdfParse from 'pdf-parse';
import cloudinary from '../config/cloudinary.config';
import getDataUri from '../utils/getDataUri';
import natural from "natural";
import { removeStopwords } from "stopword";
import { PrismaClient } from '@prisma/client';
import { extractSkills } from '../utils/extractSkills';
import generateFeedback from '../utils/generateFeedback';
import axios from 'axios';

const SKILLS = {
    languages: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Ruby'],
    software: ['Git', 'Docker', 'Jira', 'Figma', 'Photoshop', 'VSCode', 'Postman', 'Excel'],
    communication: ['communication', 'leadership', 'teamwork', 'public speaking', 'collaboration', 'adaptability', 'problem solving'],
    backend: ['Node.js', 'Express', 'Django', 'Flask', 'PostgreSQL', 'MongoDB', 'REST API', 'GraphQL', 'SQL'],
    frontend: ['React', 'Redux', 'HTML', 'CSS', 'Vue.js', 'Angular', 'Next.js', 'Tailwind', 'Bootstrap']
};

const client = new PrismaClient();

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_KEY!;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

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

export const analyzeResume: RequestHandler = async (req: Request, res: Response) => {
    const file = req.file;
    const userId = req.user?.id!;

    if (!file) {
        res.status(400).json({ 
            message: 'No file uploaded, A File must be uploaded' ,
            success: false,
        });
        return;
    }

    try {
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

        const prompt = `
            You are an expert resume analyst.

            Given the following resume:
            """
            ${resumeText}
            """

            Analyze and return:
            - 3 strengths of the candidate
            - 3 weaknesses or missing elements
            - Skills the candidate should learn
            - A 2–3 line summary of job-fit potential
            - 3 learning resources (with short descriptions and direct links to relevant courses)

            Respond in this JSON format:
            {
                "strengths": [],
                "weaknesses": [],
                "suggestedSkills": [],
                "jobFitSummary": "",
                "learningResources": [
                    {
                    "title": "",
                    "description": "",
                    "url": ""
                    }
                ]
            }`;

        const geminiRes: any = await axios.post(
        `${GEMINI_URL}?key=${GEMINI_API_KEY}`,
        {
            contents: [
            {
                parts: [{ text: prompt }],
            },
            ],
        }
        );
        console.log(geminiRes);


        const content = geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text;
        const cleaned = content.replace(/```json|```/g, '').trim();
        if (!content) {
            res.status(400).json({
                message: "Invalid response from AI"
            });
            return;
        }

        const parsed = JSON.parse(cleaned);
        console.log("------ Response original -------")
        console.log(parsed);

        res.status(200).json({
            message: "Resume analyzed !!",
            success: true,
            cloudinaryUrl: cloudinaryResult.secure_url,
            analysis: parsed,
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