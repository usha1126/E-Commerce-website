# 🛒 Real-Time E-Commerce Application

A fully functional real-time e-commerce application built with the MERN stack and enhanced with Socket.IO for live features.

## ✨ Features

### 🛍️ Core E-Commerce Features
- **Product Catalog**: Browse and search products with filtering and sorting
- **User Authentication**: Secure registration and login with JWT
- **Shopping Cart**: Add, update, and remove items with real-time sync
- **Wishlist**: Save favorite products for later
- **Product Search**: Real-time search with debouncing
- **Category Filtering**: Filter products by category
- **Sorting Options**: Sort by price, name, rating, and date

### 🚀 Real-Time Features
- **Live User Presence**: See how many users are online
- **Real-Time Cart Updates**: Cart changes sync across multiple tabs
- **Live Activity Dashboard**: Shows recent cart activity and search trends
- **Real-Time Notifications**: Browser notifications for important events
- **Cross-Tab Synchronization**: Seamless experience across browser tabs
- **Live Search Trends**: See what others are searching for

### 🎨 User Experience
- **Responsive Design**: Works perfectly on all devices
- **Modern UI**: Clean and intuitive interface with Tailwind CSS
- **Smooth Animations**: Micro-interactions and transitions
- **Error Handling**: Graceful error messages and fallbacks
- **Loading States**: Proper loading indicators throughout

## 🛠️ Technical Stack

### Frontend
- **React 18**: Modern React with hooks
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **Socket.IO Client**: Real-time WebSocket client
- **React Icons**: Beautiful icon library

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **Socket.IO**: Real-time WebSocket server
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing
- **File-based Database**: Simple JSON file storage

### Real-Time Infrastructure
- **WebSocket Connections**: Bidirectional real-time communication
- **Event-Driven Architecture**: Scalable event handling
- **Cross-Tab Communication**: Browser events for tab sync
- **Graceful Fallbacks**: Works without real-time server

## 📁 Project Structure

```
E-commerce-web-application/
├── client/                     # React frontend
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── context/          # React context providers
│   │   ├── pages/            # Page components
│   │   ├── App.js            # Main app component
│   │   └── index.js          # App entry point
│   ├── package.json          # Frontend dependencies
│   └── tailwind.config.js    # Tailwind configuration
├── data/                      # Database files
│   ├── products.json         # Product data
│   ├── users.json           # User data
│   └── orders.json          # Order data
├── middleware/               # Express middleware
├── models/                   # Data models
├── routes/                   # API routes
├── database.js               # File-based database
├── server.js                 # Main server
├── server-socket.js          # Real-time server
└── package.json              # Backend dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/usha1126/E-Commerce-website.git
   cd E-Commerce-website
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_jwt_secret_key_here_change_in_production
   JWT_EXPIRE=7d
   ```

5. **Start MongoDB**
   Make sure MongoDB is running on your system.

6. **Seed the database**
   ```bash
   node seed.js
   ```
   This will create sample products and an admin user:
   - Email: admin@shophub.com
   - Password: admin123

7. **Start the development servers**

   **Backend:**
   ```bash
   npm run dev
   ```
   The backend server will run on `http://localhost:5000`

   **Frontend:**
   ```bash
   cd client
   npm start
   ```
   The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filtering and pagination)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)
- `POST /api/products/:id/reviews` - Add product review

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/myorders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders` - Get all orders (Admin only)
- `PUT /api/orders/:id/pay` - Update order to paid
- `PUT /api/orders/:id/status` - Update order status (Admin only)

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID (Admin only)
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Change password
- `PUT /api/users/:id/role` - Update user role (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

### Cart
- `GET /api/users/cart` - Get user's cart
- `POST /api/users/cart` - Add item to cart
- `PUT /api/users/cart/:itemId` - Update cart item
- `DELETE /api/users/cart` - Clear cart

## Usage

### For Users
1. Register for an account or login as a guest
2. Browse products by category or search for specific items
3. Add products to cart
4. Proceed to checkout
5. Track orders in your profile

### For Admins
1. Login with admin credentials
2. Access admin dashboard
3. Manage products (add, edit, delete)
4. View and manage orders
5. Manage users

## Project Structure

```
ecommerce-web-application/
├── models/                 # Database models
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   └── Cart.js
├── routes/                 # API routes
│   ├── auth.js
│   ├── products.js
│   ├── orders.js
│   └── users.js
├── middleware/             # Custom middleware
│   └── auth.js
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context
│   │   ├── pages/         # Page components
│   │   └── App.js
│   └── public/
├── server.js              # Express server
├── seed.js                # Database seed script
├── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Commit your changes
5. Push to the branch
6. Create a Pull Request

## License

This project is licensed under the ISC License.

## Future Enhancements

- Payment gateway integration (Stripe, PayPal)
- Product image upload
- Advanced search functionality
- Wishlist feature
- Product recommendations
- Order history with filters
- Email notifications
- Analytics dashboard
- Multi-language support
- Mobile app development
