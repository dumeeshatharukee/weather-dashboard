# Data Import Guide

## Your Data Files

You have 4 weather data files from Kalagunaya, Sri Lanka:
- `kalagunaya_v2.V3.json`
- `kalagunaya_v2_1.json` (originally Kalagunaya_v2 (1).json)
- `kalagunaya_v2_2.json` (originally Kalagunaya_v2 (2).json)
- `kalagunaya_v2_4.json` (originally Kalagunaya_v2 (4).json)

## Data Structure

Each file contains an array of weather sensor readings with:

**Sensor Data:**
- `temperature` - Temperature in Celsius
- `humidity` - Humidity percentage
- `pressure` - Atmospheric pressure in Pascals
- `percentage_light_intensity` - Light intensity (0-100%)
- `precipitation` - Rainfall amount (some records)

**Location Data:**
- `coordinates` - Array format: `[latitude, longitude]`
  - Example: `[6.9493805, 80.7888061]` (Nuwara Eliya area)

**Timestamp:**
- `timestamp` - MongoDB date format: `{ "$date": "2023-07-29T13:03:55.000Z" }`

**Metadata:**
- `metadata` - Contains sensor info, source, and topic
- `_id` - MongoDB ObjectId
- `createAt` - Record creation timestamp

## Import Options

### Option 1: Automated Script (Easiest)

1. **Update the import script with your MongoDB URI:**
   ```bash
   # Edit import-data.js and replace the MONGODB_URI
   ```

2. **Install MongoDB driver:**
   ```bash
   cd C:\weather-dashboard\sample-data
   npm init -y
   npm install mongodb
   ```

3. **Set environment variable (or edit the script):**
   ```powershell
   $env:MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/weather_db"
   ```

4. **Run the import:**
   ```bash
   node import-data.js
   ```

### Option 2: MongoDB Compass (Recommended for Beginners)

1. **Open MongoDB Compass**
2. **Connect** to your MongoDB Atlas cluster
3. **Create/Select** database: `weather_db`
4. **Create/Select** collection: `profiles`
5. **For each JSON file:**
   - Click "ADD DATA" → "Import JSON or CSV file"
   - Select the file
   - **IMPORTANT**: Check "Array" option since files contain arrays
   - Click "Import"
   - **Wrap in profile structure manually** (see below)

**Note:** When importing via Compass, you'll need to manually create profile documents. After importing, update each document to have this structure:

```json
{
  "name": "Kalagunaya Weather Station 1",
  "location": "Nuwara Eliya, Sri Lanka",
  "data": [ /* your imported array goes here */ ],
  "metadata": {
    "source": "Kalagunaya Sensor Network",
    "topic": "weather"
  }
}
```

### Option 3: MongoDB Shell / mongoimport

```bash
# This won't work directly because data needs to be wrapped in profile structure
# Use Option 1 or 2 instead
```

## After Import

Your MongoDB `profiles` collection will have 4 documents (profiles), each containing:
- Profile information (name, location)
- Array of weather data points (hundreds to thousands of readings)
- Metadata about the sensor network

## Data Coordinates

All data points are from **Nuwara Eliya area**:
- Latitude: ~6.9493805
- Longitude: ~80.7888061

The map will display a single location but with 4 different sensor profiles that you can click to see different time periods and data sets.

## Expected Results

After successful import:
- **4 profiles** will appear on the map
- Each profile will show **hundreds/thousands** of data points
- Sensors displayed: temperature, humidity, pressure, percentage_light_intensity, and sometimes precipitation
- Time range: Data from 2023

## Troubleshooting

**Problem**: All profiles show at the same location
- **Solution**: This is correct! All data is from the same weather station in Nuwara Eliya. The different files represent different time periods or sensor groups.

**Problem**: Import script fails
- Check MongoDB URI is correct
- Ensure files are in `sample-data/` folder
- Verify MongoDB Atlas allows your IP address

**Problem**: Data doesn't display correctly
- Backend automatically handles MongoDB date format `{ "$date": "..." }`
- Backend extracts coordinates from array format `[lat, lng]`
- Check browser console for errors
