import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Header/Navigation */}
      <header className="bg-gradient-to-r from-green-600 to-green-800 text-white shadow-lg">
        <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🌱</span>
            <h1 className="text-xl font-bold">AgroMind</h1>
          </div>
          <div className="hidden md:flex space-x-6">
            <a href="#features" className="hover:text-green-200 transition">Features</a>
            <a href="#how-it-works" className="hover:text-green-200 transition">How It Works</a>
            <a href="#demo" className="hover:text-green-200 transition">Try Demo</a>
          </div>
          <div className="flex space-x-3">
            <Link 
              to="/login" 
              className="bg-white text-green-700 px-4 py-2 rounded-full font-semibold hover:bg-green-100 transition"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="border-2 border-white px-4 py-2 rounded-full font-semibold hover:bg-white hover:text-green-700 transition"
            >
              Register
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Your AI Farming Assistant</h1>
            <p className="text-xl mb-6">Diagnose crop diseases, predict yields, and get expert advice - all without internet</p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Link 
                to="/register" 
                className="bg-white text-green-700 px-6 py-3 rounded-full font-semibold hover:bg-green-100 transition flex items-center justify-center"
              >
                <span className="mr-2">📱</span> Get Started Free
              </Link>
              <button className="border-2 border-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-green-700 transition flex items-center justify-center">
                <span className="mr-2">▶️</span> Watch Demo
              </button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-64 h-96 md:w-80 md:h-112 bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-green-400 to-green-600 opacity-20"></div>
              <img 
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
                alt="Farm field" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-4 rounded-t-2xl">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <span className="text-green-600">🤖</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">AgroBot</p>
                    <p className="text-xs text-gray-500">AI Assistant</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-3">I've detected early blight in your tomato plants. Here's the treatment plan...</p>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-medium">View Details</button>
                  <button className="flex-1 border border-green-600 text-green-600 py-2 rounded-lg text-sm font-medium">Ask More</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">Powerful Features for Farmers</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">AgroMind works completely offline to bring AI-powered farming assistance to rural areas</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-green-50 rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <span className="text-green-600 text-xl">📷</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Disease Detection</h3>
              <p className="text-gray-600">Simply take a photo of your crop and our AI will instantly diagnose diseases and recommend treatments.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-green-50 rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <span className="text-green-600 text-xl">📈</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Yield Prediction</h3>
              <p className="text-gray-600">Get accurate yield forecasts based on your crop conditions, weather patterns, and historical data.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-green-50 rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <span className="text-green-600 text-xl">🎤</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Voice Commands</h3>
              <p className="text-gray-600">No typing needed. Speak naturally in your local language to get farming advice.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">How AgroMind Works</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">Simple steps to get AI-powered farming assistance</p>
          
          <div className="space-y-12">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <div className="bg-white p-6 rounded-xl shadow-sm max-w-md mx-auto">
                  <div className="flex items-start mb-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-green-600 font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Take a Photo</h3>
                      <p className="text-gray-600">Use your phone's camera to capture images of your crops or affected leaves.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80" 
                  alt="Farmer taking photo" 
                  className="rounded-lg shadow-md w-full max-w-md"
                />
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <div className="bg-white p-6 rounded-xl shadow-sm max-w-md mx-auto">
                  <div className="flex items-start mb-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-green-600 font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">AI Analysis</h3>
                      <p className="text-gray-600">Our offline AI processes the image instantly to detect diseases, pests, or nutrient deficiencies.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=1465&q=80" 
                  alt="AI analysis" 
                  className="rounded-lg shadow-md w-full max-w-md"
                />
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <div className="bg-white p-6 rounded-xl shadow-sm max-w-md mx-auto">
                  <div className="flex items-start mb-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-green-600 font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Get Recommendations</h3>
                      <p className="text-gray-600">Receive actionable advice on treatments, optimal harvest times, and market predictions.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1586771107445-d3ca888129ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
                  alt="Farmer with phone" 
                  className="rounded-lg shadow-md w-full max-w-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Farming?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of farmers using AgroMind to increase yields and reduce losses</p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link 
              to="/register" 
              className="bg-white text-green-700 px-8 py-4 rounded-full font-semibold text-lg hover:bg-green-100 transition flex items-center justify-center mx-auto sm:mx-0"
            >
              <span className="mr-3">📱</span> Get Started Free
            </Link>
            <Link 
              to="/login" 
              className="border-2 border-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-green-700 transition flex items-center justify-center mx-auto sm:mx-0"
            >
              <span className="mr-3">🔑</span> Login
            </Link>
          </div>
          
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full flex items-center">
              <span className="mr-2">✅</span> No internet required
            </div>
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full flex items-center">
              <span className="mr-2">✅</span> 15+ local languages
            </div>
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full flex items-center">
              <span className="mr-2">✅</span> Free basic version
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">🌱</span>
                <h3 className="text-xl font-bold">AgroMind</h3>
              </div>
              <p className="text-gray-400 mb-4">AI-powered farming assistance for small-scale farmers worldwide.</p>
              <div className="flex space-x-4">
                <span className="text-gray-400 hover:text-white transition cursor-pointer">📘</span>
                <span className="text-gray-400 hover:text-white transition cursor-pointer">🐦</span>
                <span className="text-gray-400 hover:text-white transition cursor-pointer">📷</span>
                <span className="text-gray-400 hover:text-white transition cursor-pointer">📺</span>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Home</a></li>
                <li><a href="#features" className="text-gray-400 hover:text-white transition">Features</a></li>
                <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition">How It Works</a></li>
                <li><Link to="/register" className="text-gray-400 hover:text-white transition">Get Started</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Community</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start">
                  <span className="mt-1 mr-3">📍</span>
                  <span>123 Farm Road, Agri Valley, India</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-3">📞</span>
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-3">📧</span>
                  <span>hello@agromind.app</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>© 2023 AgroMind. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
