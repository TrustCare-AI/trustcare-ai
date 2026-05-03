const express = require('express');
const axios = require('axios');
const router = express.Router();

const AI_URL = 'http://localhost:8000';

router.post('/chat', async (req, res) => {
  try {
    const response = await axios.post(`${AI_URL}/chat`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('AI Chat Error:', error.message);
    res.status(500).json({ error: 'AI Engine is currently unavailable. Please ensure the Python server is running.' });
  }
});

router.post('/predict', async (req, res) => {
  try {
    const response = await axios.post(`${AI_URL}/predict_disease`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('AI Predict Error:', error.message);
    res.status(500).json({ error: 'AI Engine is currently unavailable. Please ensure the Python server is running.' });
  }
});

module.exports = router;
