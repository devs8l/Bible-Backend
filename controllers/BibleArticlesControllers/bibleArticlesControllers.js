/*import BibleVerse from "../../models/BibleArticlesModel/bibleVerse.js";

// Add a Bible Verse
const addBibleVerse = async (req, res) => {
  try {
    const { verseText, reference, category } = req.body;

    const newVerse = new BibleVerse({ verseText, reference, category });
    await newVerse.save();

    res.json({ success: true, message: "Verse Added Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all Bible Verses
const getBibleVerses = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};

    const verses = await BibleVerse.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, verses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Update a Bible Verse (by ID)
const updateBibleVerse = async (req, res) => {
  try {
    const { id, verseText, reference, category } = req.body;

    const updatedVerse = await BibleVerse.findByIdAndUpdate(
      id,
      { verseText, reference, category, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedVerse) {
      return res.status(404).json({ success: false, message: "Verse not found" });
    }

    res.json({ success: true, message: "Verse updated successfully", verse: updatedVerse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a Bible Verse (by ID)
const deleteBibleVerse = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedVerse = await BibleVerse.findByIdAndDelete(id);

    if (!deletedVerse) {
      return res.status(404).json({ success: false, message: "Verse not found" });
    }

    res.json({ success: true, message: "Verse deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addBibleVerse, getBibleVerses, updateBibleVerse, deleteBibleVerse };*/
