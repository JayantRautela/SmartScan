import { Router } from "express";
import { forgotPassword, generateAccessToken, getUser, login, logout, register, resetPassword, sendOtp, verifyOtp } from "../controllers/user.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware";
import { singleUpload } from "../middlewares/multer.middleware";

const router = Router();

router.post('/register', singleUpload, register);
router.post('/login', login);
router.get('/logout', isAuthenticated, logout);
router.post('/sendOtp', sendOtp);
router.post('/verifyOtp', verifyOtp);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword', resetPassword);
router.get('/user', isAuthenticated, getUser);
router.post('/getAccessToken', generateAccessToken);

export default router