# Frequently Asked Questions (FAQ)

## General Questions

### What is AgroMind?

AgroMind is a comprehensive AI-powered agricultural platform designed to help farmers make data-driven decisions. It combines advanced technology with agricultural expertise to provide crop disease detection, weather forecasts, market prices, farm analytics, and much more.

### Who can use AgroMind?

AgroMind is designed for:
- Individual farmers
- Agricultural cooperatives
- Farm managers
- Agricultural consultants
- Agricultural students and researchers
- Anyone interested in modern farming practices

### Is AgroMind free to use?

AgroMind offers multiple tiers:
- **Free Tier**: Basic features including crop information, disease detection (limited), and weather updates
- **Basic Plan**: Enhanced features with more diagnoses and analytics
- **Premium Plan**: Full access to all features including advanced AI, expert consultation, and priority support

### What technologies does AgroMind use?

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **AI/ML**: TensorFlow.js for disease detection
- **Real-time**: Socket.io for live updates
- **APIs**: Weather, market data, and geospatial services

---

## Technical Questions

### What are the system requirements?

**For Web Application:**
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (3G or better)
- JavaScript enabled

**For Development:**
- Node.js 16.x or higher
- MongoDB 4.4 or higher
- 4GB RAM minimum
- 10GB free disk space

### How do I install AgroMind locally?

See our [SETUP.md](./SETUP.md) guide for detailed installation instructions. Quick steps:

1. Clone the repository
2. Install dependencies in backend and frontend
3. Set up MongoDB
4. Configure environment variables
5. Start both servers

### Does AgroMind work offline?

AgroMind has limited offline functionality:
- Core UI navigation (PWA)
- Cached weather data
- Previously viewed crop information
- Stored user data

Full offline mode is planned for version 1.1.

### How do I report bugs?

1. Check if the issue already exists in [GitHub Issues](https://github.com/ashikbro/AgroMind/issues)
2. If not, create a new issue using the bug report template
3. Include detailed steps to reproduce
4. Add screenshots if applicable

---

## Feature Questions

### How accurate is the disease detection?

Our AI model achieves approximately 85-90% accuracy across common crop diseases. Accuracy depends on:
- Image quality (clear, well-lit photos work best)
- Disease visibility
- Crop type
- Training data availability

We continuously improve our models with new data.

### What crops are supported?

Currently 20+ crops including:
- **Cereals**: Wheat, Rice, Maize, Barley
- **Pulses**: Chickpea, Lentil, Pigeon Pea
- **Vegetables**: Tomato, Onion, Potato, Cabbage, Cauliflower
- **Cash Crops**: Cotton, Sugarcane, Mustard
- **Fruits**: Mango, Banana
- **Spices**: Turmeric, Ginger

More crops are added regularly.

### How do I upload images for disease detection?

1. Navigate to the Diagnosis page
2. Click or drag-and-drop crop images
3. Optionally select crop type and add symptom description
4. Click "Analyze Disease"
5. View results and treatment recommendations

### Where does weather data come from?

Weather data is sourced from:
- OpenWeatherMap API
- Regional meteorological services
- Satellite data

Data is updated every hour for accuracy.

### How are market prices determined?

Market prices are aggregated from:
- Government mandi (market) data
- Agricultural commodity exchanges
- Real-time trader reports
- Historical price trends

Prices are updated daily.

### Can I schedule farming activities?

Yes! The Crop Calendar feature allows you to:
- Schedule various activities (sowing, watering, fertilizing, etc.)
- Set reminders
- Track completion
- View seasonal recommendations

---

## Account & Security

### How do I create an account?

1. Click "Register" on the homepage
2. Provide your name, email, and password
3. Select your role (farmer, expert, etc.)
4. Verify your email (if enabled)
5. Complete your profile

### Is my data secure?

Yes! We implement multiple security measures:
- Passwords are hashed using bcrypt
- JWT tokens for secure authentication
- HTTPS encryption in production
- Regular security audits
- GDPR-compliant data handling

See [SECURITY.md](./SECURITY.md) for details.

### Can I delete my account?

Yes, you can delete your account from the Profile settings. Note that:
- This action is permanent
- All your data will be removed
- This cannot be undone
- Some anonymized analytics may be retained

### How do I reset my password?

1. Click "Forgot Password" on the login page
2. Enter your registered email
3. Check your email for reset link
4. Click the link and enter new password
5. Log in with new credentials

---

## Usage Questions

### How do I get the best disease detection results?

**Tips for best results:**
- Take clear, focused photos
- Ensure good lighting (natural light is best)
- Capture affected areas up close
- Take multiple angles if possible
- Include some healthy parts for comparison
- Avoid blurry or dark images

### Can I use AgroMind on my smartphone?

Yes! AgroMind is fully responsive and works on:
- Smartphones (iOS and Android)
- Tablets
- Desktop computers
- Any device with a web browser

A native mobile app is planned for 2025.

### How often should I check weather forecasts?

We recommend:
- Daily checks during critical growing periods
- Before planning field activities
- When weather alerts are issued
- During planting and harvesting seasons

### Can multiple people manage one farm?

Currently, each account manages one farm profile. Multi-user farm management is planned for a future release. As a workaround:
- Share login credentials (not recommended for security)
- Create separate accounts and coordinate manually
- Wait for upcoming team management features

### How do I contact experts?

Via the Expert Consultation page:
1. Browse available experts
2. View their specializations and ratings
3. Book a consultation slot
4. Connect via video call, chat, or phone
5. Receive personalized advice

---

## Troubleshooting

### The app is loading slowly

Try these steps:
1. Check your internet connection
2. Clear browser cache and cookies
3. Try a different browser
4. Disable browser extensions
5. Restart your browser

If issues persist, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md).

### Images won't upload

Common solutions:
- Check file size (max 10MB)
- Ensure correct format (JPG, PNG)
- Verify internet connection
- Try a different browser
- Check browser permissions

### I can't log in

Troubleshooting steps:
1. Verify email and password
2. Check for typos
3. Try password reset
4. Clear browser cookies
5. Contact support if issues persist

### Weather data is not showing

Possible causes:
- Location services disabled
- Invalid location coordinates
- API rate limits reached
- Temporary service outage

Try:
- Enable location services
- Enter location manually
- Wait and try again
- Check status page

---

## Development & Contribution

### How can I contribute?

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines. Ways to contribute:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation
- Help with translations

### Can I use AgroMind for commercial purposes?

Yes! AgroMind is licensed under MIT License, which allows:
- Commercial use
- Modification
- Distribution
- Private use

See [LICENSE](./LICENSE) for full terms.

### Is there an API for integration?

Yes! We provide:
- REST API for standard operations
- GraphQL API for flexible queries
- WebSocket for real-time updates

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for details.

### How do I run tests?

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Run with coverage
npm test -- --coverage
```

---

## Future Features

### When will the mobile app be available?

The React Native mobile app is planned for Q1 2025. It will include:
- Native camera integration
- Offline functionality
- Push notifications
- Better performance

### Will there be drone integration?

Yes! Drone integration is on the roadmap for 2025, featuring:
- Aerial crop monitoring
- Automated field mapping
- Problem detection
- Precision agriculture support

### Are there plans for more languages?

Yes! We plan to expand to 50+ languages by 2026, prioritizing:
- Regional Indian languages
- Southeast Asian languages
- African languages
- European languages

### Will there be offline AI processing?

Offline AI is planned for version 1.1, enabling:
- Disease detection without internet
- Cached model inference
- Improved response times
- Rural area accessibility

---

## Support & Contact

### How do I get help?

Multiple support channels:
1. Check this FAQ
2. Review [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
3. Search [GitHub Issues](https://github.com/ashikbro/AgroMind/issues)
4. Create a new issue
5. Contact support team

### Where can I see what's planned?

Check our [ROADMAP.md](./ROADMAP.md) for:
- Upcoming features
- Release schedule
- Long-term vision
- Community requests

### How do I stay updated?

- ⭐ Star the GitHub repository
- 👀 Watch for updates
- 📧 Subscribe to newsletter (coming soon)
- 🐦 Follow on social media (coming soon)
- 📝 Check CHANGELOG.md

---

## Feedback

### How can I suggest a feature?

1. Check if it's already in the [roadmap](./ROADMAP.md)
2. Search existing feature requests
3. Create a new issue with "feature request" label
4. Provide detailed description and use case
5. Community can vote with 👍 reactions

### Where can I report incorrect information?

If you find incorrect agricultural information:
1. Create an issue with "documentation" label
2. Specify the incorrect information
3. Provide correct information with sources
4. We'll review and update promptly

---

**Still have questions? [Open an issue](https://github.com/ashikbro/AgroMind/issues) and we'll help! 🌾**
