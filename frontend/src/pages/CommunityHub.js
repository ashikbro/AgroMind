import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Award, 
  MapPin, 
  Clock, 
  Heart, 
  Share2, 
  BookOpen, 
  ShoppingBag,
  Lightbulb,
  Calendar,
  Camera,
  Video,
  FileText,
  Star,
  Filter,
  Search,
  Bell,
  ShoppingCart,
  UserCheck,
  Zap,
  Target
} from 'lucide-react';

// Import our social feature components
import FarmersMarketplace from './FarmersMarketplace';
import FarmerGroups from './FarmerGroups';
import LiveChat from './LiveChat';

const CommunityHub = () => {
  const [activeView, setActiveView] = useState('hub'); // 'hub', 'marketplace', 'groups', 'chat'
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [marketplace, setMarketplace] = useState([]);
  const [events, setEvents] = useState([]);
  const [newPost, setNewPost] = useState({ content: '', type: 'text', images: [] });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = async () => {
    // Mock data - replace with actual API calls
    setPosts(mockPosts);
    setCommunities(mockCommunities);
    setFarmers(mockFarmers);
    setMarketplace(mockMarketplace);
    setEvents(mockEvents);
  };

  // Render different views based on activeView
  if (activeView === 'marketplace') {
    return <FarmersMarketplace onBack={() => setActiveView('hub')} />;
  }

  if (activeView === 'groups') {
    return <FarmerGroups onBack={() => setActiveView('hub')} />;
  }

  if (activeView === 'chat') {
    return <LiveChat onBack={() => setActiveView('hub')} />;
  }

  const handleCreatePost = async () => {
    if (!newPost.content.trim()) return;

    const post = {
      id: Date.now(),
      author: {
        name: 'John Farmer',
        avatar: '/api/placeholder/40/40',
        location: 'Punjab, India',
        verified: true
      },
      content: newPost.content,
      type: newPost.type,
      images: newPost.images,
      timestamp: new Date(),
      likes: 0,
      comments: 0,
      shares: 0,
      category: 'general'
    };

    setPosts([post, ...posts]);
    setNewPost({ content: '', type: 'text', images: [] });
  };

  const handleLikePost = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1, isLiked: !post.isLiked }
        : post
    ));
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || post.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const tabs = [
    { id: 'feed', label: 'Community Feed', icon: MessageSquare },
    { id: 'farmers', label: 'Farmers Network', icon: Users },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen }
  ];

  const categories = [
    { id: 'all', label: 'All Posts' },
    { id: 'tips', label: 'Farming Tips' },
    { id: 'equipment', label: 'Equipment' },
    { id: 'crops', label: 'Crops' },
    { id: 'weather', label: 'Weather' },
    { id: 'market', label: 'Market Updates' },
    { id: 'success', label: 'Success Stories' }
  ];

  const postTypes = [
    { id: 'text', label: 'Text Post', icon: FileText },
    { id: 'photo', label: 'Photo', icon: Camera },
    { id: 'video', label: 'Video', icon: Video },
    { id: 'tip', label: 'Farming Tip', icon: Lightbulb }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          {/* Social Platform Navigation */}
          <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                🌾 AgroMind Social Platform
              </h2>
              <p className="text-gray-600 text-sm">
                Complete social networking ecosystem for farmers
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveView('marketplace')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <ShoppingCart size={18} />
                <span>Marketplace</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveView('groups')}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <Users size={18} />
                <span>Groups & Forums</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveView('chat')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <MessageSquare size={18} />
                <span>Live Chat</span>
              </motion.button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Community Hub
              </h1>
              <p className="text-gray-600">
                Connect, share, and grow with farmers worldwide
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Create Post
              </motion.button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 mt-6 bg-gray-100 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <tab.icon size={18} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === 'feed' && (
                <motion.div
                  key="feed"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {/* Create Post */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <img
                        src="/api/placeholder/50/50"
                        alt="Your Avatar"
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <textarea
                          value={newPost.content}
                          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                          placeholder="Share your farming experience, tips, or ask questions..."
                          className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          rows="3"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        {postTypes.map((type) => (
                          <button
                            key={type.id}
                            onClick={() => setNewPost({ ...newPost, type: type.id })}
                            className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                              newPost.type === type.id
                                ? 'bg-green-100 text-green-600'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            <type.icon size={16} />
                            <span className="text-sm">{type.label}</span>
                          </button>
                        ))}
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCreatePost}
                        disabled={!newPost.content.trim()}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Share
                      </motion.button>
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="bg-white rounded-xl shadow-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search posts..."
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>
                        <Filter className="text-gray-400" size={20} />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setFilterCategory(category.id)}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            filterCategory === category.id
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {category.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Posts Feed */}
                  <div className="space-y-6">
                    {filteredPosts.map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        onLike={() => handleLikePost(post.id)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'farmers' && (
                <FarmersNetwork farmers={farmers} />
              )}

              {activeTab === 'marketplace' && (
                <Marketplace items={marketplace} />
              )}

              {activeTab === 'events' && (
                <EventsSection events={events} />
              )}

              {activeTab === 'knowledge' && (
                <KnowledgeBase />
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Topics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <TrendingUp className="mr-2 text-orange-500" size={20} />
                Trending Topics
              </h3>
              <div className="space-y-3">
                {mockTrendingTopics.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">#{topic.name}</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{topic.posts}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Top Contributors */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Award className="mr-2 text-yellow-500" size={20} />
                Top Contributors
              </h3>
              <div className="space-y-3">
                {mockTopContributors.map((contributor, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <img
                      src={contributor.avatar}
                      alt={contributor.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{contributor.name}</p>
                      <p className="text-xs text-gray-500">{contributor.contributions} contributions</p>
                    </div>
                    <Star className="text-yellow-500" size={16} />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Suggested Communities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Users className="mr-2 text-blue-500" size={20} />
                Suggested Communities
              </h3>
              <div className="space-y-3">
                {communities.slice(0, 3).map((community) => (
                  <div key={community.id} className="border border-gray-100 rounded-lg p-3">
                    <h4 className="font-semibold text-sm">{community.name}</h4>
                    <p className="text-xs text-gray-500 mb-2">{community.members} members</p>
                    <button className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full hover:bg-green-200 transition-colors">
                      Join
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Post Card Component
const PostCard = ({ post, onLike }) => {
  const [showComments, setShowComments] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      {/* Post Header */}
      <div className="flex items-center space-x-3 mb-4">
        <img
          src={post.author.avatar}
          alt={post.author.name}
          className="w-12 h-12 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h4 className="font-semibold">{post.author.name}</h4>
            {post.author.verified && (
              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </div>
          <div className="flex items-center text-sm text-gray-500 space-x-2">
            <MapPin size={14} />
            <span>{post.author.location}</span>
            <span>•</span>
            <Clock size={14} />
            <span>{new Date(post.timestamp).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-gray-800 mb-3">{post.content}</p>
        {post.images && post.images.length > 0 && (
          <div className="grid grid-cols-2 gap-2 rounded-lg overflow-hidden">
            {post.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt="Post content"
                className="w-full h-48 object-cover"
              />
            ))}
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center space-x-6">
          <button
            onClick={onLike}
            className={`flex items-center space-x-2 ${
              post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
            } transition-colors`}
          >
            <Heart size={20} fill={post.isLiked ? 'currentColor' : 'none'} />
            <span>{post.likes}</span>
          </button>
          
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
          >
            <MessageSquare size={20} />
            <span>{post.comments}</span>
          </button>
          
          <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
            <Share2 size={20} />
            <span>{post.shares}</span>
          </button>
        </div>
        
        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
          #{post.category}
        </span>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t mt-4 pt-4"
          >
            <div className="space-y-3">
              <div className="flex space-x-3">
                <img
                  src="/api/placeholder/32/32"
                  alt="Commenter"
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Additional Components (simplified versions)
const FarmersNetwork = ({ farmers }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {farmers.map((farmer) => (
      <motion.div
        key={farmer.id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-lg p-6 text-center"
      >
        <img
          src={farmer.avatar}
          alt={farmer.name}
          className="w-20 h-20 rounded-full mx-auto mb-4"
        />
        <h3 className="font-bold text-lg">{farmer.name}</h3>
        <p className="text-gray-600 mb-2">{farmer.location}</p>
        <p className="text-sm text-gray-500 mb-4">{farmer.specialization}</p>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
          Connect
        </button>
      </motion.div>
    ))}
  </div>
);

const Marketplace = ({ items }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {items.map((item) => (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2">{item.name}</h3>
          <p className="text-gray-600 mb-3">{item.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-green-600">${item.price}</span>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Buy Now
            </button>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

const EventsSection = ({ events }) => (
  <div className="space-y-6">
    {events.map((event) => (
      <motion.div
        key={event.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-start space-x-4">
          <div className="bg-green-100 p-3 rounded-lg">
            <Calendar className="text-green-600" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2">{event.title}</h3>
            <p className="text-gray-600 mb-3">{event.description}</p>
            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <span>📅 {new Date(event.date).toLocaleDateString()}</span>
              <span>📍 {event.location}</span>
              <span>👥 {event.attendees} attending</span>
            </div>
          </div>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            Join Event
          </button>
        </div>
      </motion.div>
    ))}
  </div>
);

const KnowledgeBase = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {mockKnowledgeBase.map((article) => (
      <motion.div
        key={article.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-start space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <BookOpen className="text-blue-600" size={20} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2">{article.title}</h3>
            <p className="text-gray-600 mb-3">{article.excerpt}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{article.readTime} min read</span>
              <button className="text-blue-600 hover:text-blue-700 font-semibold">
                Read More →
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

// Mock Data
const mockPosts = [
  {
    id: 1,
    author: {
      name: 'Priya Patel',
      avatar: '/api/placeholder/40/40',
      location: 'Gujarat, India',
      verified: true
    },
    content: 'Just harvested my organic tomatoes! 🍅 The yield this season exceeded expectations by 30%. Here are some tips that helped me achieve this...',
    type: 'photo',
    images: ['/api/placeholder/300/200', '/api/placeholder/300/200'],
    timestamp: new Date('2025-07-28'),
    likes: 45,
    comments: 12,
    shares: 8,
    category: 'success',
    isLiked: false
  },
  {
    id: 2,
    author: {
      name: 'Rajesh Kumar',
      avatar: '/api/placeholder/40/40',
      location: 'Punjab, India',
      verified: false
    },
    content: 'Weather alert: Heavy rains expected in the next 48 hours. Make sure to protect your crops and check drainage systems. Stay safe everyone! 🌧️',
    type: 'text',
    timestamp: new Date('2025-07-29'),
    likes: 78,
    comments: 23,
    shares: 34,
    category: 'weather',
    isLiked: true
  }
];

const mockFarmers = [
  {
    id: 1,
    name: 'Amit Singh',
    avatar: '/api/placeholder/80/80',
    location: 'Maharashtra, India',
    specialization: 'Organic Farming',
    followers: 1250,
    following: 890
  },
  {
    id: 2,
    name: 'Sunita Devi',
    avatar: '/api/placeholder/80/80',
    location: 'Haryana, India',
    specialization: 'Dairy Farming',
    followers: 980,
    following: 654
  }
];

const mockMarketplace = [
  {
    id: 1,
    name: 'Premium Wheat Seeds',
    description: 'High-yield drought-resistant wheat variety',
    price: 45,
    image: '/api/placeholder/200/150',
    seller: 'AgriSeeds Ltd.',
    rating: 4.8
  },
  {
    id: 2,
    name: 'Organic Fertilizer',
    description: 'Natural compost for healthy soil',
    price: 25,
    image: '/api/placeholder/200/150',
    seller: 'GreenGrow Co.',
    rating: 4.6
  }
];

const mockEvents = [
  {
    id: 1,
    title: 'Sustainable Farming Workshop',
    description: 'Learn modern techniques for eco-friendly agriculture',
    date: '2025-08-15',
    location: 'Delhi Agriculture Center',
    attendees: 156,
    type: 'workshop'
  },
  {
    id: 2,
    title: 'Crop Insurance Seminar',
    description: 'Understanding government schemes and insurance options',
    date: '2025-08-20',
    location: 'Virtual Event',
    attendees: 298,
    type: 'seminar'
  }
];

const mockCommunities = [
  {
    id: 1,
    name: 'Organic Farmers India',
    members: 12500,
    description: 'Community for organic farming enthusiasts'
  },
  {
    id: 2,
    name: 'Dairy Farmers Network',
    members: 8900,
    description: 'Connect with dairy farmers across the country'
  }
];

const mockTrendingTopics = [
  { name: 'DroughtResistant', posts: '234 posts' },
  { name: 'OrganicFarming', posts: '189 posts' },
  { name: 'SmartIrrigation', posts: '156 posts' },
  { name: 'CropInsurance', posts: '98 posts' }
];

const mockTopContributors = [
  {
    name: 'Dr. Ramesh Gupta',
    avatar: '/api/placeholder/40/40',
    contributions: 145
  },
  {
    name: 'Meera Sharma',
    avatar: '/api/placeholder/40/40',
    contributions: 132
  },
  {
    name: 'Vikram Joshi',
    avatar: '/api/placeholder/40/40',
    contributions: 98
  }
];

const mockKnowledgeBase = [
  {
    id: 1,
    title: 'Soil Health Management',
    excerpt: 'Essential practices for maintaining fertile soil',
    readTime: 8,
    category: 'soil'
  },
  {
    id: 2,
    title: 'Pest Control Strategies',
    excerpt: 'Integrated pest management for sustainable farming',
    readTime: 12,
    category: 'pest'
  }
];

export default CommunityHub;
