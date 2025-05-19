import { Router } from 'express';
import { singleUpload } from '../middlewares/multer.middleware';
import { calculateATSScore } from '../controllers/resume.controller';
import { isAuthenticated } from '../middlewares/isAuthenticated.middleware';

const router = Router();

router.post('/calculate-ats', isAuthenticated ,singleUpload, calculateATSScore);

export default router;