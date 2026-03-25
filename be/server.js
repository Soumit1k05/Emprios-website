const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors()); 
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Successfully connected to MongoDB!'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));


app.get('/', (req, res) => {
  res.send('Emprios Backend is running!');
});

app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  console.log(`New registration attempt: ${name} (${email})`);
  
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Simulate success for now
  res.status(201).json({ 
    message: 'User registered successfully',
    user: { name, email }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

