const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const fs = require('fs');

const router = express.Router();

// Multer config for file uploads
const upload = multer({ dest: 'uploads/' });

router.post('/scan', upload.single('report'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imagePath = req.file.path;

    // Run OCR
    const { data: { text } } = await Tesseract.recognize(
      imagePath,
      'eng',
      { logger: m => console.log(m) }
    );

    // Clean up uploaded file
    fs.unlinkSync(imagePath);

    // Send the extracted text to the Python AI Engine for advanced analysis
    let analysis = [];
    try {
      const axios = require('axios');
      const aiResponse = await axios.post('http://localhost:8000/analyze_report', { text });
      analysis = aiResponse.data.analysis;
    } catch (aiError) {
      console.error('AI Analysis failed, falling back to simple rules.', aiError.message);
      // Fallback simple rule if AI engine is down
      analysis.push({ finding: "AI analysis server unavailable.", type: "Error" });
    }

    res.json({
      extractedText: text,
      analysis: analysis
    });

  } catch (error) {
    console.error('OCR Error:', error);
    res.status(500).json({ error: 'Failed to process report' });
  }
});

module.exports = router;
