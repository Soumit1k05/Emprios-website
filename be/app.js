import express from 'express';
import cors from 'cors';
import authRoutes from './src/routes/authRoutes.js';
import bundleRoutes from './src/routes/bundleRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Main Health check
app.get('/', (req, res) => {
  res.json({ message: 'Empiros API is running...' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bundles', bundleRoutes);


export default app;
