import express from 'express';
import upload from '../../middleware/multer.js';
import {
  createArticle,
  updateArticle,
  getArticleById,
  getAllArticles,
  getRelatedArticles
} from '../../controllers/BibleArticlesControllers/articleController.js';
import { verifyAdmin } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Multer handles file upload from 'file' field (profile image)
router.post('/', upload.single('file'), verifyAdmin, createArticle);
router.put('/:id', upload.single('file'), verifyAdmin, updateArticle);
router.get('/:id', getArticleById);
router.get('/', getAllArticles);
router.get('/:articleId/related', getRelatedArticles);

export default router;