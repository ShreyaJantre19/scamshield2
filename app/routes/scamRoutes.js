import express from 'express';
import { checkScam, reportScam, getScamReports } from '../controllers/scamController.js';

const router = express.Router();

router.post('/check', checkScam);
router.post('/report', reportScam);
router.get('/reports', getScamReports);

export default router;
