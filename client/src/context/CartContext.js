import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Create context
const CartContext = createContext();

// Initial state
const initialState = {
  cartItems: [],
  loading: false,
};

// Create reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'CART_LOADED':
      return {
        ...state,
        cartItems: action.payload.cartItems,
        loading: false,
      };
    case 'ADD_TO_CART':
      return {
        ...state,
        cartItems: action.payload.cartItems,
      };
    case 'UPDATE_CART':
      return {
        ...state,
        cartItems: action.payload.cartItems,
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartItems: action.payload.cartItems,
      };
    case 'CLEAR_CART':
      return {
        ...state,
        cartItems: [],
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

// Create provider
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage
  const loadCart = () => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const cartItems = JSON.parse(savedCart);
        dispatch({
          type: 'CART_LOADED',
          payload: { cartItems },
        });
      } else {
        dispatch({
          type: 'CART_LOADED',
          payload: { cartItems: [] },
        });
      }
    } catch (err) {
      console.error('Error loading cart:', err);
      dispatch({
        type: 'CART_LOADED',
        payload: { cartItems: [] },
      });
    }
  };

  // Save cart to localStorage
  const saveCart = (cartItems) => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (err) {
      console.error('Error saving cart:', err);
    }
  };

  // Add to cart
  const addToCart = async (product, quantity = 1) => {
    try {
      const existingCart = [...state.cartItems];
      const existingItemIndex = existingCart.findIndex(item => item._id === product._id);

      if (existingItemIndex > -1) {
        // Update existing item
        existingCart[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        existingCart.push({
          ...product,
          quantity,
        });
      }

      dispatch({
        type: 'ADD_TO_CART',
        payload: { cartItems: existingCart },
      });

      saveCart(existingCart);
      
      // Emit real-time update if available
      try {
        const event = new CustomEvent('cart_update', { 
          detail: { cartItems: existingCart, action: 'add_to_cart', product } 
        });
        window.dispatchEvent(event);
      } catch (err) {
        // Silently ignore if real-time is not available
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      throw err;
    }
  };

  // Update cart item
  const updateCartItem = async (productId, quantity) => {
    try {
      const existingCart = [...state.cartItems];
      const itemIndex = existingCart.findIndex(item => item._id === productId);

      if (itemIndex > -1) {
        if (quantity <= 0) {
          existingCart.splice(itemIndex, 1);
        } else {
          existingCart[itemIndex].quantity = quantity;
        }
      }

      dispatch({
        type: 'UPDATE_CART',
        payload: { cartItems: existingCart },
      });

      saveCart(existingCart);
      
      // Emit real-time update if available
      try {
        const product = existingCart.find(item => item._id === productId);
        const event = new CustomEvent('cart_update', { 
          detail: { cartItems: existingCart, action: quantity > 0 ? 'update_quantity' : 'remove_from_cart', product } 
        });
        window.dispatchEvent(event);
      } catch (err) {
        // Silently ignore if real-time is not available
      }
    } catch (err) {
      console.error('Error updating cart:', err);
      throw err;
    }
  };

  // Remove from cart
  const removeFromCart = async (productId) => {
    try {
      const existingCart = [...state.cartItems];
      const updatedCart = existingCart.filter(item => item._id !== productId);
      const product = existingCart.find(item => item._id === productId);

      dispatch({
        type: 'REMOVE_FROM_CART',
        payload: { cartItems: updatedCart },
      });

      saveCart(updatedCart);
      
      // Emit real-time update if available
      try {
        const event = new CustomEvent('cart_update', { 
          detail: { cartItems: updatedCart, action: 'remove_from_cart', product } 
        });
        window.dispatchEvent(event);
      } catch (err) {
        // Silently ignore if real-time is not available
      }
    } catch (err) {
      console.error('Error removing from cart:', err);
      throw err;
    }
  };

  // Clear cart
  const clearCart = () => {
    dispatch({
      type: 'CLEAR_CART',
    });
    localStorage.removeItem('cart');
  };

  // Get cart total
  const getCartTotal = () => {
    return state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Get cart items count
  const getCartItemsCount = () => {
    return state.cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
