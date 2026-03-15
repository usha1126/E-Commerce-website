const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, keyword, limit } = req.query;
    const filter = {};
    
    if (category) filter.category = category;
    if (keyword) filter.keyword = keyword;
    if (limit) filter.limit = parseInt(limit);
    
    const products = await Product.find(filter).limit(filter.limit);
    res.json({ products });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create product (Admin only)
router.post(
  '/',
  [
    body('name', 'Name is required').not().isEmpty(),
    body('description', 'Description is required').not().isEmpty(),
    body('price', 'Price is required').isNumeric(),
    body('category', 'Category is required').not().isEmpty(),
    body('countInStock', 'Stock count is required').isNumeric()
  ],
  protect, 
  authorize('admin'), 
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, description, price, category, countInStock, image } = req.body;
      
      const newProduct = {
        name,
        description,
        price: parseFloat(price),
        category,
        countInStock: parseInt(countInStock),
        image: image || 'https://via.placeholder.com/300x300',
        rating: 0,
        numReviews: 0,
        createdAt: new Date().toISOString()
      };

      const product = new Product(newProduct);
      await product.save();
      res.status(201).json(product);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Update product (Admin only)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, description, price, category, countInStock, image } = req.body;
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price: parseFloat(price),
        category,
        countInStock: parseInt(countInStock),
        image: image || 'https://via.placeholder.com/300x300'
      },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.status(500).send('Server Error');
  }
});

// Delete product (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    res.json({ msg: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.status(500).send('Server Error');
  }
});

// Add product review
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    const alreadyReviewed = product.reviews.find(
      review => review.user.toString() === req.user.id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ msg: 'Product already reviewed' });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user.id
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;

    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();

    res.status(201).json({ msg: 'Review added' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
