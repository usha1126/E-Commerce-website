import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaHeart, FaShoppingCart, FaStar } from 'react-icons/fa';

const ProductCard = ({ product, onClick }) => {
  const { addToCart } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(product, 1);
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Get current wishlist from localStorage
    const currentWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    // Check if product is already in wishlist
    if (!currentWishlist.find(item => item._id === product._id)) {
      // Add to wishlist
      const updatedWishlist = [...currentWishlist, product];
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      
      // Show success message (you could use a toast notification here)
      alert('Added to wishlist!');
    } else {
      alert('Already in wishlist!');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`h-4 w-4 ${
            i <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/products/${product._id}`} onClick={onClick}>
        <div className="relative">
          <img
            src={product.image || 'https://via.placeholder.com/300x300'}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          {product.countInStock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {product.name}
          </h3>
          
          <div className="flex items-center mb-2">
            {renderStars(product.rating)}
            <span className="ml-2 text-sm text-gray-600">
              ({product.numReviews})
            </span>
          </div>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-indigo-600">
              ${product.price.toFixed(2)}
            </span>
            
            <div className="flex space-x-2">
              <button
                onClick={handleAddToWishlist}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                title="Add to Wishlist"
              >
                <FaHeart className="h-4 w-4" />
              </button>
              
              <button
                onClick={handleAddToCart}
                disabled={product.countInStock === 0}
                className={`p-2 rounded-md transition-colors ${
                  product.countInStock === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-indigo-600 hover:bg-indigo-100'
                }`}
                title="Add to Cart"
              >
                <FaShoppingCart className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
