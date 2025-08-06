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

// Create Article / Verse / Study Questions
// Create Article / Verse / Study Questions
export const createArticle = async (req, res) => {
  try {
    let authorImage = '';
    if (req.file) {
      authorImage = await uploadToCloudinary(req.file.buffer);
    }

    const {
      article_title,
      article_authorName,
      article_verseText,
      article_referenceText,
      article_body,
      verse_quote,
      verse_quote_reference,
      question_title,
      questions,
      category,
      keywords, // ✅ new field
    } = req.body;

    if (!category) {
      return res.status(400).json({ success: false, message: "Category is required." });
    }

    // ✅ Sanitize keywords if they come as comma-separated string
    let keywordArray = [];
    if (keywords) {
      if (Array.isArray(keywords)) {
        keywordArray = keywords.map(k => k.trim().toLowerCase());
      } else if (typeof keywords === "string") {
        keywordArray = keywords.split(",").map(k => k.trim().toLowerCase());
      }
    }

    const article = await Article.create({
      article_title,
      article_authorName,
      article_authorImage: authorImage,
      article_verseText,
      article_referenceText,
      article_body,
      verse_quote,
      verse_quote_reference,
      question_title,
      questions,
      category,
      keywords: keywordArray, 
    });

    res.json({ success: true, article });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Article / Verse / Study Questions
export const updateArticle = async (req, res) => {
  try {
    let authorImage = req.body.article_authorImage;

    if (req.file) {
      authorImage = await uploadToCloudinary(req.file.buffer);
    }

    const {
      article_title,
      article_authorName,
      article_verseText,
      article_referenceText,
      article_body,
      verse_quote,
      verse_quote_reference,
      question_title,
      questions,
      category,
      keywords 
    } = req.body;

    const article = await Article.findByIdAndUpdate(
      req.params.id,
      {
        article_title,
        article_authorName,
        article_authorImage: authorImage,
        article_verseText,
        article_referenceText,
        article_body,
        verse_quote,
        verse_quote_reference,
        question_title,
        questions,
        category,
        keywords 
      },
      { new: true }
    );

    res.json({ success: true, article });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get article/verse/question by ID
export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }
    res.json({ success: true, article });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all content (optionally filtered by category)
export const getAllArticles = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = category ? { category } : {};
    const articles = await Article.find(filter).sort({ createdAt: -1 });

    if (!articles || articles.length === 0) {
      return res.status(404).json({ success: false, message: 'No content found' });
    }

    res.json({ success: true, data: articles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get related content in same category with keyword-based priority
export const getRelatedArticles = async (req, res) => {
  const { articleId } = req.params;
  try {
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    const articleKeywords = article.keywords || [];

    // Step 1: Find same category, excluding current article
    const sameCategoryArticles = await Article.find({
      category: article.category,
      _id: { $ne: article._id }
    });

    // Step 2: Rank articles by number of matching keywords
    const rankedArticles = sameCategoryArticles
      .map((item) => {
        const commonKeywords = item.keywords?.filter((kw) =>
          articleKeywords.includes(kw)
        ) || [];
        return {
          ...item.toObject(),
          matchCount: commonKeywords.length,
        };
      })
      .sort((a, b) => b.matchCount - a.matchCount) 
      .slice(0, 5); // Optional: limit to top 5

    res.json({ success: true, related: rankedArticles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Delete content
export const deleteArticle = async (req, res) => {
  try {
    const result = await Article.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    res.json({ success: true, message: 'Content deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
