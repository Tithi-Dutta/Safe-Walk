# SafeWalk 🚶‍♀️

**Women's Safety Navigation Platform**

*Navigate with Confidence. Your Safety, Our Priority.*

## 🌟 Overview

SafeWalk is a comprehensive web-based platform designed to help women feel safer and more confident while moving through public spaces. Our mission is simple: to provide real-time safety information and resources to empower women during their daily commutes and travels.

## ✨ Features

### 🔍 Real-Time Safety Assessment
- **Location-based Safety Scoring**: Get instant safety scores for any location using our machine learning model
- **Time-sensitive Analysis**: Different safety assessments for day and night travel
- **Interactive Map Integration**: Select locations directly on Google Maps interface

### 📍 Smart Safety Metrics
- **Police Station Proximity**: Distance to nearest police stations
- **Public Space Density**: Number of open businesses, hospitals, and safe spaces within 1km
- **Road Accessibility**: Proximity to main roads and highways
- **Human Gathering Score**: Assessment based on nearby cafes, restaurants, shopping centers

### 🆘 Emergency Services
- **SOS Functionality**: Quick access to emergency contacts within 10km radius
- **Nearby Services**: Find police stations, hospitals, and safe spaces
- **Contact Integration**: Direct access to emergency contact numbers

### 🌐 User-Friendly Interface
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Intuitive Navigation**: Clean, accessible interface design
- **User Authentication**: Secure login and registration system

## 🚀 Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (34.4%)
- **Backend**: Node.js with Express
- **Maps**: Google Maps API integration
- **Machine Learning**: Python-based safety prediction model
- **Styling**: Custom CSS with responsive design

## 🏗️ Project Structure

```
SafeWalk/
├── frontEnd/
│   ├── index.html          # Main landing page
│   ├── about.html          # About page
│   ├── safety.html         # Location selection page
│   ├── Safety_Score.html   # Safety score display
│   ├── Services.html       # Emergency services
│   ├── Sos.html           # SOS functionality
│   ├── contact_us.html    # Contact page
│   ├── css/               # Stylesheets
│   ├── logo/              # Logo and images
│   └── main.js            # Main JavaScript functionality
├── backEnd/
│   └── safety.js          # Backend API and ML integration
└── model.py               # Python ML model for safety prediction
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- Python 3.x
- Google Maps API key

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tithi-Dutta/SafeWalk.git
   cd SafeWalk
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Google Maps API**
   - Get a Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)
   - Replace the API key in the HTML files where Google Maps is used

4. **Run the application**
   ```bash
   npm start
   ```

5. **Access the application**
   - Open your browser and navigate to `http://localhost:3000`

## 🎯 How It Works

### Safety Score Calculation
1. **Location Selection**: Users select a location on the interactive map
2. **Data Collection**: System gathers data about:
   - Nearest police stations
   - Open businesses and safe spaces
   - Road accessibility
   - Time of day
3. **ML Processing**: Python model processes the data to generate safety scores
4. **Results Display**: Users receive comprehensive safety information

### Key Safety Factors
- **Police Proximity Score**: Based on distance to nearest police station
- **Public Space Density**: Count of hospitals, cafes, restaurants, shopping centers
- **Road Accessibility**: Distance to main roads and highways
- **Time Factor**: Day/night considerations in safety assessment

## 📱 Usage Guide

1. **Registration/Login**: Create an account or log in to access features
2. **Location Selection**: Use the map to select your desired location
3. **Time Selection**: Choose day or night for time-specific assessment
4. **Safety Check**: Click "Check Safety Score" to get detailed analysis
5. **Emergency Services**: Access SOS features for immediate help

## 🛡️ Safety Features

- **Emergency Contacts**: Quick access to police, hospitals, and emergency services
- **Real-time Data**: Up-to-date information about nearby safe spaces
- **User Reviews**: Community-driven safety insights
- **Help Zones**: Highlighted safe spaces and community hubs

## 🤝 Contributing

We welcome contributions to make SafeWalk better! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Tithi Dutta** - Project Lead & Developer
- And other amazing contributors!

## 📞 Support

For support, feedback, or questions:
- Create an issue on GitHub
- Contact us through the application's contact form

## 🌟 Mission Statement

At SafeWalk, we believe safety is a right, not a privilege. We're building technology that supports women's freedom of movement and helps create a world where women can walk free, walk strong, and walk safe.

---

**Made with ❤️ for women's safety**
