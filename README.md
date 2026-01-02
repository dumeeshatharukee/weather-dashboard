# 🌦️ Weather Dashboard - Sri Lanka

A full-stack web application for visualizing weather data from multiple locations across Sri Lanka. This project features an interactive map displaying weather stations and detailed time-series visualizations of sensor data.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [MongoDB Setup](#mongodb-setup)
- [Running Locally](#running-locally)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)

## ✨ Features

- 🗺️ **Interactive Map**: Displays 5 weather profiles across Sri Lanka using Leaflet.js
- 📊 **Time Series Visualization**: Dynamic charts showing sensor readings over time
- 🎯 **Smart Coordinate Handling**: Automatically uses the latest coordinates for each profile
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🔄 **Real-time Data**: Fetches data from MongoDB through RESTful API
- 📈 **Multiple Sensors**: Supports temperature, humidity, pressure, wind speed, and rainfall data

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** (MongoDB Atlas for cloud hosting)
- **CORS** enabled for frontend communication

### Frontend
- **React 18** with Vite
- **Leaflet.js** for interactive maps
- **Chart.js** for time series visualization
- **Axios** for API communication

### Deployment Options
- **Backend**: Render, Railway, or Heroku
- **Frontend**: Vercel, Netlify, or GitHub Pages

## 📁 Project Structure

```
weather-dashboard/
├── backend/
│   ├── server.js           # Express server & API routes
│   ├── package.json        # Backend dependencies
│   ├── .env.example        # Environment variables template
│   └── Dockerfile          # Docker configuration for backend
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MapView.jsx        # Map component
│   │   │   ├── MapView.css
│   │   │   ├── TimeSeriesChart.jsx # Chart component
│   │   │   └── TimeSeriesChart.css
│   │   ├── App.jsx         # Main application
│   │   ├── App.css
│   │   ├── main.jsx        # Entry point
│   │   └── index.css
│   ├── index.html
│   ├── package.json        # Frontend dependencies
│   ├── vite.config.js      # Vite configuration
│   └── Dockerfile          # Docker configuration for frontend
├── sample-data/            # Sample JSON files for testing
│   ├── profile1-colombo.json
│   ├── profile2-kandy.json
│   ├── profile3-galle.json
│   ├── profile4-jaffna.json
│   └── profile5-nuwara-eliya.json
└── README.md
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB Atlas Account** (free tier) - [Sign up](https://www.mongodb.com/cloud/atlas/register)
- **Git** - [Download](https://git-scm.com/)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd weather-dashboard
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` and add your MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/weather_db?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000
```

## 🗄️ MongoDB Setup

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account
3. Create a new cluster (choose M0 Free tier)

### Step 2: Create Database and Collection

1. Click on "Browse Collections"
2. Click "Add My Own Data"
3. Database name: `weather_db`
4. Collection name: `profiles`

### Step 3: Import Sample Data

**Option A: Using MongoDB Compass (Recommended)**

1. Download [MongoDB Compass](https://www.mongodb.com/try/download/compass)
2. Connect using your connection string
3. Navigate to `weather_db` database → `profiles` collection
4. Click "ADD DATA" → "Import JSON or CSV file"
5. Import each file from `sample-data/` folder one by one

**Option B: Using mongoimport Command**

```bash
mongoimport --uri "your-mongodb-uri" --collection profiles --file sample-data/profile1-colombo.json --jsonArray
mongoimport --uri "your-mongodb-uri" --collection profiles --file sample-data/profile2-kandy.json --jsonArray
mongoimport --uri "your-mongodb-uri" --collection profiles --file sample-data/profile3-galle.json --jsonArray
mongoimport --uri "your-mongodb-uri" --collection profiles --file sample-data/profile4-jaffna.json --jsonArray
mongoimport --uri "your-mongodb-uri" --collection profiles --file sample-data/profile5-nuwara-eliya.json --jsonArray
```

### Step 4: Get Connection String

1. In MongoDB Atlas, click "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database password
5. Add it to your backend `.env` file

## 🏃 Running Locally

### Start Backend Server

```bash
cd backend
npm start
```

The backend will run on `http://localhost:5000`

To verify the backend is running, visit: `http://localhost:5000/api/health`

### Start Frontend Development Server

Open a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000` and automatically open in your browser.

## 🌐 Deployment

### Backend Deployment (Render.com)

1. Create account on [Render](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: weather-dashboard-backend
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variable:
   - Key: `MONGODB_URI`
   - Value: Your MongoDB connection string
6. Click "Create Web Service"
7. Copy your backend URL (e.g., `https://your-app.onrender.com`)

### Frontend Deployment (Vercel)

1. Create account on [Vercel](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variable:
   - Name: `VITE_API_URL`
   - Value: Your backend URL from Render
6. Click "Deploy"

### Alternative: Railway (Backend)

```bash
cd backend
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Add environment variables
railway variables set MONGODB_URI="your-mongodb-uri"

# Deploy
railway up
```

### Alternative: Netlify (Frontend)

```bash
cd frontend
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

## 📚 API Documentation

### Base URL
```
Local: http://localhost:5000
Production: https://your-backend-url.com
```

### Endpoints

#### 1. Health Check
```
GET /api/health
```
**Response:**
```json
{
  "status": "OK",
  "message": "Weather Dashboard API is running"
}
```

#### 2. Get All Profiles
```
GET /api/profiles
```
**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "profile_id",
      "name": "Colombo Weather Station",
      "location": "Sri Lanka",
      "latestCoordinates": {
        "latitude": 6.9271,
        "longitude": 79.8612,
        "timestamp": "2026-01-01T10:00:00Z"
      },
      "totalDataPoints": 3
    }
  ]
}
```

#### 3. Get Profile by ID
```
GET /api/profiles/:id
```
**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "profile_id",
    "name": "Colombo Weather Station",
    "location": "Sri Lanka",
    "latestCoordinates": {
      "latitude": 6.9271,
      "longitude": 79.8612,
      "timestamp": "2026-01-01T10:00:00Z"
    },
    "totalDataPoints": 3,
    "metadata": {}
  }
}
```

#### 4. Get Time Series Data
```
GET /api/profiles/:id/timeseries
```
**Response:**
```json
{
  "success": true,
  "profileId": "profile_id",
  "profileName": "Colombo Weather Station",
  "dataPoints": 3,
  "sensors": ["temperature", "humidity", "pressure", "wind_speed", "rainfall"],
  "data": [
    {
      "timestamp": "2026-01-01T08:00:00Z",
      "latitude": 6.9271,
      "longitude": 79.8612,
      "temperature": 28.5,
      "humidity": 75,
      "pressure": 1013,
      "wind_speed": 12.5,
      "rainfall": 0
    }
  ]
}
```

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Cannot connect to MongoDB
- Verify your connection string in `.env`
- Check if your IP address is whitelisted in MongoDB Atlas
- Ensure network access is set to "Allow access from anywhere" (0.0.0.0/0)

**Problem**: Port 5000 already in use
- Change the PORT in `.env` file
- Or kill the process using port 5000: `netstat -ano | findstr :5000` then `taskkill /PID <PID> /F`

### Frontend Issues

**Problem**: API requests failing
- Check if backend is running on correct port
- Verify `VITE_API_URL` in frontend `.env`
- Check browser console for CORS errors

**Problem**: Map not displaying
- Ensure internet connection (Leaflet tiles require internet)
- Check browser console for errors
- Verify coordinates in MongoDB data are valid

**Problem**: No data on charts
- Verify data is imported correctly in MongoDB
- Check API responses in browser Network tab
- Ensure sensor field names match in backend and frontend

## 📝 Sample Data Format

Your JSON files should follow this structure:

```json
[
  {
    "name": "weather_db",
    "profile_name": "Station Name",
    "location": "Location Name",
    "data": [
      {
        "timestamp": "2026-01-01T08:00:00Z",
        "latitude": 6.9271,
        "longitude": 79.8612,
        "temperature": 28.5,
        "humidity": 75,
        "pressure": 1013,
        "wind_speed": 12.5,
        "rainfall": 0
      }
    ]
  }
]
```

## 🎯 Key Features Implemented

✅ MongoDB integration with time-series data  
✅ RESTful API with Express.js  
✅ Interactive map with Leaflet.js  
✅ Latest coordinate detection logic  
✅ Time series visualization with Chart.js  
✅ Responsive design for all devices  
✅ Error handling and loading states  
✅ Docker support for easy deployment  
✅ Sample data for testing  

## 📧 Contact & Support

For questions or clarifications:
- Email: [Your Email]
- WhatsApp: [Your Number]

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for Darimac Internship Application**

Good luck with your demonstration! 🚀
