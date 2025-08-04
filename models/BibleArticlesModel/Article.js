import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: String,
  authorName: String,
  authorImage: String,
  verseText: String,
  referenceText: String,
  body: String,
  category: {
    type: String,
    enum: ['Old Testament', 'New Testament', 'Topical Bible Studies', 'Sermon Outlines'],
    required: true
  },
  createdAt: { type: Date, default: Date.now }
});


const Article = mongoose.model('Article', articleSchema);
export default Article;
