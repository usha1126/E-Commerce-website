import React, { createContext, useContext, useEffect, useState } from 'react';

const RealtimeContext = createContext();

export const RealtimeProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [cartActivity, setCartActivity] = useState([]);
  const [searchTrends, setSearchTrends] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Try to connect to Socket.IO server
    let newSocket = null;
    
    try {
      // Dynamic import to avoid errors if socket.io-client is not available
      import('socket.io-client').then(({ io }) => {
        newSocket = io('http://localhost:5000', {
          autoConnect: true,
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionAttempts: 5,
          maxReconnectionAttempts: 5,
        });

        newSocket.on('connect', () => {
          console.log('Connected to real-time server');
          setIsConnected(true);
          
          // Join with user data (if authenticated)
          const userData = localStorage.getItem('user');
          if (userData) {
            const user = JSON.parse(userData);
            newSocket.emit('join', { 
              userId: user.id || 'guest', 
              name: user.name || 'Guest User' 
            });
          } else {
            newSocket.emit('join', { 
              userId: 'guest', 
              name: 'Guest User' 
            });
          }
        });

        newSocket.on('disconnect', () => {
          console.log('Disconnected from real-time server');
          setIsConnected(false);
        });

        // Listen for real-time events
        newSocket.on('user_count', (count) => {
          setConnectedUsers(count);
        });

        newSocket.on('cart_activity', (activity) => {
          setCartActivity(prev => [activity, ...prev.slice(0, 9)]);
        });

        newSocket.on('search_trend', (trend) => {
          setSearchTrends(prev => [trend, ...prev.slice(0, 4)]);
        });

        newSocket.on('new_notification', (notification) => {
          setNotifications(prev => [notification, ...prev.slice(0, 9)]);
          
          // Show browser notification if permission granted
          if (Notification.permission === 'granted') {
            new Notification(notification.title, {
              body: notification.message,
              icon: '/favicon.ico'
            });
          }
        });

        setSocket(newSocket);
      }).catch(err => {
        console.log('Socket.IO not available, running in offline mode');
        setIsConnected(false);
      });
    } catch (err) {
      console.log('Socket.IO not available, running in offline mode');
      setIsConnected(false);
    }

    // Listen for cart events from CartContext
    const handleCartUpdate = (event) => {
      const { cartItems, action, product } = event.detail;
      if (newSocket) {
        const userData = localStorage.getItem('user');
        const user = userData ? JSON.parse(userData) : { id: 'guest' };
        
        newSocket.emit('cart_update', {
          userId: user.id,
          cartItems,
          action,
          product
        });
      }
    };

    window.addEventListener('cart_update', handleCartUpdate);

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      window.removeEventListener('cart_update', handleCartUpdate);
      if (newSocket) {
        newSocket.close();
      }
    };
  }, []);

  // Real-time functions
  const emitCartUpdate = (cartItems, action, product) => {
    if (socket) {
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : { id: 'guest' };
      
      socket.emit('cart_update', {
        userId: user.id,
        cartItems,
        action,
        product
      });
    }
  };

  const emitProductView = (productId, productName) => {
    if (socket) {
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : { id: 'guest' };
      
      socket.emit('product_view', {
        userId: user.id,
        productId,
        productName
      });
    }
  };

  const emitSearchActivity = (query, resultsCount) => {
    if (socket) {
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : { id: 'guest' };
      
      socket.emit('search_activity', {
        userId: user.id,
        query,
        resultsCount
      });
    }
  };

  const sendNotification = (userId, type, title, message) => {
    if (socket) {
      socket.emit('notification', {
        userId,
        type,
        title,
        message
      });
    }
  };

  const markNotificationRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <RealtimeContext.Provider
      value={{
        socket,
        isConnected,
        connectedUsers,
        notifications,
        cartActivity,
        searchTrends,
        emitCartUpdate,
        emitProductView,
        emitSearchActivity,
        sendNotification,
        markNotificationRead,
        clearNotifications,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};
