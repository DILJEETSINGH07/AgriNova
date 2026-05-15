const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allows all origins for development
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/chat', require('./routes/chat'));

// Socket.io Logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', (chatId) => {
    socket.join(chatId);
  });

  socket.on('send_message', (data) => {
    // Broadcast to others in the room
    socket.to(data.chatId).emit('receive_message', data);
  });

  socket.on('typing', (data) => {
    socket.to(data.chatId).emit('user_typing', data.userId);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// Database Connection & Server Start
const startServer = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;

    if (!mongoUri || mongoUri.includes('mongo:27017')) {
      // Development: use in-memory MongoDB
      console.log('DEV MODE: Starting MongoDB Memory Server...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
    } else {
      console.log('PRODUCTION MODE: Connecting to real MongoDB...');
    }

    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected');

    // Seed only in dev mode and only if DB is empty
    if (!isProduction) {
      const User = require('./models/User');
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        const seedDatabase = require('./seed');
        await seedDatabase();
      } else {
        console.log(`DB already has ${userCount} users — skipping seed.`);
      }
    }

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
