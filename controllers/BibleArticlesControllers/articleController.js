// controllers/BibleArticlesControllers/articleController.js
import Article from '../../models/BibleArticlesModel/Article.js';
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary uploader
const uploadToCloudinary = (buffer, folder = 'authors') =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });

// Create Article
export const createArticle = async (req, res) => {
  try {
    let imageUrl = '';
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const { title, authorName, verseText, referenceText, body, category } = req.body;

    if (!category) {
      return res.status(400).json({ success: false, message: "Category is required." });
    }

    const article = await Article.create({
      title,
      authorName,
      verseText,
      referenceText,
      body,
      category,
      authorImage: imageUrl
    });

    res.json({ success: true, article });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Article
export const updateArticle = async (req, res) => {
  try {
    let imageUrl = req.body.authorImage;

    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const { title, authorName, verseText, referenceText, body, category } = req.body;

    const article = await Article.findByIdAndUpdate(
      req.params.id,
      {
        title,
        authorName,
        verseText,
        referenceText,
        body,
        category,
        authorImage: imageUrl
      },
      { new: true }
    );

    res.json({ success: true, article });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get article by ID
export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    res.json({ success: true, article });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get articles by category (or latest if no category)
export const getAllArticles = async (req, res) => {
  try {
    const { category } = req.query;

    let articles;
    if (category) {
      articles = await Article.find({ category }).sort({ createdAt: -1 });
    } else {
      articles = await Article.find({}).sort({ createdAt: -1 });
    }

    if (!articles || articles.length === 0) {
      return res.status(404).json({ success: false, message: 'No articles found' });
    }

    res.json({ success: true, data: articles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get related articles (same category)
export const getRelatedArticles = async (req, res) => {
  const { articleId } = req.params;
  try {
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    const related = await Article.find({
      category: article.category,
      _id: { $ne: articleId },
    }).limit(3);

    res.json({ success: true, related });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete article
export const deleteArticle = async (req, res) => {
  try {
    const result = await Article.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    res.json({ success: true, message: 'Article deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
