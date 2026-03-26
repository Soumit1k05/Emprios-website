import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'moderator', 'admin'], default: 'user' },
  affiliateCode: { type: String, unique: true, sparse: true },
  referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  earnings: { type: Number, default: 0 },
  payouts: [{
    amount: Number,
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'completed', 'rejected'], default: 'pending' },
    method: String,
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);

