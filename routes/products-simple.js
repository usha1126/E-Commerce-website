const express = require('express');
const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, keyword, limit } = req.query;
    const filter = {};
    
    if (category) filter.category = category;
    if (keyword) filter.keyword = keyword;
    if (limit) filter.limit = parseInt(limit);
    
    const products = await req.db.findProducts(filter);
    res.json({ products });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await req.db.findProductById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
