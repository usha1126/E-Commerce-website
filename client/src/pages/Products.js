import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useRealtime } from '../context/RealtimeContextSimple';
import {
  FaSearch,
  FaFilter,
  FaSort,
  FaTimes,
  FaShoppingBag,
  FaSpinner,
} from 'react-icons/fa';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('keyword') || '');
  const { emitSearchActivity } = useRealtime();
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    keyword: searchParams.get('keyword') || '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const categories = [
    'Electronics',
    'Clothing',
    'Books',
    'Home',
    'Sports',
    'Toys',
    'Other',
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Newest First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'name', label: 'Name: A to Z' },
  ];

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    if (filters.keyword) params.set('keyword', filters.keyword);
    setSearchParams(params);
  }, [filters.category, filters.keyword]);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.keyword) params.append('keyword', filters.keyword);
      
      // Handle sorting
      const sortField = filters.sortBy.startsWith('-') ? filters.sortBy.substring(1) : filters.sortBy;
      const sortOrder = filters.sortBy.startsWith('-') ? 'desc' : 'asc';
      params.append('sort', sortField);
      params.append('order', sortOrder);

      console.log('Fetching products with params:', params.toString());
      const res = await axios.get(`/api/products?${params.toString()}`);
      console.log('Products response:', res.data);
      setProducts(res.data.products);
      
      // Emit search activity if there's a keyword
      if (filters.keyword) {
        emitSearchActivity(filters.keyword, res.data.products.length);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to fetch products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters({
      ...filters,
      [filterName]: value,
    });
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      keyword: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    setSearchInput('');
  };

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((value) => {
      handleFilterChange('keyword', value);
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSearch(value);
  };

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 animate-fade-in">
        <FaSpinner className="h-12 w-12 text-indigo-600 animate-rotate" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-64 flex-shrink-0 animate-slide-in">
          <div className="bg-white rounded-xl shadow-lg p-6 card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FaFilter className="h-5 w-5 mr-2 text-indigo-600" />
                Filters
              </h3>
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-indigo-600 transition-colors duration-200"
              >
                <FaTimes className="h-4 w-4" />
              </button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Products
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchInput}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                />
                <FaSearch className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              </div>
              {filters.keyword && (
                <p className="mt-2 text-xs text-gray-500">
                  Searching for: "{filters.keyword}"
                </p>
              )}
            </div>

            {/* Category */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={clearFilters}
              className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <FaTimes className="h-4 w-4" />
              <span>Clear All Filters</span>
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <FaShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-600 mb-2">No products found</h2>
                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
