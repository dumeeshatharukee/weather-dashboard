import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
let db;
let client;

async function connectDB() {
  if (db) {
    return db;
  }
  
  try {
    if (!client) {
      client = new MongoClient(process.env.MONGODB_URI);
    }
    await client.connect();
    db = client.db('weather_db');
    console.log('✅ Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

// Helper function to get latest coordinates for a profile
function getLatestCoordinates(profile) {
  if (!profile.data || profile.data.length === 0) {
    return { lat: null, lng: null, timestamp: null };
  }

  const sortedData = [...profile.data].sort((a, b) => {
    const dateA = new Date(a.timestamp?.$date || a.timestamp || a.date || 0);
    const dateB = new Date(b.timestamp?.$date || b.timestamp || b.date || 0);
    return dateB - dateA;
  });

  const latest = sortedData[0];
  const coords = latest.coordinates || [];
  return {
    lat: coords[0] || latest.latitude || latest.lat || null,
    lng: coords[1] || latest.longitude || latest.lng || latest.lon || null,
    timestamp: latest.timestamp?.$date || latest.timestamp || latest.date || null
  };
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Weather Dashboard API is running' });
});

app.get('/api/profiles', async (req, res) => {
  try {
    await connectDB();
    const profiles = await db.collection('profiles').find({}).toArray();
    
    const profilesWithLatest = profiles.map(profile => {
      const { lat, lng, timestamp } = getLatestCoordinates(profile);
      return {
        _id: profile._id,
        name: profile.name || profile.profile_name || profile.location || `Weather Station ${profile._id}`,
        location: profile.location || 'Nuwara Eliya, Sri Lanka',
        latestCoordinates: {
          latitude: lat,
          longitude: lng,
          timestamp: timestamp
        },
        totalDataPoints: profile.data ? profile.data.length : 0
      };
    });

    res.json({
      success: true,
      count: profilesWithLatest.length,
      data: profilesWithLatest
    });
  } catch (error) {
    console.error('Error fetching profiles:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profiles',
      error: error.message
    });
  }
});

app.get('/api/profiles/:id', async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid profile ID'
      });
    }

    const profile = await db.collection('profiles').findOne({ _id: new ObjectId(id) });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    const { lat, lng, timestamp } = getLatestCoordinates(profile);

    res.json({
      success: true,
      data: {
        _id: profile._id,
        name: profile.name || profile.profile_name || `Profile ${profile._id}`,
        location: profile.location || 'Sri Lanka',
        latestCoordinates: {
          latitude: lat,
          longitude: lng,
          timestamp: timestamp
        },
        totalDataPoints: profile.data ? profile.data.length : 0,
        metadata: profile.metadata || {}
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
});

app.get('/api/profiles/:id/timeseries', async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid profile ID'
      });
    }

    const profile = await db.collection('profiles').findOne({ _id: new ObjectId(id) });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    if (!profile.data || profile.data.length === 0) {
      return res.json({
        success: true,
        profileId: id,
        profileName: profile.name || profile.profile_name || 'Unknown',
        data: []
      });
    }

    const formattedData = profile.data.map(entry => {
      const timestamp = entry.timestamp?.$date || entry.timestamp || entry.date;
      return {
        timestamp: timestamp,
        temperature: entry.temperature || entry.temp || null,
        humidity: entry.humidity || null,
        pressure: entry.pressure || null,
        windSpeed: entry.wind_speed || entry.windSpeed || null,
        rainfall: entry.rainfall || entry.rain || null,
        coordinates: entry.coordinates || [entry.latitude || entry.lat, entry.longitude || entry.lng]
      };
    }).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    res.json({
      success: true,
      profileId: id,
      profileName: profile.name || profile.profile_name || 'Unknown',
      location: profile.location || 'Sri Lanka',
      totalDataPoints: formattedData.length,
      data: formattedData
    });
  } catch (error) {
    console.error('Error fetching time series:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching time series data',
      error: error.message
    });
  }
});

export default app;

