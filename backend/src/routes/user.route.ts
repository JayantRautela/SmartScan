import { Router } from "express";
import { singleUpload } from "../middlewares/multer.middleware";
import { register } from "../controllers/user.controller";

const router = Router();

router.post('/register', singleUpload, register);

export default router