const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));

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

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
