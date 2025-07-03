import ImageTitle from "../../models/BibleArticlesModel/ImageTitle.js";
import { v2 as cloudinary } from "cloudinary";

// Create new entry
export const createImageTitle = async (req, res) => {
  try {
    const { title } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ error: "Image upload failed" });
        }

        const newEntry = new ImageTitle({
          title,
          imageUrl: result.secure_url,
          cloudinaryId: result.public_id,
        });

        await newEntry.save();
        res.status(201).json(newEntry);
      }
    ).end(req.file.buffer);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all entries
export const getAllImageTitles = async (req, res) => {
  try {
    const entries = await ImageTitle.find().sort({ createdAt: -1 });
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single entry
export const getImageTitle = async (req, res) => {
  try {
    const entry = await ImageTitle.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ error: "Entry not found" });
    }
    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update entry
export const updateImageTitle = async (req, res) => {
  try {
    const { title } = req.body;
    const entry = await ImageTitle.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ error: "Entry not found" });
    }

    let updateData = { title };

    // If new image is uploaded
    if (req.file) {
      // First delete old image from Cloudinary
      await cloudinary.uploader.destroy(entry.cloudinaryId);

      // Upload new image
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "auto" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });

      updateData.imageUrl = result.secure_url;
      updateData.cloudinaryId = result.public_id;
    }

    const updatedEntry = await ImageTitle.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json(updatedEntry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete entry
export const deleteImageTitle = async (req, res) => {
  try {
    const entry = await ImageTitle.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ error: "Entry not found" });
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(entry.cloudinaryId);

    // Delete from database
    await ImageTitle.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};