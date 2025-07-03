import express from 'express';
import {
  addStudyQuestions,
  getStudyQuestions,
  updateStudyQuestions,
  deleteStudyQuestions
} from '../../controllers/BibleArticlesControllers/studyQuestionController.js';
import { verifyAdmin } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Add new study questions
router.post('/', verifyAdmin, addStudyQuestions);

// Get study questions (all or by title)
router.get('/', getStudyQuestions);

// Update study questions by title
router.put('/:title', verifyAdmin, updateStudyQuestions);

// Delete study questions by title
router.delete('/:title', verifyAdmin, deleteStudyQuestions);

export default router;