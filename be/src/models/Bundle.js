import mongoose from 'mongoose';

const bundleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  items: [
    {
      name: String,
      type: {
        type: String,
        enum: ['course', 'pdf', 'video', 'link'],
        default: 'course'
      },
      description: String,
    }
  ],
}, {
  timestamps: true,
});

const Bundle = mongoose.model('Bundle', bundleSchema);

export default Bundle;
