// Simple file-based database for demo purposes
const fs = require('fs').promises;
const path = require('path');

class SimpleDatabase {
  constructor() {
    this.dataDir = path.join(__dirname, 'data');
    this.usersFile = path.join(this.dataDir, 'users.json');
    this.productsFile = path.join(this.dataDir, 'products.json');
    this.ordersFile = path.join(this.dataDir, 'orders.json');
    this.init();
  }

  async init() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
      
      // Initialize users file if it doesn't exist
      try {
        await fs.access(this.usersFile);
      } catch {
        await fs.writeFile(this.usersFile, JSON.stringify([]));
      }
      
      // Initialize products file if it doesn't exist
      try {
        await fs.access(this.productsFile);
      } catch {
        const defaultProducts = [
          {
            _id: '1',
            name: 'Laptop Pro',
            description: 'High-performance laptop for professionals',
            price: 1299.99,
            category: 'Electronics',
            image: 'https://via.placeholder.com/300x300',
            countInStock: 10,
            rating: 4.5,
            numReviews: 12,
            createdAt: new Date().toISOString()
          },
          {
            _id: '2',
            name: 'Wireless Headphones',
            description: 'Premium noise-cancelling headphones',
            price: 199.99,
            category: 'Electronics',
            image: 'https://via.placeholder.com/300x300',
            countInStock: 25,
            rating: 4.8,
            numReviews: 8,
            createdAt: new Date().toISOString()
          },
          {
            _id: '3',
            name: 'Smart Watch',
            description: 'Feature-rich smartwatch with health tracking',
            price: 299.99,
            category: 'Electronics',
            image: 'https://via.placeholder.com/300x300',
            countInStock: 15,
            rating: 4.2,
            numReviews: 6,
            createdAt: new Date().toISOString()
          },
          {
            _id: '4',
            name: 'Running Shoes',
            description: 'Comfortable running shoes for athletes',
            price: 89.99,
            category: 'Sports',
            image: 'https://via.placeholder.com/300x300',
            countInStock: 30,
            rating: 4.6,
            numReviews: 15,
            createdAt: new Date().toISOString()
          }
        ];
        await fs.writeFile(this.productsFile, JSON.stringify(defaultProducts));
      }
      
      // Initialize orders file if it doesn't exist
      try {
        await fs.access(this.ordersFile);
      } catch {
        await fs.writeFile(this.ordersFile, JSON.stringify([]));
      }
      
      console.log('Simple database initialized');
    } catch (error) {
      console.error('Database initialization error:', error);
    }
  }

  async readFile(filename) {
    try {
      const data = await fs.readFile(filename, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Read file error:', error);
      return [];
    }
  }

  async writeFile(filename, data) {
    try {
      await fs.writeFile(filename, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error('Write file error:', error);
      return false;
    }
  }

  // User operations
  async findUserByEmail(email) {
    const users = await this.readFile(this.usersFile);
    return users.find(user => user.email === email);
  }

  async findUserById(id) {
    const users = await this.readFile(this.usersFile);
    return users.find(user => user.id === id);
  }

  async createUser(userData) {
    const users = await this.readFile(this.usersFile);
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    await this.writeFile(this.usersFile, users);
    return newUser;
  }

  // Product operations
  async findProducts(filter = {}) {
    let products = await this.readFile(this.productsFile);
    
    if (filter.category) {
      products = products.filter(product => product.category === filter.category);
    }
    
    if (filter.keyword) {
      const keyword = filter.keyword.toLowerCase();
      products = products.filter(product => 
        product.name.toLowerCase().includes(keyword) ||
        product.description.toLowerCase().includes(keyword)
      );
    }
    
    if (filter.limit) {
      products = products.slice(0, filter.limit);
    }
    
    return products;
  }

  async findProductById(id) {
    const products = await this.readFile(this.productsFile);
    return products.find(product => product._id === id);
  }

  // Order operations
  async createOrder(orderData) {
    const orders = await this.readFile(this.ordersFile);
    const newOrder = {
      _id: Date.now().toString(),
      ...orderData,
      createdAt: new Date().toISOString()
    };
    orders.push(newOrder);
    await this.writeFile(this.ordersFile, orders);
    return newOrder;
  }

  async findOrdersByUserId(userId) {
    const orders = await this.readFile(this.ordersFile);
    return orders.filter(order => order.user === userId);
  }
}

module.exports = SimpleDatabase;
