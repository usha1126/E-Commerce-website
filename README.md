# E-Commerce Web Application

A full-stack e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

### User Features
- User registration and login
- Product catalog with search and filtering
- Shopping cart functionality
- Order placement and tracking
- User profile management

### Admin Features
- Admin dashboard
- Product management (CRUD operations)
- Order management
- User management
- Role-based access control

### Technical Features
- JWT authentication
- Role-based authorization
- RESTful API design
- Responsive UI with Tailwind CSS
- Real-time cart updates
- Product reviews and ratings

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Express Validator for input validation

### Frontend
- React
- React Router for navigation
- Axios for API requests
- Heroicons for icons
- Tailwind CSS for styling

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-web-application
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
