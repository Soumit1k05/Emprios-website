import express from 'express';
import cors from 'cors';
import authRoutes from './src/routes/authRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'API is running...' });
});

// Routes
app.use('/api/auth', authRoutes);

export default app;
