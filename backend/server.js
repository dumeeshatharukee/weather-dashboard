import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = Number.parseInt(process.env.PORT || '5000', 10);
const HOST = process.env.HOST || '0.0.0.0';

// Middleware
const corsOrigin = process.env.CORS_ORIGIN;
if (corsOrigin) {
  app.use(
    cors({
      origin: corsOrigin
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean),
    })
  );
} else {
  app.use(cors());
}
app.use(express.json());

// MongoDB Connection
let db;
let client;

async function connectDB() {
  if (db) {
    return db;
  }
  
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not set');
    }

    if (!client) {
      client = new MongoClient(mongoUri);
    }
    await client.connect();
    db = client.db(process.env.MONGODB_DB || 'weather_db');
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

// Get time series data for a specific profile
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

// Export for Vercel serverless
export default app;

// Start server (Railway/local). Avoid listening when deployed as serverless.
const isServerless = Boolean(process.env.VERCEL);
if (!isServerless) {
  app.listen(PORT, HOST, () => {
    console.log(`🚀 Server running on http://${HOST}:${PORT}`);
  });
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n👋 Shutting down gracefully...');
  if (client) {
    await client.close();
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n👋 Shutting down gracefully...');
  if (client) {
    await client.close();
  }
  process.exit(0);
});
