import StudyQuestion from '../../models/BibleArticlesModel/StudyQuestion.js';

export const addStudyQuestions = async (req, res) => {
  try {
    const { title, category, questions } = req.body;

    if (!title || !category || !questions || !Array.isArray(questions)) {
      return res.status(400).json({
        success: false,
        message: "Title, category, and questions array are required"
      });
    }

    const existing = await StudyQuestion.findOne({ title });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Title already exists. Use update instead."
      });
    }

    const newQ = new StudyQuestion({
      title,
      category,
      questions
    });

    await newQ.save();
    res.status(201).json({
      success: true,
      message: "Study questions added successfully",
      data: newQ
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const getStudyQuestions = async (req, res) => {
  try {
    const { title, category } = req.query;

    let filter = {};
    if (title) filter.title = title;
    if (category) filter.category = category;

    const questions = await StudyQuestion.find(filter);

    if (title && questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Study questions not found"
      });
    }

    res.json({
      success: true,
      data: questions
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const updateStudyQuestions = async (req, res) => {
  try {
    const { title } = req.params;
    const { questions, newTitle, category } = req.body;

    const existing = await StudyQuestion.findOne({ title });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Study questions not found"
      });
    }

    if (newTitle) existing.title = newTitle;
    if (category) existing.category = category;
    if (questions) existing.questions = questions;

    await existing.save();
    res.json({
      success: true,
      message: "Study questions updated successfully",
      data: existing
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const deleteStudyQuestions = async (req, res) => {
  try {
    const { title } = req.params;
    
    const result = await StudyQuestion.deleteOne({ title });
    if (result.deletedCount === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Study questions not found" 
      });
    }
    
    res.json({ 
      success: true, 
      message: "Study questions deleted successfully" 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};