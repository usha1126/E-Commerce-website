const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const SimpleDatabase = require('./database');

const app = express();

// Initialize simple database
const db = new SimpleDatabase();

// Make database available to routes
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3002', 'http://127.0.0.1:3000', 'http://127.0.0.1:3002'],
  credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

console.log('Simple file-based database initialized');

// Routes
app.use('/api/auth', require('./routes/auth'));
// Temporarily disable other routes to fix registration
// app.use('/api/products', require('./routes/products-simple'));
// app.use('/api/orders', require('./routes/orders'));
// app.use('/api/users', require('./routes/users'));

// Add a simple products route
app.get('/api/products', async (req, res) => {
  try {
    const { category, keyword, limit, sort, order } = req.query;
    const filter = {};
    
    if (category) filter.category = category;
    if (keyword) filter.keyword = keyword;
    if (limit) filter.limit = parseInt(limit);
    
    let products = await req.db.findProducts(filter);
    
    // Handle sorting
    if (sort) {
      const sortOrder = order === 'desc' ? -1 : 1;
      products.sort((a, b) => {
        if (sort === 'price') {
          return sortOrder * (a.price - b.price);
        } else if (sort === 'name') {
          return sortOrder * a.name.localeCompare(b.name);
        } else if (sort === 'rating') {
          return sortOrder * (a.rating - b.rating);
        } else {
          // Default sort by createdAt
          return sortOrder * (new Date(a.createdAt) - new Date(b.createdAt));
        }
      });
    }
    
    res.json({ products });
  } catch (err) {
    console.error('Products error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await req.db.findProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
