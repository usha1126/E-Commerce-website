import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { RealtimeProvider } from './context/RealtimeContextSimple';
import Navbar from './components/Navbar';
import RealtimeDashboard from './components/RealtimeDashboard';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Register from './pages/Register';
import axios from 'axios';

// Set base URL for API requests
axios.defaults.baseURL = 'http://localhost:5000';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RealtimeProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<div>Product Detail - Coming Soon</div>} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/checkout" element={<div>Checkout - Coming Soon</div>} />
                <Route path="/profile" element={<div>Profile - Coming Soon</div>} />
                <Route path="/admin" element={<div>Admin Dashboard - Coming Soon</div>} />
                <Route path="/orders" element={<div>Orders - Coming Soon</div>} />
                <Route path="*" element={<div>404 - Page Not Found</div>} />
              </Routes>
              <RealtimeDashboard />
            </div>
          </Router>
        </RealtimeProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
