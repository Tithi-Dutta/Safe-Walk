# SafeWalk 🚶‍♀️
<div align="center">

![SafeWalk Banner](https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=32&duration=3000&pause=1000&color=FF6B9D&center=true&vCenter=true&width=600&lines=SafeWalk;Women's+Safety+Navigation;Navigate+with+Confidence)

**Women's Safety Navigation Platform**

*Navigate with Confidence. Your Safety, Our Priority.*

<img src="https://raw.githubusercontent.com/platane/snk/output/github-contribution-grid-snake-dark.svg" width="100%" alt="Snake animation" />

[![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red.svg?style=for-the-badge)](https://github.com/Tithi-Dutta/SafeWalk)
[![Women Safety](https://img.shields.io/badge/Women-Safety-pink.svg?style=for-the-badge)](https://github.com/Tithi-Dutta/SafeWalk)
[![Open Source](https://img.shields.io/badge/Open-Source-blue.svg?style=for-the-badge)](https://github.com/Tithi-Dutta/SafeWalk)

</div>

---

## 🌟 Overview

<img align="right" width="400" src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" alt="Coding animation">

SafeWalk is a comprehensive web-based platform designed to help women feel safer and more confident while moving through public spaces. Our mission is simple: to provide real-time safety information and resources to empower women during their daily commutes and travels.

<div align="center">
<img src="https://user-images.githubusercontent.com/74038190/212284158-e840e285-664b-44d7-b79b-e264b5e54825.gif" width="400">
</div>

---

## ✨ Features

<details>
<summary><b>🔍 Real-Time Safety Assessment</b></summary>
<br>

- **Location-based Safety Scoring**: Get instant safety scores for any location using our machine learning model
- **Time-sensitive Analysis**: Different safety assessments for day and night travel
- **Interactive Map Integration**: Select locations directly on Google Maps interface

<img src="https://user-images.githubusercontent.com/74038190/212257454-16e3712e-945a-4ca2-b238-408ad0bf87e6.gif" width="100">

</details>

<details>
<summary><b>📍 Smart Safety Metrics</b></summary>
<br>

- **Police Station Proximity**: Distance to nearest police stations
- **Public Space Density**: Number of open businesses, hospitals, and safe spaces within 1km
- **Road Accessibility**: Proximity to main roads and highways
- **Human Gathering Score**: Assessment based on nearby cafes, restaurants, shopping centers

<img src="https://user-images.githubusercontent.com/74038190/212257468-1e9a91f1-b626-4baa-b15d-5c385dfa7763.gif" width="100">

</details>

<details>
<summary><b>🆘 Emergency Services</b></summary>
<br>

- **SOS Functionality**: Quick access to emergency contacts within 10km radius
- **Nearby Services**: Find police stations, hospitals, and safe spaces
- **Contact Integration**: Direct access to emergency contact numbers

<img src="https://user-images.githubusercontent.com/74038190/216122041-518ac897-8d92-4c6b-9b3f-ca01dcaf38ee.png" width="100">

</details>

<details>
<summary><b>🌐 User-Friendly Interface</b></summary>
<br>

- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Intuitive Navigation**: Clean, accessible interface design
- **User Authentication**: Secure login and registration system

<img src="https://user-images.githubusercontent.com/74038190/212257472-08e52665-c503-4bd9-aa20-f5a4dae769b5.gif" width="100">

</details>

---

## 🚀 Technology Stack

<div align="center">

<img src="https://skillicons.dev/icons?i=html,css,js,nodejs,express,python,gcp&theme=dark" />

<br><br>

![Tech Stack](https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=18&duration=2000&pause=500&color=36BCF7&center=true&vCenter=true&width=600&lines=Frontend%3A+HTML5%2C+CSS3%2C+JavaScript+(34.4%25);Backend%3A+Node.js+with+Express;Maps%3A+Google+Maps+API+integration;Machine+Learning%3A+Python-based+safety+model;Styling%3A+Custom+CSS+with+responsive+design)

</div>

---

## 🏗️ Project Structure

<div align="center">
<img src="https://user-images.githubusercontent.com/74038190/212257467-871d32b7-e401-42e8-a166-fcfd7baa4c6b.gif" width="100">
</div>

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

---

## 🔧 Installation & Setup

<img align="right" width="300" src="https://user-images.githubusercontent.com/74038190/212257460-738ff738-247f-4445-a718-cdd0ca76e2db.gif" alt="Setup animation">

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

---

## 🎯 How It Works

<div align="center">
<img src="https://user-images.githubusercontent.com/74038190/212257465-7ce8d493-cac5-494e-982a-5a9deb852c4b.gif" width="200">
</div>

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

---

## 📱 Usage Guide

<img align="left" width="300" src="https://user-images.githubusercontent.com/74038190/219923809-b86dc415-a0c2-4a38-bc88-ad6cf06395a8.gif" alt="Mobile usage">

1. **Registration/Login**: Create an account or log in to access features
2. **Location Selection**: Use the map to select your desired location
3. **Time Selection**: Choose day or night for time-specific assessment
4. **Safety Check**: Click "Check Safety Score" to get detailed analysis
5. **Emergency Services**: Access SOS features for immediate help

<br clear="left"/>

---

## 🛡️ Safety Features

<div align="center">

| Feature | Description | Status |
|---------|-------------|--------|
| 🚨 Emergency Contacts | Quick access to police, hospitals, and emergency services | ✅ Active |
| 📊 Real-time Data | Up-to-date information about nearby safe spaces | ✅ Active |
| 👥 User Reviews | Community-driven safety insights | ✅ Active |
| 🏥 Help Zones | Highlighted safe spaces and community hubs | ✅ Active |

<img src="https://user-images.githubusercontent.com/74038190/212257456-4d082414-75f9-4598-8a78-3a72699b5d69.gif" width="150">

</div>

---

## 🤝 Contributing

<div align="center">
<img src="https://user-images.githubusercontent.com/74038190/212257463-4d082cb4-7483-4eaf-bc25-6dde2628aabd.gif" width="200">
</div>

We welcome contributions to make SafeWalk better! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<div align="center">

[![Contributors](https://contrib.rocks/image?repo=Tithi-Dutta/SafeWalk)](https://github.com/Tithi-Dutta/SafeWalk/graphs/contributors)

</div>

---

## 📄 License

<div align="center">
<img src="https://user-images.githubusercontent.com/74038190/212257470-6cb5ed7c-5c88-4cec-8e4f-e6b50c37effe.gif" width="100">
</div>

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

<div align="center">

![Team](https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=20&duration=2000&pause=1000&color=FF6B9D&center=true&vCenter=true&width=500&lines=Meet+Our+Amazing+Team!;Building+Safe+Spaces+Together)

- **Tithi Dutta** - Project Lead & Developer 👩‍💻
- **Swarnali Chakraborty**
- **Anubrata Naskar**

<img src="https://user-images.githubusercontent.com/74038190/212257469-0d7fc5d2-0b42-4ee2-9c2f-7f3d6f4fcc87.gif" width="200">

</div>

---

## 📞 Support

<div align="center">
<img src="https://user-images.githubusercontent.com/74038190/212257461-58e91aed-f2a0-4758-b0eb-2012e78c95e9.gif" width="150">
</div>

For support, feedback, or questions:
- Create an issue on GitHub
- Contact us through the application's contact form

---

## 🌟 Mission Statement

<div align="center">

![Mission](https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=18&duration=3000&pause=1000&color=36BCF7&center=true&vCenter=true&width=800&lines=At+SafeWalk%2C+we+believe+safety+is+a+right%2C+not+a+privilege;We're+building+technology+that+supports+women's+freedom;Creating+a+world+where+women+can+walk+free%2C+strong%2C+and+safe)

<img src="https://user-images.githubusercontent.com/74038190/216122069-5b8169d4-cfe2-4b92-83ab-762cd8fce1e3.png" width="200">

</div>

At SafeWalk, we believe safety is a right, not a privilege. We're building technology that supports women's freedom of movement and helps create a world where women can walk free, walk strong, and walk safe.

---

<div align="center">

**Made with ❤️ for women's safety**

<img src="https://user-images.githubusercontent.com/74038190/212284115-f47cd8ff-2ffb-4b04-b5bf-4d1c14c0247f.gif" width="100">

### ⭐ Star us on GitHub — it helps!

[![GitHub stars](https://img.shields.io/github/stars/Tithi-Dutta/SafeWalk.svg?style=social&label=Star)](https://github.com/Tithi-Dutta/SafeWalk)
[![GitHub forks](https://img.shields.io/github/forks/Tithi-Dutta/SafeWalk.svg?style=social&label=Fork)](https://github.com/Tithi-Dutta/SafeWalk/fork)
[![GitHub watchers](https://img.shields.io/github/watchers/Tithi-Dutta/SafeWalk.svg?style=social&label=Watch)](https://github.com/Tithi-Dutta/SafeWalk)

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=100&section=footer&text=SafeWalk&fontSize=16&fontColor=fff&animation=twinkling&fontAlignY=35"/>

</div>
