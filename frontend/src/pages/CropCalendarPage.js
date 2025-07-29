import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { cropAPI, calendarAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const CropCalendarPage = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newEvent, setNewEvent] = useState({
    title: '',
    cropId: '',
    date: '',
    type: '',
    description: '',
    reminderDays: 1
  });

  const eventTypes = [
    { value: 'sowing', label: '🌱 Sowing', color: 'green' },
    { value: 'watering', label: '💧 Watering', color: 'blue' },
    { value: 'fertilizing', label: '🌿 Fertilizing', color: 'yellow' },
    { value: 'pesticide', label: '🚿 Pesticide Application', color: 'red' },
    { value: 'harvesting', label: '🌾 Harvesting', color: 'orange' },
    { value: 'pruning', label: '✂️ Pruning', color: 'purple' },
    { value: 'transplanting', label: '🌿 Transplanting', color: 'indigo' },
    { value: 'monitoring', label: '👀 Monitoring', color: 'gray' }
  ];

  useEffect(() => {
    fetchData();
  }, [currentDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [calendarResponse, cropsResponse] = await Promise.all([
        calendarAPI.getEvents(currentDate.getFullYear(), currentDate.getMonth() + 1),
        cropAPI.getCrops()
      ]);
      
      setCalendarEvents(calendarResponse.data.data || []);
      setCrops(cropsResponse.data.data.crops || []);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
      toast.error('Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    
    if (!newEvent.title || !newEvent.date || !newEvent.type) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await calendarAPI.addEvent(newEvent);
      toast.success('Event added successfully!');
      setShowAddEvent(false);
      setNewEvent({
        title: '',
        cropId: '',
        date: '',
        type: '',
        description: '',
        reminderDays: 1
      });
      fetchData();
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error('Failed to add event');
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDate = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDate; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getEventsForDay = (day) => {
    if (!day) return [];
    
    const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return calendarEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === dayDate.toDateString();
    });
  };

  const getEventTypeInfo = (type) => {
    return eventTypes.find(et => et.value === type) || eventTypes[7];
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return calendarEvents
      .filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= today && eventDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);
  };

  const getSeasonalRecommendations = () => {
    const month = currentDate.getMonth();
    const season = month >= 2 && month <= 4 ? 'spring' : 
                  month >= 5 && month <= 7 ? 'summer' :
                  month >= 8 && month <= 10 ? 'autumn' : 'winter';
    
    const recommendations = {
      spring: [
        '🌱 Plant summer crops like tomatoes, peppers, and cucumbers',
        '🌿 Prepare soil with compost and organic matter',
        '💧 Increase watering frequency as temperatures rise',
        '🦋 Watch for pest activity and beneficial insects'
      ],
      summer: [
        '☀️ Provide shade for heat-sensitive crops',
        '💧 Water deeply and early in the morning',
        '🌾 Harvest early summer crops',
        '🌿 Mulch around plants to retain moisture'
      ],
      autumn: [
        '🍂 Plant cool-season crops like lettuce and spinach',
        '🌾 Harvest and store root vegetables',
        '🍃 Clean up fallen leaves and debris',
        '🌱 Plan for next year\'s garden'
      ],
      winter: [
        '❄️ Protect plants from frost',
        '🌿 Plan next year\'s crop rotation',
        '📚 Study and learn about new farming techniques',
        '🛠️ Maintain and repair farm equipment'
      ]
    };
    
    return recommendations[season] || [];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const days = getDaysInMonth(currentDate);
  const upcomingEvents = getUpcomingEvents();
  const seasonalRecommendations = getSeasonalRecommendations();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            📅 Crop Calendar
          </h1>
          <p className="text-lg text-gray-600">
            Plan and track your farming activities throughout the year
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {currentDate.toLocaleDateString('en', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className="px-4 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    →
                  </button>
                  <button
                    onClick={() => setShowAddEvent(true)}
                    className="btn-primary"
                  >
                    + Add Event
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                  const events = getEventsForDay(day);
                  const isToday = day && 
                    new Date().toDateString() === 
                    new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
                  
                  return (
                    <div
                      key={index}
                      className={`min-h-24 p-2 border border-gray-200 ${
                        day ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                      } ${isToday ? 'ring-2 ring-green-500' : ''}`}
                    >
                      {day && (
                        <>
                          <div className={`text-sm font-medium mb-1 ${
                            isToday ? 'text-green-600' : 'text-gray-900'
                          }`}>
                            {day}
                          </div>
                          <div className="space-y-1">
                            {events.slice(0, 3).map((event, eventIndex) => {
                              const eventType = getEventTypeInfo(event.type);
                              return (
                                <div
                                  key={eventIndex}
                                  className={`text-xs p-1 rounded truncate bg-${eventType.color}-100 text-${eventType.color}-800`}
                                  title={event.title}
                                >
                                  {event.title}
                                </div>
                              );
                            })}
                            {events.length > 3 && (
                              <div className="text-xs text-gray-500">
                                +{events.length - 3} more
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ⏰ Upcoming This Week
              </h3>
              {upcomingEvents.length > 0 ? (
                <div className="space-y-3">
                  {upcomingEvents.map((event, index) => {
                    const eventType = getEventTypeInfo(event.type);
                    return (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-sm text-gray-900">{event.title}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(event.date).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="text-lg">{eventType.label.split(' ')[0]}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No upcoming events this week</p>
              )}
            </div>

            {/* Seasonal Recommendations */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🌿 Seasonal Tips
              </h3>
              <div className="space-y-2">
                {seasonalRecommendations.map((tip, index) => (
                  <div key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="mr-2 mt-0.5">{tip.split(' ')[0]}</span>
                    <span>{tip.split(' ').slice(1).join(' ')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📊 This Month
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Events:</span>
                  <span className="font-medium">{calendarEvents.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sowing Tasks:</span>
                  <span className="font-medium text-green-600">
                    {calendarEvents.filter(e => e.type === 'sowing').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Harvest Tasks:</span>
                  <span className="font-medium text-orange-600">
                    {calendarEvents.filter(e => e.type === 'harvesting').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Maintenance:</span>
                  <span className="font-medium text-blue-600">
                    {calendarEvents.filter(e => ['watering', 'fertilizing', 'pruning'].includes(e.type)).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Event Modal */}
        {showAddEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Add Calendar Event
              </h3>
              
              <form onSubmit={handleAddEvent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., Plant tomatoes"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Type *
                  </label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select event type</option>
                    {eventTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Related Crop
                  </label>
                  <select
                    value={newEvent.cropId}
                    onChange={(e) => setNewEvent({...newEvent, cropId: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select crop (optional)</option>
                    {crops.map(crop => (
                      <option key={crop._id} value={crop._id}>{crop.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Additional notes..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reminder (days before)
                  </label>
                  <select
                    value={newEvent.reminderDays}
                    onChange={(e) => setNewEvent({...newEvent, reminderDays: parseInt(e.target.value)})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value={0}>No reminder</option>
                    <option value={1}>1 day before</option>
                    <option value={3}>3 days before</option>
                    <option value={7}>1 week before</option>
                  </select>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 btn-primary"
                  >
                    Add Event
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddEvent(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropCalendarPage;
