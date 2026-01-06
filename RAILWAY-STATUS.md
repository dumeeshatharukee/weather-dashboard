# Weather Dashboard - Quick Start Guide

## ✅ Your Setup is Complete!

### Your URLs:
- 🎨 **Frontend (Vercel)**: https://weather-dashboard-sigma-three.vercel.app
- 🚂 **Backend (Railway)**: https://sweet-peace-production-1155.up.railway.app

---

## 🔍 Understanding "Cannot GET /"

When you visit `https://sweet-peace-production-1155.up.railway.app`, you see **"Cannot GET /"** - this is **COMPLETELY NORMAL**!

### Why?
Your backend is an **API server**, not a website. It doesn't have a homepage at `/`. It only responds to specific API endpoints.

---

## ✅ Test Your Railway Backend (It's Working!)

Open these URLs in your browser to verify:

### 1. Health Check
```
https://sweet-peace-production-1155.up.railway.app/api/health
```
**Expected Response:**
```json
{
  "status": "OK",
  "message": "Weather Dashboard API is running"
}
```

### 2. Get All Weather Profiles
```
https://sweet-peace-production-1155.up.railway.app/api/profiles
```
**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Kalagunaya Profile 1",
      "location": "Nuwara Eliya",
      "latestCoordinates": { ... },
      "totalDataPoints": 19
    },
    ...
  ]
}
```

### 3. Get Single Profile (use an ID from step 2)
```
https://sweet-peace-production-1155.up.railway.app/api/profiles/YOUR_PROFILE_ID
```

---

## 📊 Your Database Status

✅ **MongoDB Connected**: `WeatherCluster.4k4jdvd.mongodb.net`
✅ **Database**: `weather_db`
✅ **Profiles Collection**: `10 weather profiles`

### Profile Data:
1. **Kalagunaya Profile 1** - 19 data points
2. **Kalagunaya Profile 2** - 1,777 data points
3. **Kalagunaya Profile 3** - 5,017 data points
4. **Kalagunaya Profile 4** - 1,606 data points
5. **Kalagunaya Profile 5** - 1,602 data points
6. **Station 7.0044** (Colombo Area) - 1 data point
7. **Station 7.0044** (Colombo Area) - 1 data point
8. **Station 6.8704** (Southern Region) - 1 data point
9. **Station 7.0044** (Colombo Area) - 1 data point
10. **Station 6.8744** (Southern Region) - 1 data point

---

## 🚀 Railway Environment Variables

Make sure these are set in your Railway dashboard:

```env
MONGODB_URI=mongodb+srv://admin:Dumee%4011@weathercluster.4k4jdvd.mongodb.net/weather_db?retryWrites=true&w=majority&appName=WeatherCluster

PORT=5000

NODE_ENV=production

CORS_ORIGIN=https://weather-dashboard-sigma-three.vercel.app,https://weather-dashboard-git-main-dumeesha-tharukees-projects.vercel.app,https://weather-dashboard-git-*.vercel.app
```

---

## 🎯 Next Steps

1. **Visit your frontend**: https://weather-dashboard-sigma-three.vercel.app
2. **You should see**:
   - Interactive map with 10 weather stations
   - Click on any marker to see time series data
   - Auto-refreshes every 60 seconds

3. **If the map doesn't load**:
   - Open browser DevTools (F12)
   - Check Console for errors
   - Check Network tab for API calls
   - Verify the Vercel deployment has the correct API URL

---

## 🛠️ Troubleshooting

### Frontend shows "Loading..." forever
**Check**: Frontend `.env.production` has correct Railway URL
```bash
VITE_API_URL=https://sweet-peace-production-1155.up.railway.app
```

### CORS Errors in browser console
**Check**: Railway has `CORS_ORIGIN` environment variable set correctly

### No markers on the map
**Check**: `/api/profiles` endpoint returns data with valid coordinates

---

## 📝 Import More Data

To import additional weather data, edit `backend/import-sample-weather-data.js` and add your data, then run:

```bash
cd backend
node import-sample-weather-data.js
```

---

## ✨ You're All Set!

Your Railway backend is working perfectly! The "Cannot GET /" message is expected behavior for an API-only server.

Test the API endpoints above to confirm everything is running smoothly! 🎉
