import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: String,
  authorName: String,
  authorImage: String,
  verseText: String,
  referenceText: String,
  body: String, 
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

const Article = mongoose.model('Article', articleSchema);
export default Article;
