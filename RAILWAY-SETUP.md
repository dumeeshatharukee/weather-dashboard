# Railway Deployment Setup Guide

## Current Railway URL
🚂 Backend: `https://sweet-peace-production-1155.up.railway.app`

## Required Environment Variables in Railway

Go to your Railway project settings and add these variables:

```bash
# MongoDB Connection (REQUIRED)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/weather_db?retryWrites=true&w=majority

# Port (Railway auto-assigns, but good to have)
PORT=5000

# Environment
NODE_ENV=production

# CORS Origins (REQUIRED for Vercel frontend)
CORS_ORIGIN=https://weather-dashboard-sigma-three.vercel.app,https://weather-dashboard-git-main-dumeesha-tharukees-projects.vercel.app,https://weather-dashboard-git-*.vercel.app

# Optional: MongoDB Database Name
MONGODB_DB=weather_db
```

## Troubleshooting "Cannot GET /"

If you see "Cannot GET /" when visiting your Railway URL, this is **NORMAL**. Your backend only has API endpoints, not a homepage.

### Test Your API with these URLs:

1. **Health Check:**
   ```
   https://sweet-peace-production-1155.up.railway.app/api/health
   ```
   Should return: `{"status":"OK","message":"Weather Dashboard API is running"}`

2. **Get Profiles:**
   ```
   https://sweet-peace-production-1155.up.railway.app/api/profiles
   ```
   Should return: JSON array of weather profiles

3. **Get Single Profile:**
   ```
   https://sweet-peace-production-1155.up.railway.app/api/profiles/YOUR_PROFILE_ID
   ```

## How to Import Your Weather Data

1. **Make sure your `.env` file has the correct MONGODB_URI:**
   ```bash
   cd backend
   # Edit .env and add your MongoDB connection string
   ```

2. **Run the import script:**
   ```bash
   cd backend
   node import-sample-weather-data.js
   ```

3. **Verify the data was imported:**
   - Visit: `https://sweet-peace-production-1155.up.railway.app/api/profiles`
   - You should see your weather data

## Railway Deployment Checklist

- [ ] Environment variables are set in Railway dashboard
- [ ] MONGODB_URI points to your MongoDB Atlas cluster
- [ ] CORS_ORIGIN includes your Vercel frontend URLs
- [ ] Data has been imported to MongoDB
- [ ] API health check returns OK: `/api/health`
- [ ] Profiles endpoint returns data: `/api/profiles`

## Frontend Configuration

Your frontend needs to point to Railway backend. Check that [.env.production](../frontend/.env.production) has:

```bash
VITE_API_URL=https://sweet-peace-production-1155.up.railway.app
```

## Common Issues

### Issue: "Cannot GET /"
**Solution:** This is normal! Use the API endpoints like `/api/health` or `/api/profiles`

### Issue: CORS errors
**Solution:** Make sure `CORS_ORIGIN` is set correctly in Railway environment variables

### Issue: "MONGODB_URI is not set"
**Solution:** Add MONGODB_URI to Railway environment variables

### Issue: No data returned from `/api/profiles`
**Solution:** Run the import script to add data to MongoDB
