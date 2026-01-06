import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

// Your weather data
const weatherData = [
  {
    "_id": "633ae821d28edcd8e6958a05",
    "timestamp": "2022-10-03T13:19:23.000Z",
    "metadata": {
      "joined_sensor_key": "temperature_humidity_pressure_coordinates",
      "soruce": "app",
      "topic": "weather"
    },
    "coordinates": [7.004486560821533, 79.94952392578125],
    "humidity": 85.44227,
    "pressure": 100740.5,
    "createAt": "2022-10-03T13:48:17.616Z",
    "temperature": 27.30923,
    "profileId": "7.004486560821533_79.94952392578125"
  },
  {
    "_id": "633c55ccd28edcd8e6958b57",
    "timestamp": "2022-10-04T15:48:06.000Z",
    "metadata": {
      "joined_sensor_key": "temperature_humidity_pressure_coordinates",
      "soruce": "app",
      "topic": "weather"
    },
    "humidity": 83.36364,
    "pressure": 100935.9,
    "createAt": "2022-10-04T15:48:28.158Z",
    "temperature": 27.53849,
    "coordinates": [7.00449275970459, 79.94951629638672],
    "profileId": "7.00449275970459_79.94951629638672"
  },
  {
    "_id": "63072336e57cbde7f7123f00",
    "timestamp": "2022-08-25T07:16:57.000Z",
    "metadata": {
      "joined_sensor_key": "temperature_humidity_pressure_coordinates",
      "soruce": "app",
      "topic": "weather"
    },
    "pressure": 100699.9,
    "humidity": 54.92973,
    "temperature": 34.19724,
    "createAt": "2022-08-25T07:22:30.941Z",
    "coordinates": [6.870453834533691, 79.8883056640625],
    "profileId": "6.870453834533691_79.8883056640625"
  },
  {
    "_id": "6327ee439d4893872561db63",
    "timestamp": "2022-09-19T03:39:19.000Z",
    "metadata": {
      "joined_sensor_key": "temperature_humidity_pressure_coordinates",
      "soruce": "app",
      "topic": "weather"
    },
    "coordinates": [7.004436492919922, 79.9495849609375],
    "temperature": 28.58219,
    "createAt": "2022-09-19T04:21:23.508Z",
    "pressure": 101164.9,
    "humidity": 83.62609,
    "profileId": "7.004436492919922_79.9495849609375"
  },
  {
    "_id": "6301aef1947af683af756e28",
    "timestamp": "2022-08-20T10:31:31.000Z",
    "metadata": {
      "joined_sensor_key": "temperature_humidity_pressure_coordinates",
      "soruce": "app",
      "topic": "weather"
    },
    "pressure": 100296,
    "humidity": 67.75284,
    "temperature": 31.57558,
    "createAt": "2022-08-21T04:05:05.438Z",
    "coordinates": [6.874466419219971, 79.8904037475586],
    "profileId": "6.874466419219971_79.8904037475586"
  }
];

// Group data by profileId to create profiles
function groupDataByProfile(data) {
  const profiles = {};
  
  data.forEach(item => {
    const profileId = item.profileId;
    if (!profiles[profileId]) {
      profiles[profileId] = {
        name: `Station ${profileId.split('_')[0].substring(0, 6)}`,
        location: getLocation(item.coordinates),
        data: []
      };
    }
    profiles[profileId].data.push(item);
  });
  
  return Object.values(profiles);
}

// Simple location detector based on coordinates
function getLocation(coords) {
  const [lat, lon] = coords;
  
  // Rough location detection for Sri Lanka
  if (lat > 7.0 && lon > 79.9) return 'Colombo Area';
  if (lat < 6.9 && lon < 79.9) return 'Southern Region';
  if (lat > 6.9 && lat < 7.0) return 'Western Province';
  
  return 'Sri Lanka';
}

async function importData() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('weather_db');
    const collection = db.collection('profiles');
    
    // Group data into profiles
    const profiles = groupDataByProfile(weatherData);
    
    console.log(`\n📊 Prepared ${profiles.length} profiles from ${weatherData.length} data points`);
    
    // Option 1: Clear and replace all data
    // await collection.deleteMany({});
    // console.log('🗑️  Cleared existing data');
    
    // Option 2: Insert only (will keep existing data)
    for (const profile of profiles) {
      profile.metadata = {
        source: 'Sample Weather Data',
        importedAt: new Date()
      };
      
      const result = await collection.insertOne(profile);
      console.log(`✅ Imported ${profile.name} (${profile.location}) - ${profile.data.length} data points - ID: ${result.insertedId}`);
    }
    
    const count = await collection.countDocuments();
    console.log(`\n🎉 Database now has ${count} profiles!`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

importData();
