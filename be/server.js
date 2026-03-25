import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './routes/user.js';

dotenv.config();

const app = express();

app.use(cors()); 
app.use(express.json());

// Routes
app.use('/api/user', userRouter);

app.get('/', (req, res) => {
  res.send('Emprios Backend is running!');
});

// Check if MONGO_URI exists
if (!process.env.MONGO_URI) {
  console.log('⚠️  MONGO_URI not defined in .env - Running in offline mode for safety');
} else {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Successfully connected to MongoDB!'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
