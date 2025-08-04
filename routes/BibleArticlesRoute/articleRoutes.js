// routes/BibleArticlesRoutes/articleRoutes.js
import express from 'express';
import upload from '../../middleware/multer.js';
import {
  createArticle,
  updateArticle,
  getArticleById,
  getAllArticles,
  getRelatedArticles,
  deleteArticle
} from '../../controllers/BibleArticlesControllers/articleController.js';
import { verifyAdmin } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', upload.single('file'), verifyAdmin, createArticle);
router.put('/:id', upload.single('file'), verifyAdmin, updateArticle);
router.delete('/:id', verifyAdmin, deleteArticle);

router.get('/', getAllArticles);
router.get('/:id', getArticleById);
router.get('/:articleId/related', getRelatedArticles);

export default router;
