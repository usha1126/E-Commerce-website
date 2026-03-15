const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
require('dotenv').config();

const seedProducts = async () => {
  try {
    // Clear existing products
    await Product.deleteMany();
    
    const products = [
      {
        name: 'Wireless Headphones',
        description: 'Premium noise-cancelling wireless headphones with 30-hour battery life and superior sound quality.',
        price: 199.99,
        category: 'Electronics',
        brand: 'AudioTech',
        image: 'https://via.placeholder.com/300x300',
        countInStock: 50,
        rating: 4.5,
        numReviews: 12
      },
      {
        name: 'Smart Watch',
        description: 'Advanced fitness tracking, heart rate monitoring, and smartphone integration in a sleek design.',
        price: 299.99,
        category: 'Electronics',
        brand: 'TechTime',
        image: 'https://via.placeholder.com/300x300',
        countInStock: 30,
        rating: 4.3,
        numReviews: 8
      },
      {
        name: 'Laptop Backpack',
        description: 'Durable and spacious backpack with dedicated laptop compartment and multiple organizer pockets.',
        price: 49.99,
        category: 'Electronics',
        brand: 'CarryPro',
        image: 'https://via.placeholder.com/300x300',
        countInStock: 75,
        rating: 4.7,
        numReviews: 23
      },
      {
        name: 'Running Shoes',
        description: 'Lightweight and comfortable running shoes with advanced cushioning technology.',
        price: 89.99,
        category: 'Sports',
        brand: 'SpeedRun',
        image: 'https://via.placeholder.com/300x300',
        countInStock: 60,
        rating: 4.6,
        numReviews: 15
      },
      {
        name: 'Yoga Mat',
        description: 'Non-slip, eco-friendly yoga mat with extra cushioning for comfortable practice.',
        price: 29.99,
        category: 'Sports',
        brand: 'ZenFit',
        image: 'https://via.placeholder.com/300x300',
        countInStock: 100,
        rating: 4.4,
        numReviews: 18
      },
      {
        name: 'Coffee Maker',
        description: 'Programmable coffee maker with thermal carafe and customizable brewing options.',
        price: 79.99,
        category: 'Home',
        brand: 'BrewMaster',
        image: 'https://via.placeholder.com/300x300',
        countInStock: 40,
        rating: 4.2,
        numReviews: 10
      },
      {
        name: 'Desk Lamp',
        description: 'LED desk lamp with adjustable brightness and color temperature for optimal lighting.',
        price: 39.99,
        category: 'Home',
        brand: 'BrightLight',
        image: 'https://via.placeholder.com/300x300',
        countInStock: 80,
        rating: 4.5,
        numReviews: 20
      },
      {
        name: 'Winter Jacket',
        description: 'Warm and waterproof winter jacket with insulation and multiple pockets.',
        price: 149.99,
        category: 'Clothing',
        brand: 'WeatherProof',
        image: 'https://via.placeholder.com/300x300',
        countInStock: 35,
        rating: 4.6,
        numReviews: 14
      },
      {
        name: 'Denim Jeans',
        description: 'Classic fit denim jeans with comfortable stretch fabric and durable construction.',
        price: 59.99,
        category: 'Clothing',
        brand: 'DenimCo',
        image: 'https://via.placeholder.com/300x300',
        countInStock: 90,
        rating: 4.3,
        numReviews: 25
      },
      {
        name: 'Programming Book',
        description: 'Comprehensive guide to modern web development with practical examples and best practices.',
        price: 39.99,
        category: 'Books',
        brand: 'TechBooks',
        image: 'https://via.placeholder.com/300x300',
        countInStock: 55,
        rating: 4.8,
        numReviews: 30
      },
      {
        name: 'Fiction Novel',
        description: 'Bestselling fiction novel with compelling characters and engaging storyline.',
        price: 24.99,
        category: 'Books',
        brand: 'StoryPress',
        image: 'https://via.placeholder.com/300x300',
        countInStock: 70,
        rating: 4.4,
        numReviews: 22
      },
      {
        name: 'Board Game',
        description: 'Strategic board game for family game nights with beautiful artwork and engaging gameplay.',
        price: 34.99,
        category: 'Toys',
        brand: 'GameMasters',
        image: 'https://via.placeholder.com/300x300',
        countInStock: 45,
        rating: 4.7,
        numReviews: 16
      }
    ];

    await Product.insertMany(products);
    console.log('Products seeded successfully!');
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};

const seedAdmin = async () => {
  try {
    // Clear existing admin user
    await User.deleteOne({ email: 'admin@shophub.com' });
    
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const admin = new User({
      name: 'Admin User',
      email: 'admin@shophub.com',
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();
    console.log('Admin user created successfully!');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');

    await seedProducts();
    await seedAdmin();

    console.log('Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
