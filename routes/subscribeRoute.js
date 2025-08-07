import express from 'express';
import { subscribeHandler } from '../controllers/subscribeController.js';

const router = express.Router();
router.post('/subscribe', subscribeHandler);
export default router;
