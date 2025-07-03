import Article from '../../models/BibleArticlesModel/Article.js';
import { v2 as cloudinary } from 'cloudinary';

// Helper to upload buffer to Cloudinary
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

// Create Article with optional image
export const createArticle = async (req, res) => {
  try {
    let imageUrl = '';
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    // Convert tags string to array
    const tags = req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [];

    const article = await Article.create({
      title: req.body.title,
      authorName: req.body.authorName,
      verseText: req.body.verseText,
      referenceText: req.body.referenceText,
      body: req.body.body,
      tags,
      authorImage: imageUrl
    });

    res.json({ success: true, article });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Article with optional new image
export const updateArticle = async (req, res) => {
  try {
    let imageUrl = req.body.authorImage;

    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    // Convert tags string to array
    const tags = req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [];

    const article = await Article.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        authorName: req.body.authorName,
        verseText: req.body.verseText,
        referenceText: req.body.referenceText,
        body: req.body.body,
        tags,
        authorImage: imageUrl
      },
      { new: true }
    );

    res.json({ success: true, article });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single article
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

// fuction for all article

export const getAllArticles = async (req, res) => {
  try {
    const article = await Article.findOne().sort({ createdAt: -1 });
    
    if (!article) {
      return res.status(404).json({ 
        success: false, 
        message: 'No articles found' 
      });
    }

    res.json({
      success: true,
      data: {
        title: article.title,
        authorName: article.authorName,
        authorImage: article.authorImage,
        verseText: article.verseText,
        referenceText: article.referenceText,
        body: article.body
      }
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};

export const getRelatedArticles = async (req, res) => {
  const { articleId } = req.params;
  try {
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    const related = await Article.find({
      tags: { $in: article.tags },
      _id: { $ne: articleId },
    }).limit(3);
    res.json({ success: true, related });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};