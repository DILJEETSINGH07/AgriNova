const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const { protect, farmerOnly } = require('../middleware/auth');

// @route GET /api/products
// @desc Get all products (with optional search/filter)
router.get('/', async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: 'i' } }
      : {};
    
    const category = req.query.category ? { category: req.query.category } : {};

    let farmerMatch = {};
    if (req.query.location) {
      const farmers = await User.find({ role: 'farmer', location: { $regex: req.query.location, $options: 'i' } });
      const farmerIds = farmers.map(f => f._id);
      farmerMatch = { farmer: { $in: farmerIds } };
    }

    const products = await Product.find({ ...keyword, ...category, ...farmerMatch }).populate('farmer', 'name location phone coordinates');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route GET /api/products/:id
// @desc Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('farmer', 'name location phone coordinates');
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route POST /api/products
// @desc Create a new product
// @access Private/Farmer
router.post('/', protect, farmerOnly, async (req, res) => {
  try {
    const { name, description, price, unit, quantity, category, imageUrl } = req.body;

    const product = new Product({
      name,
      description,
      price,
      unit,
      quantity,
      category,
      imageUrl,
      farmer: req.user.id
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route PUT /api/products/:id
// @desc Update a product
// @access Private/Farmer
router.put('/:id', protect, farmerOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // Check if this farmer owns the product
      if (product.farmer.toString() !== req.user.id) {
        return res.status(401).json({ message: 'Not authorized to edit this product' });
      }

      product.name = req.body.name || product.name;
      product.description = req.body.description || product.description;
      product.price = req.body.price || product.price;
      product.unit = req.body.unit || product.unit;
      product.quantity = req.body.quantity || product.quantity;
      product.category = req.body.category || product.category;
      product.imageUrl = req.body.imageUrl || product.imageUrl;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route DELETE /api/products/:id
// @desc Delete a product
// @access Private/Farmer
router.delete('/:id', protect, farmerOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      if (product.farmer.toString() !== req.user.id) {
        return res.status(401).json({ message: 'Not authorized to delete this product' });
      }
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route GET /api/products/farmer/myproducts
// @desc Get logged in farmer's products
// @access Private/Farmer
router.get('/farmer/myproducts', protect, farmerOnly, async (req, res) => {
    try {
      const products = await Product.find({ farmer: req.user.id });
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;
