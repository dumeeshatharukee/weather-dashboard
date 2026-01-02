import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
let db;
const client = new MongoClient(process.env.MONGODB_URI);

async function connectDB() {
  try {
    await client.connect();
    db = client.db('weather_db');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// Helper function to get latest coordinates for a profile
function getLatestCoordinates(profile) {
  if (!profile.data || profile.data.length === 0) {
    return { lat: null, lng: null, timestamp: null };
  }

  // Sort by timestamp to get the latest entry
  const sortedData = [...profile.data].sort((a, b) => {
    const dateA = new Date(a.timestamp?.$date || a.timestamp || a.date || 0);
    const dateB = new Date(b.timestamp?.$date || b.timestamp || b.date || 0);
    return dateB - dateA;
  });

  const latest = sortedData[0];
  // Handle coordinates array [lat, lng] format
  const coords = latest.coordinates || [];
  return {
    lat: coords[0] || latest.latitude || latest.lat || null,
    lng: coords[1] || latest.longitude || latest.lng || latest.lon || null,
    timestamp: latest.timestamp?.$date || latest.timestamp || latest.date || null
  };
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Weather Dashboard API is running' });
});

// Get all profiles with latest coordinates
app.get('/api/profiles', async (req, res) => {
  try {
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
        totalDataPoints: profile.data ? profile.data.length : 0,
        metadata: profile.metadata || {}
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

// Get specific profile by ID
app.get('/api/profiles/:id', async (req, res) => {
  try {
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

// Get time series data for a specific profile
app.get('/api/profiles/:id/timeseries', async (req, res) => {
  try {
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

    // Sort time series data by timestamp
    const timeSeriesData = profile.data ? [...profile.data].sort((a, b) => {
      const dateA = new Date(a.timestamp?.$date || a.timestamp || a.date || 0);
      const dateB = new Date(b.timestamp?.$date || b.timestamp || b.date || 0);
      return dateA - dateB;
    }) : [];

    // Process data to flatten MongoDB date format and extract coordinates
    const processedData = timeSeriesData.map(item => {
      const processed = { ...item };
      // Convert MongoDB date format to ISO string
      if (item.timestamp?.$date) {
        processed.timestamp = item.timestamp.$date;
      }
      // Extract coordinates from array
      if (item.coordinates && Array.isArray(item.coordinates)) {
        processed.latitude = item.coordinates[0];
        processed.longitude = item.coordinates[1];
      }
      return processed;
    });

    // Extract sensor types from the data
    const sensorTypes = new Set();
    if (processedData.length > 0) {
      Object.keys(processedData[0]).forEach(key => {
        if (key !== 'timestamp' && key !== 'date' && key !== 'latitude' && 
            key !== 'longitude' && key !== 'lat' && key !== 'lng' && key !== 'lon' &&
            key !== 'coordinates' && key !== '_id' && key !== 'createAt' && 
            key !== 'metadata') {
          sensorTypes.add(key);
        }
      });
    }

    res.json({
      success: true,
      profileId: id,
      profileName: profile.name || profile.profile_name || profile.location || `Weather Station ${id}`,
      location: profile.location || 'Sri Lanka',
      dataPoints: processedData.length,
      sensors: Array.from(sensorTypes),
      data: processedData,
      metadata: profile.metadata || {}
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

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n👋 Shutting down gracefully...');
  await client.close();
  process.exit(0);
});
