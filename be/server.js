const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Sample Digital Products
const products = [
    {
        id: 1,
        title: "Modern UI Design Kit",
        price: 2999,
        description: "100+ premium components for Figma & React.",
        image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800&q=80",
        type: "Design"
    },
    {
        id: 2,
        title: "Node.js Mastery Course",
        price: 4999,
        description: "Zero to Hero backend development guide.",
        image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=800&q=80",
        type: "Course"
    },
    {
        id: 3,
        title: "Instagram Growth Guide",
        price: 999,
        description: "Secret strategies to grow 10k+ followers/month.",
        image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80",
        type: "Marketing"
    },
    {
        id: 4,
        title: "Python Data Science Toolkit",
        price: 3499,
        description: "Comprehensive libraries and templates for DS.",
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
        type: "Code"
    }
];

// API Endpoints
app.get('/api/products', (req, res) => {
    res.json(products);
});

app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
});

// Basic Affiliate Logic (mockup)
app.post('/api/affiliate/register', (req, res) => {
    const { name, email } = req.body;
    const refCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    res.json({
        message: "Affiliate registered successfully",
        refCode,
        dashboardUrl: `/affiliate?ref=${refCode}`
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
