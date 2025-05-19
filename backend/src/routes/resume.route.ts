import { Router } from 'express';
import { singleUpload } from '../middlewares/multer.middleware';
import { analyzeResume, calculateATSScore, fetchSKills } from '../controllers/resume.controller';
import { isAuthenticated } from '../middlewares/isAuthenticated.middleware';

const router = Router();

router.post('/calculate-ats', isAuthenticated ,singleUpload, calculateATSScore);
router.post('/extract-skills', isAuthenticated, singleUpload, fetchSKills);
router.post('/analyse-resume', isAuthenticated, singleUpload, analyzeResume);

export default router;