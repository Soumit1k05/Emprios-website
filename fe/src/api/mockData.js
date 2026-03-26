// Mock data for frontend-only testing
export const mockBundles = [
  {
    _id: '1',
    title: 'Web Development Masterclass',
    description: 'Complete web development bundle with HTML, CSS, JavaScript, React, and Node.js tutorials',
    price: 4999,
    category: 'web-dev',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
    items: [
      {
        name: 'HTML & CSS Basics',
        type: 'course',
        url: 'https://www.freecodecamp.org/learn/responsive-web-design/',
        description: 'Complete HTML and CSS course'
      },
      {
        name: 'JavaScript Complete Guide',
        type: 'course',
        url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/',
        description: 'JavaScript algorithms and data structures'
      },
      {
        name: 'React.js Tutorial',
        type: 'course',
        url: 'https://react.dev/learn',
        description: 'Official React documentation and tutorial'
      },
      {
        name: 'Node.js Handbook',
        type: 'pdf',
        url: 'https://nodejs.org/en/docs/',
        description: 'Node.js official documentation'
      },
      {
        name: 'Web Development Roadmap',
        type: 'link',
        url: 'https://roadmap.sh/frontend',
        description: 'Frontend development roadmap'
      }
    ]
  },
  {
    _id: '2',
    title: 'AI & Machine Learning Bundle',
    description: 'Comprehensive AI/ML bundle with Python, TensorFlow, and practical projects',
    price: 5999,
    category: 'ai-ml',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop&q=80&blend=https://images.unsplash.com/photo-1555949519-d953f7cf9710?w=400&h=300&fit=crop&blend_mode=darken&blend=50%',
    items: [
      {
        name: 'Python for Data Science',
        type: 'course',
        url: 'https://www.freecodecamp.org/learn/data-analysis-with-python/',
        description: 'Python for data analysis and science'
      },
      {
        name: 'Machine Learning with Python',
        type: 'course',
        url: 'https://www.freecodecamp.org/learn/machine-learning-with-python/',
        description: 'Complete ML course with Python'
      },
      {
        name: 'TensorFlow & Deep Learning',
        type: 'course',
        url: 'https://www.tensorflow.org/tutorials',
        description: 'TensorFlow official tutorials'
      },
      {
        name: 'AI/ML Resource Collection',
        type: 'link',
        url: 'https://github.com/openai/gpt-3',
        description: 'AI/ML GitHub resources'
      },
      {
        name: 'Kaggle Datasets Guide',
        type: 'website',
        url: 'https://www.kaggle.com/datasets',
        description: 'Kaggle datasets for ML projects'
      }
    ]
  },
  {
    _id: '3',
    title: 'Interview Preparation Bundle',
    description: 'Complete interview prep with DSA, system design, and behavioral questions',
    price: 2999,
    category: 'interview-prep',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    items: [
      {
        name: 'Data Structures & Algorithms',
        type: 'course',
        url: 'https://www.freecodecamp.org/learn/coding-interview-prep/',
        description: 'Complete DSA tutorial'
      },
      {
        name: 'System Design Course',
        type: 'link',
        url: 'https://github.com/donnemartin/system-design-primer',
        description: 'System design basics'
      },
      {
        name: 'LeetCode DSA Practice',
        type: 'website',
        url: 'https://leetcode.com',
        description: 'Practice coding problems'
      },
      {
        name: 'Interview Questions Bank',
        type: 'pdf',
        url: 'https://www.interviewbit.com',
        description: 'Interview preparation platform'
      },
      {
        name: 'Behavioral Interview Guide',
        type: 'link',
        url: 'https://www.indeed.com/career-advice',
        description: 'Career advice and interview tips'
      }
    ]
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
      purchaseDate: new Date()
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
