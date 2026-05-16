const express = require('express');
const router = express.Router();
const sendEmail = require('../utils/sendEmail');

// @route   POST /api/newsletter/subscribe
// @desc    Subscribe to newsletter
// @access  Public
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Send confirmation email
    await sendEmail({
      email,
      subject: 'Welcome to AgriNova Newsletter! 🌱',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #059669; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Welcome to the Family!</h1>
          </div>
          <div style="padding: 30px; background-color: #f9fafb;">
            <p style="font-size: 16px; color: #374151; line-height: 1.5;">Hi there,</p>
            <p style="font-size: 16px; color: #374151; line-height: 1.5;">Thank you for subscribing to the AgriNova newsletter! We are thrilled to have you.</p>
            <p style="font-size: 16px; color: #374151; line-height: 1.5;">Get ready for fresh updates, market trends, seasonal harvest alerts, and exclusive farmer stories delivered right to your inbox.</p>
            <p style="font-size: 16px; color: #374151; line-height: 1.5;">Stay fresh, stay healthy!</p>
            <p style="font-size: 16px; color: #374151; line-height: 1.5; margin-bottom: 0;">- The AgriNova Team</p>
          </div>
          <div style="background-color: #111827; color: #9ca3af; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">No Spam. Just organic goodness.</p>
            <p style="margin: 5px 0 0 0;">&copy; ${new Date().getFullYear()} AgriNova. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    res.status(200).json({ message: 'Subscription successful' });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ message: 'Server error during subscription' });
  }
});

module.exports = router;
