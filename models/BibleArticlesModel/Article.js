// models/article.js
import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema(
  {
    article_title: { type: String, trim: true },
    article_authorName: { type: String, trim: true },
    article_authorImage: { type: String, trim: true },
    article_verseText: { type: String, trim: true },
    article_referenceText: { type: String, trim: true },
    article_body: { type: String },

    category: {
      type: String,
      enum: [
        "Old Testament",
        "New Testament",
        "Topical Bible Studies",
        "Sermon Outlines",
      ],
      required: true,
    },

    // For Bible Verse entries
    verse_quote: { type: String, trim: true },
    verse_quote_reference: { type: String, trim: true },

    // For Study Questions
    question_title: { type: String, trim: true },
    questions: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
  },
  {
    timestamps: true, // Automatically handles createdAt and updatedAt
  }
);

const Article = mongoose.model("Article", ArticleSchema);
export default Article;
