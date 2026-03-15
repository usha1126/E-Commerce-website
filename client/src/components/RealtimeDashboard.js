import React from 'react';
import { useRealtime } from '../context/RealtimeContextSimple';
import { FaUsers, FaShoppingCart, FaSearch, FaBell, FaWifi, FaSignal } from 'react-icons/fa';

const RealtimeDashboard = () => {
  const { isConnected, connectedUsers, cartActivity, searchTrends, notifications } = useRealtime();

  if (!isConnected) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50">
        <div className="flex items-center">
          <FaSignal className="h-4 w-4 mr-2" />
          <span className="text-sm">Connecting to real-time server...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 max-w-sm">
      {/* Connection Status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center text-green-600">
          <FaWifi className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Live</span>
        </div>
        <div className="flex items-center text-gray-600">
          <FaUsers className="h-4 w-4 mr-1" />
          <span className="text-sm">{connectedUsers} online</span>
        </div>
      </div>

      {/* Cart Activity */}
      {cartActivity.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center text-gray-700 mb-2">
            <FaShoppingCart className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Recent Activity</span>
          </div>
          <div className="space-y-1">
            {cartActivity.slice(0, 3).map((activity, index) => (
              <div key={index} className="text-xs text-gray-600 truncate">
                {activity.action}: {activity.product || 'Item'} ({activity.itemCount} items)
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Trends */}
      {searchTrends.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center text-gray-700 mb-2">
            <FaSearch className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Trending Searches</span>
          </div>
          <div className="space-y-1">
            {searchTrends.slice(0, 2).map((trend, index) => (
              <div key={index} className="text-xs text-gray-600 truncate">
                "{trend.query}" ({trend.resultsCount} results)
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-700">
            <FaBell className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">{notifications.length} notifications</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealtimeDashboard;
