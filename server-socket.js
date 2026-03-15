const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const SimpleDatabase = require('./database');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3002'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Initialize simple database
const db = new SimpleDatabase();

// Make database available to routes
app.use((req, res, next) => {
  req.db = db;
  req.io = io;
  next();
});

// CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3002'],
  credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Real-time connections
const connectedUsers = new Map();
const activeCarts = new Map();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // User joins with their user ID
  socket.on('join', (userData) => {
    connectedUsers.set(socket.id, userData);
    socket.join(`user_${userData.userId}`);
    
    // Broadcast user count
    io.emit('user_count', connectedUsers.size);
    
    console.log(`User ${userData.userId} joined. Total users: ${connectedUsers.size}`);
  });

  // Real-time cart updates
  socket.on('cart_update', (cartData) => {
    const { userId, cartItems, action, product } = cartData;
    
    // Store active cart data
    activeCarts.set(userId, cartItems);
    
    // Broadcast to user's other sessions
    socket.to(`user_${userId}`).emit('cart_sync', cartItems);
    
    // Broadcast cart count to all connected users
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    io.emit('cart_activity', {
      userId,
      itemCount,
      action,
      product: product ? product.name : null,
      timestamp: new Date().toISOString()
    });
    
    console.log(`Cart update for user ${userId}: ${action} - ${itemCount} items`);
  });

  // Real-time product views
  socket.on('product_view', (data) => {
    const { userId, productId, productName } = data;
    
    // Broadcast to all users watching this product
    socket.to(`product_${productId}`).emit('product_viewers', {
      userId,
      timestamp: new Date().toISOString()
    });
    
    socket.join(`product_${productId}`);
    
    console.log(`User ${userId} viewing product: ${productName}`);
  });

  // Real-time search activity
  socket.on('search_activity', (data) => {
    const { userId, query, resultsCount } = data;
    
    // Broadcast search trends
    io.emit('search_trend', {
      userId,
      query,
      resultsCount,
      timestamp: new Date().toISOString()
    });
    
    console.log(`Search activity: ${userId} searched for "${query}"`);
  });

  // Real-time notifications
  socket.on('notification', (data) => {
    const { userId, type, message, title } = data;
    
    // Send notification to specific user
    io.to(`user_${userId}`).emit('new_notification', {
      id: Date.now().toString(),
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false
    });
    
    console.log(`Notification sent to user ${userId}: ${title}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const userData = connectedUsers.get(socket.id);
    if (userData) {
      connectedUsers.delete(socket.id);
      activeCarts.delete(userData.userId);
      
      // Broadcast updated user count
      io.emit('user_count', connectedUsers.size);
      
      console.log(`User ${userData.userId} disconnected. Total users: ${connectedUsers.size}`);
    }
    
    console.log('Client disconnected:', socket.id);
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));

// Add a simple products route
app.get('/api/products', async (req, res) => {
  try {
    const { category, keyword, limit, sort, order } = req.query;
    const filter = {};
    
    if (category) filter.category = category;
    if (keyword) filter.keyword = keyword;
    if (limit) filter.limit = parseInt(limit);
    
    let products = await req.db.findProducts(filter);
    
    // Handle sorting
    if (sort) {
      const sortOrder = order === 'desc' ? -1 : 1;
      products.sort((a, b) => {
        if (sort === 'price') {
          return sortOrder * (a.price - b.price);
        } else if (sort === 'name') {
          return sortOrder * a.name.localeCompare(b.name);
        } else if (sort === 'rating') {
          return sortOrder * (a.rating - b.rating);
        } else {
          // Default sort by createdAt
          return sortOrder * (new Date(a.createdAt) - new Date(b.createdAt));
        }
      });
    }
    
    res.json({ products });
  } catch (err) {
    console.error('Products error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await req.db.findProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error('Product error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Real-time analytics endpoint
app.get('/api/analytics/live', (req, res) => {
  res.json({
    userCount: connectedUsers.size,
    activeCarts: activeCarts.size,
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Real-time server running on port ${PORT}`);
  console.log(`Socket.IO server ready for connections`);
});
