const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');
const ocrRoutes = require('./routes/ocr');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
let MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    if (!MONGO_URI) {
      console.log('🔄 No MONGO_URI found. Starting In-Memory MongoDB Server...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      MONGO_URI = mongoServer.getUri();
      console.log(`✅ In-Memory MongoDB Server started at ${MONGO_URI}`);
    }

    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Connected Successfully');
  } catch (err) {
    console.error('⚠️ MongoDB Connection Failed. Error:', err.message);
  }
};

connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/ocr', ocrRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'Node.js Backend is healthy' });
});

app.listen(PORT, () => {
  console.log(`🚀 Node.js Backend running on port ${PORT}`);
});
