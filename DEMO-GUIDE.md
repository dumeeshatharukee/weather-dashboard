# Quick Start Guide

## For Evaluators / Quick Testing

### Option 1: Using Sample Data (Fastest)

1. **Import Sample Data to MongoDB**:
   - Create MongoDB Atlas free account
   - Create database `weather_db` and collection `profiles`
   - Import all 5 JSON files from `sample-data/` folder

2. **Start Backend**:
   ```bash
   cd backend
   npm install
   # Create .env with your MongoDB URI
   npm start
   ```

3. **Start Frontend**:
   ```bash
   cd frontend
   npm install
   # Create .env with VITE_API_URL=http://localhost:5000
   npm run dev
   ```

4. **Access**: Open http://localhost:3000

### Option 2: Docker (Recommended for Demo)

```bash
# Add your MongoDB URI to .env in backend/
docker-compose up --build
```

Access at http://localhost:3000

## What to Demonstrate

1. ✅ **Map View**: Shows 5 weather stations across Sri Lanka
2. ✅ **Latest Coordinates**: Each marker uses the most recent location data
3. ✅ **Click Interaction**: Click any marker to see detailed time-series data
4. ✅ **Charts**: Beautiful visualizations of temperature, humidity, pressure, wind speed, and rainfall
5. ✅ **Statistics**: Min/Max/Average values for each sensor

## Presentation Tips

- Show the map first - highlight the 5 different locations
- Click on Colombo marker - show the popup information
- Click "View Time Series Data" - show the interactive charts
- Scroll down to show the data summary statistics
- Try clicking different markers to show multiple profiles
- Mention the responsive design (try resizing browser)
- Show the clean API responses in browser DevTools

## Common Demo Questions

**Q: How does it handle coordinate changes?**
A: The backend sorts data by timestamp and returns the latest coordinates for map display.

**Q: What if coordinates are missing?**
A: The system validates coordinates and logs warnings for invalid data.

**Q: How many profiles can it handle?**
A: Designed for 5 profiles as specified, but scalable to more.

**Q: Is it mobile-friendly?**
A: Yes, fully responsive design works on all devices.

## Deployment URLs (Update after deploying)

- **Frontend**: https://your-app.vercel.app
- **Backend API**: https://your-app.onrender.com
- **GitHub Repo**: https://github.com/yourusername/weather-dashboard

---

Total Development Time: ~6-8 hours for a junior developer
Files Created: 20+
Lines of Code: ~1000+
