import Bundle from '../models/Bundle.js';

export const getAllBundles = async (req, res) => {
  try {
    let bundles = await Bundle.find({});
    
    // Auto-seed if empty
    if (bundles.length === 0) {
      await seedBundlesSync();
      bundles = await Bundle.find({});
    }
    
    res.json(bundles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const seedBundlesSync = async () => {
  const mockBundles = [
    {
      title: 'Basic Bundle',
      description: 'Normal marketing strategies course - Master the fundamentals of digital and traditional marketing.',
      price: 999,
      category: 'marketing',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      items: [
        { name: 'Introduction to Marketing', type: 'course', description: 'Core concepts and principles.' },
        { name: 'Email Marketing Basics', type: 'course', description: 'How to build and nurture email lists.' },
        { name: 'Marketing Strategy Templates', type: 'pdf', description: 'Ready-to-use planning templates.' }
      ]
    },
    {
      title: 'Pro Bundle',
      description: 'Social media marketing course - Grow your audience and engagement on all major platforms.',
      price: 1999,
      category: 'social-media',
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop',
      items: [
        { name: 'Instagram Growth Mastery', type: 'course', description: 'Advanced tactics for Instagram.' },
        { name: 'TikTok Marketing Guide', type: 'course', description: 'Short-form content strategies.' },
        { name: 'Ad Campaign Manager', type: 'pdf', description: 'Optimizing paid social ads.' }
      ]
    },
    {
      title: 'Premium Bundle',
      description: 'Cryptocurrency course - Everything you need to know about blockchain, trading, and decentralized finance.',
      price: 4999,
      category: 'crypto',
      image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=300&fit=crop',
      items: [
        { name: 'Blockchain Fundamentals', type: 'course', description: 'How crypto actually works.' },
        { name: 'Trading Basics & Charting', type: 'course', description: 'Technical analysis and indicators.' },
        { name: 'Security & Wallet Guide', type: 'pdf', description: 'Keeping your assets safe.' }
      ]
    },
    {
      title: 'Legendary Bundle',
      description: 'Stock market and real estate course - Build long-term wealth through equity and property investments.',
      price: 9999,
      category: 'investing',
      image: 'https://images.unsplash.com/photo-1554672408-730436b60dde?w=400&h=300&fit=crop',
      items: [
        { name: 'Equity Research & Valuation', type: 'course', description: 'Analyzing stocks like a pro.' },
        { name: 'Real Estate Investment Strategies', type: 'course', description: 'Rental yield and appreciation.' },
        { name: 'Wealth Tax Management', type: 'pdf', description: 'Optimizing your portfolio returns.' }
      ]
    }
  ];
  await Bundle.insertMany(mockBundles);
};

export const getBundleById = async (req, res) => {
  try {
    const bundle = await Bundle.findById(req.params.id);
    if (!bundle) return res.status(404).json({ message: 'Bundle not found' });
    res.json(bundle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Seed script (optional: can also be a dedicated script)
export const seedBundles = async (req, res) => {
  const mockBundles = [
    {
      title: 'Basic Bundle',
      description: 'Normal marketing strategies course - Master the fundamentals of digital and traditional marketing.',
      price: 999,
      category: 'marketing',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      items: [
        { name: 'Introduction to Marketing', type: 'course', description: 'Core concepts and principles.' },
        { name: 'Email Marketing Basics', type: 'course', description: 'How to build and nurture email lists.' },
        { name: 'Marketing Strategy Templates', type: 'pdf', description: 'Ready-to-use planning templates.' }
      ]
    },
    {
      title: 'Pro Bundle',
      description: 'Social media marketing course - Grow your audience and engagement on all major platforms.',
      price: 1999,
      category: 'social-media',
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop',
      items: [
        { name: 'Instagram Growth Mastery', type: 'course', description: 'Advanced tactics for Instagram.' },
        { name: 'TikTok Marketing Guide', type: 'course', description: 'Short-form content strategies.' },
        { name: 'Ad Campaign Manager', type: 'pdf', description: 'Optimizing paid social ads.' }
      ]
    },
    {
      title: 'Premium Bundle',
      description: 'Cryptocurrency course - Everything you need to know about blockchain, trading, and decentralized finance.',
      price: 4999,
      category: 'crypto',
      image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=300&fit=crop',
      items: [
        { name: 'Blockchain Fundamentals', type: 'course', description: 'How crypto actually works.' },
        { name: 'Trading Basics & Charting', type: 'course', description: 'Technical analysis and indicators.' },
        { name: 'Security & Wallet Guide', type: 'pdf', description: 'Keeping your assets safe.' }
      ]
    },
    {
      title: 'Legendary Bundle',
      description: 'Stock market and real estate course - Build long-term wealth through equity and property investments.',
      price: 9999,
      category: 'investing',
      image: 'https://images.unsplash.com/photo-1554672408-730436b60dde?w=400&h=300&fit=crop',
      items: [
        { name: 'Equity Research & Valuation', type: 'course', description: 'Analyzing stocks like a pro.' },
        { name: 'Real Estate Investment Strategies', type: 'course', description: 'Rental yield and appreciation.' },
        { name: 'Wealth Tax Management', type: 'pdf', description: 'Optimizing your portfolio returns.' }
      ]
    }
  ];

  try {
    // Check if bundles already exist to avoid duplicates
    const count = await Bundle.countDocuments();
    if (count > 0) return res.status(400).json({ message: 'Bundles already seeded' });

    await Bundle.insertMany(mockBundles);
    res.status(201).json({ message: 'Bundles seeded successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const downloadBundle = async (req, res) => {
  try {
    const bundle = await Bundle.findById(req.params.id);
    if (!bundle) return res.status(404).json({ message: 'Bundle not found' });

    let bundleUrl = "";
    
    switch (bundle.category) {
      case 'marketing':
        bundleUrl = 'https://github.com/Aryann-rajnish/Finance-Book-and-content/archive/refs/heads/master.zip';
        break;
      case 'social-media':
        bundleUrl = 'https://github.com/karthiksekaran/digital-marketing/archive/refs/heads/master.zip';
        break;
      case 'crypto':
        bundleUrl = 'https://github.com/LifnaJos/Cryptocurrency-Blockchain-Development/archive/refs/heads/main.zip';
        break;
      case 'investing':
        bundleUrl = 'https://github.com/Amey-Thakur/FINANCE-MANAGEMENT/archive/refs/heads/main.zip';
        break;
    }
    
    res.json({ 
      message: 'Download started', 
      downloadUrl: bundleUrl,
      bundleTitle: bundle.title
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBundleItems = async (req, res) => {
  try {
    const bundle = await Bundle.findById(req.params.id);
    if (!bundle) return res.status(404).json({ message: 'Bundle not found' });
    
    res.json({
      bundleTitle: bundle.title,
      items: bundle.items,
      purchaseDate: new Date()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
