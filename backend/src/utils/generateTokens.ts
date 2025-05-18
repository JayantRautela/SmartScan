import jwt from 'jsonwebtoken';

interface Data {
    username: string;
    id: string;
    email: string;
    fullName: string;
};

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export const generateTokens = (data: Data) => {
    const accessToken = jwt.sign(data, ACCESS_TOKEN_SECRET, {
        expiresIn: '15m'
    });
    const refreshToken = jwt.sign(data, REFRESH_TOKEN_SECRET, {
        expiresIn: '7d'
    });

    return { accessToken, refreshToken };
}