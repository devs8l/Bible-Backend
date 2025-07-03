import mongoose from 'mongoose';

const studyQuestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  questions: [{
    type: String,  
    required: true,
    trim: true
  }]
}, { timestamps: true });

const StudyQuestion = mongoose.model('StudyQuestion', studyQuestionSchema);
export default StudyQuestion;