import mongoose from 'mongoose';

const bibleVerseSchema = new mongoose.Schema({
  verseText: {
    type: String,
    required: true,
  },
  reference: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const BibleVerse = mongoose.model('BibleVerse', bibleVerseSchema);
export default BibleVerse;
