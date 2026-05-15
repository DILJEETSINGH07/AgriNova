const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const Message = require('../models/Message');

// Note: In a real app, these routes would be protected by auth middleware
// e.g., router.get('/', auth, async (req, res) => ...

// Get user's chats
router.get('/', async (req, res) => {
  try {
    // Assuming user ID is passed in query for now to simplify auth for MVP
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ message: 'User ID required' });

    const chats = await Chat.find({ participants: userId })
      .populate('participants', 'name role')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chats' });
  }
});

// Get messages for a chat
router.get('/:chatId/messages', async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId })
      .populate('sender', 'name')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

// Create a new chat or get existing
router.post('/', async (req, res) => {
  try {
    const { userId1, userId2 } = req.body;
    
    // Check if chat exists
    let chat = await Chat.findOne({
      participants: { $all: [userId1, userId2] }
    }).populate('participants', 'name role');

    if (!chat) {
      chat = await Chat.create({ participants: [userId1, userId2] });
      chat = await chat.populate('participants', 'name role');
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Error creating chat' });
  }
});

// Save a new message
router.post('/message', async (req, res) => {
  try {
    const { chatId, sender, content, messageType } = req.body;
    
    const message = await Message.create({
      chatId,
      sender,
      content,
      messageType
    });

    // Update lastMessage in chat
    await Chat.findByIdAndUpdate(chatId, { 
      lastMessage: message._id,
      updatedAt: Date.now()
    });

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error saving message' });
  }
});

module.exports = router;
