import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  ShoppingCart, 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Heart, 
  MessageSquare, 
  Truck, 
  Shield, 
  CreditCard,
  Package,
  Users,
  TrendingUp,
  Tag,
  Grid,
  List,
  Plus,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Camera,
  Upload
} from 'lucide-react';

const FarmersMarketplace = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    quantity: '',
    images: [],
    location: ''
  });

  useEffect(() => {
    loadMarketplaceData();
  }, []);

  const loadMarketplaceData = async () => {
    // Mock data - replace with actual API calls
    setProducts(mockProducts);
  };

  const categories = [
    { id: 'all', label: 'All Products', icon: '🛒' },
    { id: 'seeds', label: 'Seeds & Saplings', icon: '🌱' },
    { id: 'equipment', label: 'Farm Equipment', icon: '🚜' },
    { id: 'fertilizers', label: 'Fertilizers', icon: '🧪' },
    { id: 'crops', label: 'Fresh Crops', icon: '🌾' },
    { id: 'livestock', label: 'Livestock', icon: '🐄' },
    { id: 'tools', label: 'Hand Tools', icon: '🔨' },
    { id: 'irrigation', label: 'Irrigation', icon: '💧' },
    { id: 'pesticides', label: 'Pesticides', icon: '🛡️' }
  ];

  const sortOptions = [
    { id: 'newest', label: 'Newest First' },
    { id: 'price_low', label: 'Price: Low to High' },
    { id: 'price_high', label: 'Price: High to Low' },
    { id: 'rating', label: 'Highest Rated' },
    { id: 'popular', label: 'Most Popular' }
  ];

  const filteredProducts = products
    .filter(product => {
      const matchesCategory = category === 'all' || product.category === category;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesCategory && matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return a.price - b.price;
        case 'price_high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'popular':
          return b.sales - a.sales;
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const addToCart = (product) => {
    setCart([...cart, { ...product, cartId: Date.now() }]);
  };

  const addToWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) return;

    const product = {
      id: Date.now(),
      ...newProduct,
      seller: {
        name: 'John Farmer',
        avatar: '/api/placeholder/40/40',
        rating: 4.8,
        verified: true
      },
      rating: 0,
      reviews: 0,
      sales: 0,
      createdAt: new Date()
    };

    setProducts([product, ...products]);
    setNewProduct({
      name: '',
      description: '',
      price: '',
      category: '',
      quantity: '',
      images: [],
      location: ''
    });
    setShowAddProduct(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Farmers Marketplace
              </h1>
              <p className="text-gray-600">
                Buy and sell agricultural products directly with farmers
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <ShoppingCart className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddProduct(true)}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Sell Product</span>
              </motion.button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, equipment, seeds..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  category === cat.id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span className="text-sm font-medium">{cat.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Filter className="mr-2 text-blue-500" size={20} />
                Filters
              </h3>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Price Range</h4>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>$0</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Sort By</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Location</h4>
                <input
                  type="text"
                  placeholder="Enter city or state"
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Seller Rating */}
              <div>
                <h4 className="font-semibold mb-3">Seller Rating</h4>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <div className="flex items-center">
                        {[...Array(rating)].map((_, i) => (
                          <Star key={i} size={16} className="text-yellow-500 fill-current" />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">& Up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Featured Sellers */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Users className="mr-2 text-green-500" size={20} />
                Featured Sellers
              </h3>
              <div className="space-y-3">
                {mockFeaturedSellers.map((seller) => (
                  <div key={seller.id} className="flex items-center space-x-3">
                    <img
                      src={seller.avatar}
                      alt={seller.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{seller.name}</p>
                      <div className="flex items-center space-x-1">
                        <Star size={12} className="text-yellow-500 fill-current" />
                        <span className="text-xs text-gray-500">{seller.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* View Toggle and Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing {filteredProducts.length} products
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${
                    viewMode === 'grid' ? 'bg-green-100 text-green-600' : 'text-gray-600'
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${
                    viewMode === 'list' ? 'bg-green-100 text-green-600' : 'text-gray-600'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>

            {/* Products Grid/List */}
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
              : 'space-y-4'
            }>
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode}
                  onAddToCart={() => addToCart(product)}
                  onAddToWishlist={() => addToWishlist(product.id)}
                  isWishlisted={wishlist.includes(product.id)}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Add Product Modal */}
        <AnimatePresence>
          {showAddProduct && (
            <AddProductModal
              newProduct={newProduct}
              setNewProduct={setNewProduct}
              onAdd={handleAddProduct}
              onClose={() => setShowAddProduct(false)}
              categories={categories}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product, viewMode, onAddToCart, onAddToWishlist, isWishlisted, index }) => {
  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-6"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-24 h-24 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-2">{product.name}</h3>
          <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
          <div className="flex items-center space-x-4 mb-2">
            <div className="flex items-center space-x-1">
              <Star size={16} className="text-yellow-500 fill-current" />
              <span className="text-sm">{product.rating}</span>
              <span className="text-sm text-gray-500">({product.reviews})</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <MapPin size={14} />
              <span>{product.location}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-bold text-green-600">${product.price}</span>
            <span className="text-sm text-gray-500">per {product.unit}</span>
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <button
            onClick={onAddToWishlist}
            className={`p-2 rounded-lg transition-colors ${
              isWishlisted ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
            }`}
          >
            <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={onAddToCart}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow"
    >
      <div className="relative">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={onAddToWishlist}
          className={`absolute top-3 right-3 p-2 rounded-lg transition-colors ${
            isWishlisted ? 'bg-red-100 text-red-600' : 'bg-white text-gray-600 hover:bg-red-100 hover:text-red-600'
          }`}
        >
          <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
        {product.isNew && (
          <span className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
            NEW
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg line-clamp-1">{product.name}</h3>
          <span className="bg-gray-100 px-2 py-1 rounded-lg text-xs text-gray-600">
            {product.quantity} available
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

        <div className="flex items-center space-x-4 mb-3">
          <div className="flex items-center space-x-1">
            <Star size={16} className="text-yellow-500 fill-current" />
            <span className="text-sm">{product.rating}</span>
            <span className="text-sm text-gray-500">({product.reviews})</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Truck size={14} />
            <span>Free shipping</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 mb-4">
          <img
            src={product.seller.avatar}
            alt={product.seller.name}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm text-gray-600">{product.seller.name}</span>
          {product.seller.verified && (
            <CheckCircle size={14} className="text-green-500" />
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-green-600">${product.price}</span>
            <span className="text-sm text-gray-500 ml-1">per {product.unit}</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <MapPin size={14} />
            <span>{product.location}</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={onAddToCart}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Add to Cart
          </button>
          <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            <MessageSquare size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Add Product Modal Component
const AddProductModal = ({ newProduct, setNewProduct, onAdd, onClose, categories }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                rows="3"
                placeholder="Describe your product"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity Available
                </label>
                <input
                  type="number"
                  value={newProduct.quantity}
                  onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select a category</option>
                {categories.filter(cat => cat.id !== 'all').map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={newProduct.location}
                onChange={(e) => setNewProduct({ ...newProduct, location: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="City, State"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                <p className="text-gray-500">Drop images here or click to upload</p>
                <p className="text-sm text-gray-400 mt-1">PNG, JPG up to 10MB</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 mt-6">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={onAdd}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Add Product
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Mock Data
const mockProducts = [
  {
    id: 1,
    name: 'Premium Wheat Seeds - HD-2967',
    description: 'High-yield drought-resistant wheat variety suitable for semi-arid regions. Certified seeds with 95% germination rate.',
    price: 45,
    unit: 'kg',
    category: 'seeds',
    quantity: 100,
    location: 'Punjab, India',
    images: ['/api/placeholder/300/200', '/api/placeholder/300/200'],
    seller: {
      id: 1,
      name: 'AgriSeeds Ltd.',
      avatar: '/api/placeholder/40/40',
      rating: 4.8,
      verified: true
    },
    rating: 4.6,
    reviews: 89,
    sales: 245,
    isNew: true,
    createdAt: '2025-07-28'
  },
  {
    id: 2,
    name: 'Organic NPK Fertilizer',
    description: 'Natural compost-based fertilizer with balanced NPK ratio. Improves soil health and crop yield naturally.',
    price: 25,
    unit: 'bag',
    category: 'fertilizers',
    quantity: 50,
    location: 'Karnataka, India',
    images: ['/api/placeholder/300/200'],
    seller: {
      id: 2,
      name: 'GreenGrow Co.',
      avatar: '/api/placeholder/40/40',
      rating: 4.5,
      verified: true
    },
    rating: 4.4,
    reviews: 156,
    sales: 189,
    isNew: false,
    createdAt: '2025-07-25'
  },
  {
    id: 3,
    name: 'Solar Water Pump System',
    description: 'Complete solar-powered irrigation system with 5HP motor. Eco-friendly solution for sustainable farming.',
    price: 1250,
    unit: 'unit',
    category: 'irrigation',
    quantity: 5,
    location: 'Gujarat, India',
    images: ['/api/placeholder/300/200'],
    seller: {
      id: 3,
      name: 'SolarFarm Tech',
      avatar: '/api/placeholder/40/40',
      rating: 4.9,
      verified: true
    },
    rating: 4.8,
    reviews: 34,
    sales: 67,
    isNew: false,
    createdAt: '2025-07-20'
  },
  {
    id: 4,
    name: 'Fresh Organic Tomatoes',
    description: 'Farm-fresh organic tomatoes harvested this morning. Rich in nutrients and free from pesticides.',
    price: 3,
    unit: 'kg',
    category: 'crops',
    quantity: 200,
    location: 'Maharashtra, India',
    images: ['/api/placeholder/300/200'],
    seller: {
      id: 4,
      name: 'Priya Organic Farm',
      avatar: '/api/placeholder/40/40',
      rating: 4.7,
      verified: true
    },
    rating: 4.9,
    reviews: 203,
    sales: 445,
    isNew: true,
    createdAt: '2025-07-29'
  }
];

const mockFeaturedSellers = [
  {
    id: 1,
    name: 'AgriSeeds Ltd.',
    avatar: '/api/placeholder/40/40',
    rating: 4.8,
    products: 45
  },
  {
    id: 2,
    name: 'GreenGrow Co.',
    avatar: '/api/placeholder/40/40',
    rating: 4.5,
    products: 32
  },
  {
    id: 3,
    name: 'SolarFarm Tech',
    avatar: '/api/placeholder/40/40',
    rating: 4.9,
    products: 18
  }
];

export default FarmersMarketplace;
