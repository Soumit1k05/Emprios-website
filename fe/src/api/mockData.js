// Mock data for frontend-only testing
export const mockBundles = [
  {
    _id: '1',
    title: 'Basic Bundle',
    description: 'Normal marketing strategies course - Master the fundamentals of digital and traditional marketing.',
    price: 999,
    category: 'marketing',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    items: [
      { name: 'Introduction to Marketing', type: 'course', description: 'Core concepts and principles.' },
      { name: 'Email Marketing Basics', type: 'course', description: 'How to build and nurture email lists.' },
      { name: 'Marketing Strategy Templates', type: 'pdf', description: 'Ready-to-use planning templates.' }
    ],
    downloadUrl: 'https://github.com/microsoft/Web-Dev-For-Beginners/archive/refs/heads/main.zip'
  },
  {
    _id: '2',
    title: 'Pro Bundle',
    description: 'Social media marketing course - Grow your audience and engagement on all major platforms.',
    price: 1999,
    category: 'social-media',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop',
    items: [
      { name: 'Instagram Growth Mastery', type: 'course', description: 'Advanced tactics for Instagram.' },
      { name: 'TikTok Marketing Guide', type: 'course', description: 'Short-form content strategies.' },
      { name: 'Ad Campaign Manager', type: 'pdf', description: 'Optimizing paid social ads.' }
    ],
    downloadUrl: 'https://github.com/freeCodeCamp/freeCodeCamp/archive/refs/heads/main.zip'
  },
  {
    _id: '3',
    title: 'Premium Bundle',
    description: 'Cryptocurrency course - Everything you need to know about blockchain, trading, and decentralized finance.',
    price: 4999,
    category: 'crypto',
    image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=300&fit=crop',
    items: [
      { name: 'Blockchain Fundamentals', type: 'course', description: 'How crypto actually works.' },
      { name: 'Trading Basics & Charting', type: 'course', description: 'Technical analysis and indicators.' },
      { name: 'Security & Wallet Guide', type: 'pdv', description: 'Keeping your assets safe.' }
    ],
    downloadUrl: 'https://github.com/bitcoin/bitcoin/archive/refs/heads/master.zip'
  },
  {
    _id: '4',
    title: 'Legendary Bundle',
    description: 'Stock market and real estate course - Build long-term wealth through equity and property investments.',
    price: 9999,
    category: 'investing',
    image: 'https://images.unsplash.com/photo-1554672408-730436b60dde?w=400&h=300&fit=crop',
    items: [
      { name: 'Equity Research & Valuation', type: 'course', description: 'Analyzing stocks like a pro.' },
      { name: 'Real Estate Investment Strategies', type: 'course', description: 'Rental yield and appreciation.' },
      { name: 'Wealth Tax Management', type: 'pdf', description: 'Optimizing your portfolio returns.' }
    ],
    downloadUrl: 'https://github.com/public-apis/public-apis/archive/refs/heads/master.zip'
  }
];

// Mock purchases storage
let mockPurchases = [];

export const mockBundleAPI = {
  getAllBundles: async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockBundles;
  },

  getBundleById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const bundle = mockBundles.find(b => b._id === id);
    if (!bundle) throw new Error('Bundle not found');
    return bundle;
  },

  initiatePurchase: async (bundleId) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const bundle = mockBundles.find(b => b._id === bundleId);
    if (!bundle) throw new Error('Bundle not found');
    
    const purchase = {
      _id: 'mock_' + Date.now(),
      user: 'mock_user',
      bundle: bundleId,
      amount: bundle.price,
      status: 'pending'
    };
    
    mockPurchases.push(purchase);
    return {
      success: true,
      purchase,
      bundle: {
        id: bundle._id,
        title: bundle.title,
        price: bundle.price
      }
    };
  },

  handlePaymentSuccess: async (purchaseId, paymentId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const purchase = mockPurchases.find(p => p._id === purchaseId);
    if (!purchase) throw new Error('Purchase not found');
    
    purchase.status = 'completed';
    purchase.paymentId = paymentId;
    
    return {
      success: true,
      message: 'Payment successful',
      purchase
    };
  },

  getUserPurchasedBundles: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const completedPurchases = mockPurchases.filter(p => p.status === 'completed');
    return mockBundles.filter(b => completedPurchases.some(p => p.bundle === b._id));
  },

  getBundleItems: async (bundleId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const bundle = mockBundles.find(b => b._id === bundleId);
    if (!bundle) throw new Error('Bundle not found');
    
    // Check if purchased (mock: always return since frontend-only)
    return {
      bundleTitle: bundle.title,
      items: bundle.items,
      purchaseDate: new Date(),
      downloadUrl: bundle.downloadUrl
    };
  }
};

// Auth mock (for future use)
export const mockAuthAPI = {
  register: async (name, email, password) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      _id: 'mock_user_1',
      name,
      email,
      token: 'mock_token_' + Date.now()
    };
  },

  login: async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      _id: 'mock_user_1',
      name: 'Test User',
      email,
      token: 'mock_token_' + Date.now()
    };
  }
};

export default { mockBundleAPI, mockAuthAPI };
