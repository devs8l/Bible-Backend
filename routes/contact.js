import express from 'express';
import Contact from '../models/Contact.js';

const router = express.Router();

// POST /api/contact - Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message, captcha, captchaInput } = req.body;

    if (!name || !email || !subject || !message || !captcha || !captchaInput) {
      return res.status(400).json({ error: 'All fields including CAPTCHA are required.' });
    }

    if (captcha !== captchaInput) {
      return res.status(400).json({ error: 'CAPTCHA does not match. Please try again.' });
    }

    const newEntry = new Contact({ name, email, phone, subject, message });
    await newEntry.save();
    res.status(201).json({ message: 'Form submitted successfully!' });
  } catch (err) {
    console.error('Error saving contact form:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// GET /api/contact - Get all form submissions
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    console.error('Error fetching contact forms:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
