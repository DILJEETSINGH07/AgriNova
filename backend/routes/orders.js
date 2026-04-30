const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, farmerOnly } = require('../middleware/auth');

// @route POST /api/orders
// @desc Create new order
// @access Private
router.post('/', protect, async (req, res) => {
  try {
    const { products, shippingAddress } = req.body;

    if (products && products.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    } else {
      // Basic order creation. Note: In real app, re-verify prices from DB
      // For simplicity, we assume one order = one farmer. 
      // If multiple farmers, we should split into multiple orders or handle accordingly.
      // Let's assume all products in the cart are from the same farmer for this MVP, or we pick the farmer from the first product.
      
      const firstProduct = await Product.findById(products[0].product);
      if(!firstProduct) return res.status(404).json({ message: 'Product not found' });

      let totalAmount = 0;
      for (const item of products) {
        totalAmount += item.price * item.quantity;
        // Decrease quantity from inventory
        const dbProduct = await Product.findById(item.product);
        if(dbProduct) {
            dbProduct.quantity -= item.quantity;
            await dbProduct.save();
        }
      }

      const order = new Order({
        customer: req.user.id,
        farmer: firstProduct.farmer,
        products,
        shippingAddress,
        totalAmount
      });

      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route GET /api/orders/myorders
// @desc Get logged in user orders
// @access Private
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id }).populate('products.product', 'name imageUrl');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route GET /api/orders/farmerorders
// @desc Get logged in farmer orders
// @access Private/Farmer
router.get('/farmerorders', protect, farmerOnly, async (req, res) => {
  try {
    const orders = await Order.find({ farmer: req.user.id }).populate('customer', 'name email').populate('products.product', 'name imageUrl');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route PUT /api/orders/:id/status
// @desc Update order status
// @access Private/Farmer
router.put('/:id/status', protect, farmerOnly, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      if (order.farmer.toString() !== req.user.id) {
        return res.status(401).json({ message: 'Not authorized to update this order' });
      }

      order.status = req.body.status || order.status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
