import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  MessageCircle, 
  Search, 
  Plus, 
  Filter, 
  Star, 
  Calendar, 
  MapPin, 
  Tag, 
  TrendingUp, 
  Eye, 
  ThumbsUp, 
  Reply, 
  Share, 
  Bookmark,
  MoreHorizontal,
  Hash,
  Clock,
  Bell,
  Settings,
  Crown,
  Shield,
  Award,
  Image,
  FileText,
  Video,
  Mic,
  Send,
  PushPin,
  Flag,
  UserPlus,
  UserMinus
} from 'lucide-react';

const FarmerGroups = () => {
  const [activeTab, setActiveTab] = useState('groups');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groups, setGroups] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    category: '',
    privacy: 'public',
    tags: []
  });
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: '',
    tags: [],
    attachments: []
  });

  useEffect(() => {
    loadGroupsData();
    loadDiscussions();
  }, []);

  const loadGroupsData = async () => {
    setGroups(mockGroups);
  };

  const loadDiscussions = async () => {
    setDiscussions(mockDiscussions);
  };

  const categories = [
    { id: 'all', label: 'All Categories', icon: '🌾' },
    { id: 'crop-management', label: 'Crop Management', icon: '🌱' },
    { id: 'livestock', label: 'Livestock', icon: '🐄' },
    { id: 'technology', label: 'Farm Technology', icon: '🚜' },
    { id: 'business', label: 'Farm Business', icon: '💼' },
    { id: 'sustainability', label: 'Sustainability', icon: '♻️' },
    { id: 'weather', label: 'Weather & Climate', icon: '🌤️' },
    { id: 'marketplace', label: 'Marketplace', icon: '🛒' },
    { id: 'networking', label: 'Networking', icon: '🤝' }
  ];

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || group.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredDiscussions = discussions.filter(discussion => {
    const matchesSearch = discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         discussion.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || discussion.category === filterCategory;
    const matchesGroup = !selectedGroup || discussion.groupId === selectedGroup.id;
    return matchesSearch && matchesCategory && matchesGroup;
  });

  const handleCreateGroup = () => {
    const group = {
      id: Date.now(),
      ...newGroup,
      members: 1,
      posts: 0,
      createdAt: new Date(),
      admin: {
        name: 'John Farmer',
        avatar: '/api/placeholder/40/40'
      }
    };

    setGroups([group, ...groups]);
    setNewGroup({ name: '', description: '', category: '', privacy: 'public', tags: [] });
    setShowCreateGroup(false);
  };

  const handleCreatePost = () => {
    const post = {
      id: Date.now(),
      ...newPost,
      author: {
        name: 'John Farmer',
        avatar: '/api/placeholder/40/40',
        badge: 'Verified Farmer'
      },
      groupId: selectedGroup?.id,
      groupName: selectedGroup?.name,
      createdAt: new Date(),
      likes: 0,
      comments: 0,
      views: 0,
      isPinned: false
    };

    setDiscussions([post, ...discussions]);
    setNewPost({ title: '', content: '', category: '', tags: [], attachments: [] });
    setShowCreatePost(false);
  };

  const joinGroup = (groupId) => {
    setGroups(groups.map(group => 
      group.id === groupId 
        ? { ...group, members: group.members + 1, joined: true }
        : group
    ));
  };

  const leaveGroup = (groupId) => {
    setGroups(groups.map(group => 
      group.id === groupId 
        ? { ...group, members: group.members - 1, joined: false }
        : group
    ));
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
                Farmer Groups & Forums
              </h1>
              <p className="text-gray-600">
                Connect, discuss, and learn with fellow farmers worldwide
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateGroup(true)}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Create Group</span>
              </motion.button>
              {selectedGroup && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCreatePost(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <MessageCircle size={20} />
                  <span>New Post</span>
                </motion.button>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-1 mb-6">
            <button
              onClick={() => {
                setActiveTab('groups');
                setSelectedGroup(null);
              }}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === 'groups'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Groups
            </button>
            <button
              onClick={() => setActiveTab('discussions')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === 'discussions'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Discussions
            </button>
            {selectedGroup && (
              <button
                onClick={() => setActiveTab('group-posts')}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === 'group-posts'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {selectedGroup.name}
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab === 'groups' ? 'Search groups...' : 'Search discussions...'}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setFilterCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  filterCategory === category.id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{category.icon}</span>
                <span className="text-sm font-medium">{category.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* My Groups */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Users className="mr-2 text-green-500" size={20} />
                My Groups
              </h3>
              <div className="space-y-3">
                {groups.filter(g => g.joined).slice(0, 5).map((group) => (
                  <div
                    key={group.id}
                    onClick={() => {
                      setSelectedGroup(group);
                      setActiveTab('group-posts');
                    }}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 font-bold">
                        {group.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm line-clamp-1">{group.name}</p>
                      <p className="text-xs text-gray-500">{group.members} members</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Trending Topics */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <TrendingUp className="mr-2 text-blue-500" size={20} />
                Trending Topics
              </h3>
              <div className="space-y-3">
                {mockTrendingTopics.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Hash size={14} className="text-gray-400" />
                      <span className="text-sm font-medium">{topic.tag}</span>
                    </div>
                    <span className="text-xs text-gray-500">{topic.posts}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Active Members */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Star className="mr-2 text-yellow-500" size={20} />
                Top Contributors
              </h3>
              <div className="space-y-3">
                {mockTopContributors.map((member) => (
                  <div key={member.id} className="flex items-center space-x-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.contributions} posts</p>
                    </div>
                    <Award size={16} className="text-yellow-500" />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'groups' && (
              <GroupsList
                groups={filteredGroups}
                onJoinGroup={joinGroup}
                onLeaveGroup={leaveGroup}
                onSelectGroup={(group) => {
                  setSelectedGroup(group);
                  setActiveTab('group-posts');
                }}
              />
            )}

            {(activeTab === 'discussions' || activeTab === 'group-posts') && (
              <DiscussionsList
                discussions={filteredDiscussions}
                selectedGroup={selectedGroup}
                isGroupView={activeTab === 'group-posts'}
              />
            )}
          </div>
        </div>

        {/* Create Group Modal */}
        <AnimatePresence>
          {showCreateGroup && (
            <CreateGroupModal
              newGroup={newGroup}
              setNewGroup={setNewGroup}
              onCreate={handleCreateGroup}
              onClose={() => setShowCreateGroup(false)}
              categories={categories}
            />
          )}
        </AnimatePresence>

        {/* Create Post Modal */}
        <AnimatePresence>
          {showCreatePost && (
            <CreatePostModal
              newPost={newPost}
              setNewPost={setNewPost}
              onCreate={handleCreatePost}
              onClose={() => setShowCreatePost(false)}
              categories={categories}
              selectedGroup={selectedGroup}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Groups List Component
const GroupsList = ({ groups, onJoinGroup, onLeaveGroup, onSelectGroup }) => {
  return (
    <div className="space-y-6">
      {groups.map((group, index) => (
        <motion.div
          key={group.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {group.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{group.name}</h3>
                <p className="text-gray-600 mb-3 line-clamp-2">{group.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Users size={16} />
                    <span>{group.members} members</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle size={16} />
                    <span>{group.posts} posts</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar size={16} />
                    <span>Created {new Date(group.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {group.privacy === 'private' && (
                <Shield size={16} className="text-yellow-500" />
              )}
              <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                group.privacy === 'public' 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-yellow-100 text-yellow-600'
              }`}>
                {group.privacy}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src={group.admin.avatar}
                alt={group.admin.name}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm text-gray-600">Admin: {group.admin.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onSelectGroup(group)}
                className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors font-semibold"
              >
                View Posts
              </button>
              {group.joined ? (
                <button
                  onClick={() => onLeaveGroup(group.id)}
                  className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors font-semibold flex items-center space-x-1"
                >
                  <UserMinus size={16} />
                  <span>Leave</span>
                </button>
              ) : (
                <button
                  onClick={() => onJoinGroup(group.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center space-x-1"
                >
                  <UserPlus size={16} />
                  <span>Join</span>
                </button>
              )}
            </div>
          </div>

          {group.tags && group.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {group.tags.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

// Discussions List Component
const DiscussionsList = ({ discussions, selectedGroup, isGroupView }) => {
  return (
    <div className="space-y-6">
      {isGroupView && selectedGroup && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {selectedGroup.name.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{selectedGroup.name}</h2>
              <p className="text-gray-600">{selectedGroup.description}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span>{selectedGroup.members} members</span>
                <span>{selectedGroup.posts} posts</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {discussions.map((discussion, index) => (
        <motion.div
          key={discussion.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-start space-x-4">
            <img
              src={discussion.author.avatar}
              alt={discussion.author.name}
              className="w-12 h-12 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-bold text-lg text-gray-800">{discussion.title}</h3>
                {discussion.isPinned && (
                  <PushPin size={16} className="text-green-500" />
                )}
              </div>
              
              <div className="flex items-center space-x-4 mb-3 text-sm text-gray-500">
                <span className="font-semibold text-gray-700">{discussion.author.name}</span>
                {discussion.author.badge && (
                  <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-lg text-xs">
                    {discussion.author.badge}
                  </span>
                )}
                <div className="flex items-center space-x-1">
                  <Clock size={14} />
                  <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
                </div>
                {!isGroupView && discussion.groupName && (
                  <div className="flex items-center space-x-1">
                    <Users size={14} />
                    <span>{discussion.groupName}</span>
                  </div>
                )}
              </div>

              <p className="text-gray-600 mb-4 line-clamp-3">{discussion.content}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <ThumbsUp size={16} />
                    <span>{discussion.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle size={16} />
                    <span>{discussion.comments}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye size={16} />
                    <span>{discussion.views}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="text-gray-500 hover:text-blue-600 transition-colors">
                    <Bookmark size={16} />
                  </button>
                  <button className="text-gray-500 hover:text-green-600 transition-colors">
                    <Share size={16} />
                  </button>
                  <button className="text-gray-500 hover:text-gray-700 transition-colors">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </div>

              {discussion.tags && discussion.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {discussion.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Create Group Modal Component
const CreateGroupModal = ({ newGroup, setNewGroup, onCreate, onClose, categories }) => {
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
            <h2 className="text-2xl font-bold text-gray-800">Create New Group</h2>
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
                Group Name *
              </label>
              <input
                type="text"
                value={newGroup.name}
                onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Enter group name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={newGroup.description}
                onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                rows="3"
                placeholder="Describe your group's purpose"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={newGroup.category}
                onChange={(e) => setNewGroup({ ...newGroup, category: e.target.value })}
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
                Privacy Setting *
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="public"
                    checked={newGroup.privacy === 'public'}
                    onChange={(e) => setNewGroup({ ...newGroup, privacy: e.target.value })}
                    className="text-green-600"
                  />
                  <span>Public - Anyone can join</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="private"
                    checked={newGroup.privacy === 'private'}
                    onChange={(e) => setNewGroup({ ...newGroup, privacy: e.target.value })}
                    className="text-green-600"
                  />
                  <span>Private - Approval required to join</span>
                </label>
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
              onClick={onCreate}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Create Group
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Create Post Modal Component
const CreatePostModal = ({ newPost, setNewPost, onCreate, onClose, categories, selectedGroup }) => {
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
            <h2 className="text-2xl font-bold text-gray-800">
              Create New Post {selectedGroup && `in ${selectedGroup.name}`}
            </h2>
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
                Post Title *
              </label>
              <input
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Enter post title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                rows="6"
                placeholder="What would you like to discuss?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={newPost.category}
                onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
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
                Attachments
              </label>
              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Image size={16} />
                  <span>Image</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <FileText size={16} />
                  <span>Document</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Video size={16} />
                  <span>Video</span>
                </button>
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
              onClick={onCreate}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Create Post
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Mock Data
const mockGroups = [
  {
    id: 1,
    name: 'Organic Farming Community',
    description: 'A community for farmers practicing sustainable and organic farming methods. Share tips, experiences, and learn from fellow organic farmers.',
    category: 'sustainability',
    privacy: 'public',
    members: 1847,
    posts: 523,
    joined: true,
    createdAt: '2025-01-15',
    admin: {
      name: 'Sarah Green',
      avatar: '/api/placeholder/40/40'
    },
    tags: ['organic', 'sustainable', 'eco-friendly']
  },
  {
    id: 2,
    name: 'Smart Farming Technology',
    description: 'Discuss the latest in agricultural technology, IoT devices, drones, and precision farming techniques.',
    category: 'technology',
    privacy: 'public',
    members: 2156,
    posts: 789,
    joined: true,
    createdAt: '2025-01-10',
    admin: {
      name: 'Tech Farmer',
      avatar: '/api/placeholder/40/40'
    },
    tags: ['iot', 'precision-farming', 'automation']
  },
  {
    id: 3,
    name: 'Crop Disease Management',
    description: 'Share knowledge about crop diseases, prevention methods, and treatment strategies.',
    category: 'crop-management',
    privacy: 'public',
    members: 945,
    posts: 234,
    joined: false,
    createdAt: '2025-01-20',
    admin: {
      name: 'Dr. Plant',
      avatar: '/api/placeholder/40/40'
    },
    tags: ['disease', 'prevention', 'treatment']
  }
];

const mockDiscussions = [
  {
    id: 1,
    title: 'Best practices for soil health improvement',
    content: 'I\'ve been struggling with soil degradation on my farm. What are the most effective methods you\'ve used to improve soil health? I\'m particularly interested in cover cropping and composting techniques.',
    category: 'sustainability',
    groupId: 1,
    groupName: 'Organic Farming Community',
    author: {
      name: 'John Farmer',
      avatar: '/api/placeholder/40/40',
      badge: 'Verified Farmer'
    },
    createdAt: '2025-07-29',
    likes: 23,
    comments: 12,
    views: 156,
    isPinned: true,
    tags: ['soil-health', 'composting', 'cover-crops']
  },
  {
    id: 2,
    title: 'IoT sensors for monitoring crop conditions',
    content: 'Has anyone tried using IoT sensors for real-time monitoring of soil moisture, temperature, and humidity? Looking for recommendations on reliable and affordable sensor systems.',
    category: 'technology',
    groupId: 2,
    groupName: 'Smart Farming Technology',
    author: {
      name: 'Tech Farmer',
      avatar: '/api/placeholder/40/40',
      badge: 'Tech Expert'
    },
    createdAt: '2025-07-28',
    likes: 34,
    comments: 18,
    views: 243,
    isPinned: false,
    tags: ['iot', 'sensors', 'monitoring']
  }
];

const mockTrendingTopics = [
  { tag: 'drought-management', posts: 45 },
  { tag: 'organic-fertilizers', posts: 38 },
  { tag: 'pest-control', posts: 32 },
  { tag: 'climate-change', posts: 28 },
  { tag: 'market-prices', posts: 24 }
];

const mockTopContributors = [
  {
    id: 1,
    name: 'Sarah Green',
    avatar: '/api/placeholder/40/40',
    contributions: 127
  },
  {
    id: 2,
    name: 'Tech Farmer',
    avatar: '/api/placeholder/40/40',
    contributions: 98
  },
  {
    id: 3,
    name: 'Dr. Plant',
    avatar: '/api/placeholder/40/40',
    contributions: 76
  }
];

export default FarmerGroups;
