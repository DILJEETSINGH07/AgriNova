const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const bcrypt = require('bcryptjs');
const { MongoMemoryServer } = require('mongodb-memory-server');

dotenv.config();

const seedDatabase = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      let mongoUri = process.env.MONGO_URI || 'mongodb://mongo:27017/agrinova';

      if (mongoUri.includes('mongo:27017') || mongoUri.includes('localhost')) {
        console.log('Starting MongoDB Memory Server for Seeding...');
        const mongoServer = await MongoMemoryServer.create();
        mongoUri = mongoServer.getUri();
      }

      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    console.log('Connected to MongoDB.');

    const isStandalone = require.main === module;

    // Clear existing data ONLY when run standalone (npm run seed)
    // When called from server.js, we only seed if empty — don't wipe accounts
    if (isStandalone) {
      await User.deleteMany();
      await Product.deleteMany();
      console.log('Cleared existing data.');
    } else {
      // Called from server.js — only seed products if empty
      const productCount = await Product.countDocuments();
      if (productCount > 0) {
        console.log('Products already seeded — skipping.');
        return;
      }
    }


    // Seed Users
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@agrinova.com',
      password: passwordHash, // Note: pre-save middleware might re-hash if we're not careful, but we pass plain text usually and let the model hash it. 
      // Wait, in User.js we have a pre('save') hook. So we should pass the raw password if using create.
      role: 'admin',
      location: 'HQ'
    });
    
    // Let's re-do create with plain text passwords to let the pre-save hook do the hashing.
    await User.deleteMany();
    
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@agrinova.com',
      password: 'password123',
      role: 'admin',
      location: 'Headquarters'
    });

    const farmer1 = await User.create({
      name: 'Ramesh Singh',
      email: 'ramesh@agrinova.com',
      password: 'password123',
      role: 'farmer',
      location: 'Punjab, India'
    });

    const farmer2 = await User.create({
      name: 'Suresh Kumar',
      email: 'suresh@agrinova.com',
      password: 'password123',
      role: 'farmer',
      location: 'Haryana, India'
    });

    const customer1 = await User.create({
      name: 'Priya Sharma',
      email: 'priya@agrinova.com',
      password: 'password123',
      role: 'customer',
      location: 'Delhi, India'
    });

    console.log('Users seeded.');

    // Seed Products
    const products = [
      {
        farmer: farmer1._id,
        name: 'Fresh Tomatoes',
        description: 'Organically grown red tomatoes, perfect for salads and cooking.',
        price: 40,
        unit: 'kg',
        quantity: 100,
        category: 'Vegetables',
        imageUrl: 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=400&auto=format&fit=crop'
      },
      {
        farmer: farmer1._id,
        name: 'Crispy Carrots',
        description: 'Sweet and crunchy carrots straight from the farm.',
        price: 30,
        unit: 'kg',
        quantity: 150,
        category: 'Vegetables',
        imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&auto=format&fit=crop'
      },
      {
        farmer: farmer1._id,
        name: 'Fresh Spinach',
        description: 'Nutrient-rich spinach leaves.',
        price: 20,
        unit: 'bunch',
        quantity: 50,
        category: 'Vegetables',
        imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&auto=format&fit=crop'
      },
      {
        farmer: farmer2._id,
        name: 'Alphonso Mangoes',
        description: 'Sweet and juicy Alphonso mangoes, the king of fruits.',
        price: 150,
        unit: 'kg',
        quantity: 80,
        category: 'Fruits',
        imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&auto=format&fit=crop'
      },
      {
        farmer: farmer2._id,
        name: 'Green Apples',
        description: 'Crisp green apples, perfect for a healthy snack.',
        price: 120,
        unit: 'kg',
        quantity: 60,
        category: 'Fruits',
        imageUrl: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&auto=format&fit=crop'
      },
      {
        farmer: farmer2._id,
        name: 'Fresh Strawberries',
        description: 'Plump and sweet strawberries.',
        price: 80,
        unit: 'box',
        quantity: 40,
        category: 'Fruits',
        imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&auto=format&fit=crop'
      },
      {
        farmer: farmer1._id,
        name: 'Organic Potatoes',
        description: 'Versatile and hearty organic potatoes, essential for every kitchen.',
        price: 25,
        unit: 'kg',
        quantity: 200,
        category: 'Vegetables',
        imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&auto=format&fit=crop'
      },
      {
        farmer: farmer1._id,
        name: 'Free-Range Eggs',
        description: 'Farm fresh eggs from happy, pasture-raised hens.',
        price: 80,
        unit: 'dozen',
        quantity: 75,
        category: 'Dairy',
        imageUrl: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=400&auto=format&fit=crop'
      },
      {
        farmer: farmer2._id,
        name: 'Fresh Basil',
        description: 'Aromatic basil perfect for pesto or garnish.',
        price: 20,
        unit: 'bunch',
        quantity: 120,
        category: 'Herbs',
        imageUrl: 'https://images.unsplash.com/photo-1629385701021-fcd568a743a8?w=400&auto=format&fit=crop'
      },
      {
        farmer: farmer2._id,
        name: 'Yellow Bananas',
        description: 'Perfectly ripe bananas, great for energy.',
        price: 35,
        unit: 'dozen',
        quantity: 100,
        category: 'Fruits',
        imageUrl: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400&auto=format&fit=crop'
      },
      {
        farmer: farmer1._id,
        name: 'Fresh Onions',
        description: 'Farm-fresh onions, essential for every dish.',
        price: 25,
        unit: 'kg',
        quantity: 200,
        category: 'Vegetables',
        imageUrl: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=400&auto=format&fit=crop'
      },
      {
        farmer: farmer1._id,
        name: 'Whole Milk',
        description: 'Fresh, creamy whole milk from grass-fed cows.',
        price: 60,
        unit: 'litre',
        quantity: 50,
        category: 'Dairy',
        imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop'
      }
    ];


    await Product.insertMany(products);
    console.log('Products seeded.');

    console.log('Database seeding completed successfully.');
    console.log('Database seeding completed successfully.');
    if (require.main === module) process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    if (require.main === module) process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
