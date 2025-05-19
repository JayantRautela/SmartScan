import { Router } from 'express';
import { singleUpload } from '../middlewares/multer.middleware';
import { calculateATSScore, fetchSKills } from '../controllers/resume.controller';
import { isAuthenticated } from '../middlewares/isAuthenticated.middleware';

const router = Router();

router.post('/calculate-ats', isAuthenticated ,singleUpload, calculateATSScore);
router.post('/extract-skills', isAuthenticated, singleUpload, fetchSKills);

export default router;