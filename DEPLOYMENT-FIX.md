# Weather Dashboard Deployment Guide

## Quick Fix: "No Fetch Data" Issue

### Problem
Frontend deployed on Vercel can't fetch data from Railway backend API.

### Solutions

#### Option 1: Allow All Origins (Simplest - Good for Testing)
**In Railway (Backend Service) → Variables:**
- **Remove** or **don't set** `CORS_ORIGIN` variable
- This allows requests from any domain

#### Option 2: Restrict to Specific Domains (Production - Recommended)
**In Railway (Backend Service) → Variables:**
- Set `CORS_ORIGIN` to include all your Vercel deployment URLs (comma-separated):
```
https://weather-dashboard-sigma-three.vercel.app,https://weather-dashboard-git-main-dumeesha-tharukees-projects.vercel.app
```

**Note:** Vercel creates multiple URLs:
- Production: `https://your-app.vercel.app`
- Preview/Branch: `https://your-app-git-branch-name-username.vercel.app`
- You may use wildcards in browser testing but Railway Variables require explicit URLs

### Railway Environment Variables Checklist

**Required:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/weather_db?retryWrites=true&w=majority
```

**Optional:**
```
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://your-vercel-domain.com
```

### Vercel Environment Variables Checklist

**Required (Production AND Preview):**
```
VITE_API_URL=https://sweet-peace-production-1155.up.railway.app
```

**Note:** After setting env vars in Vercel, you MUST redeploy (env vars are baked at build time).

### Testing the API

1. **Test Railway API directly (should return JSON):**
   - https://sweet-peace-production-1155.up.railway.app/api/health
   - https://sweet-peace-production-1155.up.railway.app/api/profiles

2. **Test from browser console on Vercel site:**
   ```javascript
   fetch('https://sweet-peace-production-1155.up.railway.app/api/profiles')
     .then(r => r.json())
     .then(d => console.log(d))
     .catch(e => console.error('Error:', e))
   ```

3. **Check browser DevTools:**
   - Open Network tab
   - Refresh Vercel page
   - Look for `/api/profiles` request
   - If it shows "CORS error" → fix CORS_ORIGIN in Railway
   - If it shows "localhost:5000" → redeploy Vercel with correct VITE_API_URL

### Common Issues

**Issue: "Failed to fetch profiles"**
- Cause: Frontend is calling `http://localhost:5000` instead of Railway URL
- Fix: Set `VITE_API_URL` in Vercel → Redeploy

**Issue: "CORS policy blocked"**
- Cause: Railway has `CORS_ORIGIN` set but doesn't include Vercel domain
- Fix: Update `CORS_ORIGIN` in Railway → Redeploy backend

**Issue: "Network error" or "ERR_CONNECTION_REFUSED"**
- Cause: Railway backend is down or MongoDB connection failed
- Fix: Check Railway logs, verify `MONGODB_URI` is set correctly

**Issue: Map shows but no markers**
- Cause: MongoDB has no data or data structure is wrong
- Fix: Import sample data from `sample-data/` folder

## Deployment Steps Summary

### 1. Deploy Backend to Railway
1. Connect GitHub repo to Railway
2. Set Root Directory: `backend` (or use root with workspace setup)
3. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
4. Deploy

### 2. Deploy Frontend to Vercel
1. Connect GitHub repo to Vercel
2. Set Root Directory: `frontend`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Add environment variables (Production + Preview):
   - `VITE_API_URL`: Your Railway backend URL
6. Deploy

### 3. Test
- Open Vercel URL
- Check browser console for errors
- Verify map shows 5 markers (profiles)
- Click markers to load time series charts

## Files Changed for Deployment Fix

1. **frontend/.env.production** (new)
   - Sets production API URL
   
2. **backend/server.js** (updated)
   - Improved CORS configuration with better defaults
   
3. **backend/.env.example** (updated)
   - Added CORS_ORIGIN documentation

4. **package.json** (root - new)
   - Allows Railway to build from repo root
