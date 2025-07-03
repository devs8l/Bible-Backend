import StudyQuestion from '../../models/BibleArticlesModel/StudyQuestion.js';

export const addStudyQuestions = async (req, res) => {
  try {
    const { title, questions } = req.body;

    if (!title || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ 
        success: false, 
        message: "Title and questions array are required" 
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
      questions: questions // Directly using the array of strings
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
    const { title } = req.query;
    
    if (!title) {
      const allQuestions = await StudyQuestion.find({});
      return res.json({ 
        success: true, 
        data: allQuestions 
      });
    }

    const questions = await StudyQuestion.findOne({ title });
    if (!questions) {
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
    const { questions, newTitle } = req.body;

    const existing = await StudyQuestion.findOne({ title });
    if (!existing) {
      return res.status(404).json({ 
        success: false, 
        message: "Study questions not found" 
      });
    }

    if (newTitle) existing.title = newTitle;
    if (questions) existing.questions = questions; // Direct array assignment
    
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