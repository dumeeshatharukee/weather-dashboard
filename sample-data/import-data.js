const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// MongoDB connection URI - UPDATE THIS WITH YOUR MONGODB URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://username:password@cluster.mongodb.net/weather_db?retryWrites=true&w=majority';

async function importData() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('weather_db');
    const collection = db.collection('profiles');

    // Clear existing data (optional - remove this if you want to keep existing data)
    const deleteResult = await collection.deleteMany({});
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing documents`);

    // List of data files to import
    const dataFiles = [
      'kalagunaya_v2.V3.json',
      'kalagunaya_v2_1.json',
      'kalagunaya_v2_2.json',
      'kalagunaya_v2_4.json'
    ];

    let totalImported = 0;

    // Import each file
    for (const fileName of dataFiles) {
      const filePath = path.join(__dirname, fileName);
      
      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${fileName}`);
        continue;
      }

      console.log(`\n📂 Reading ${fileName}...`);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(fileContent);

      // Create a profile document
      const profile = {
        name: `Kalagunaya Weather Station - ${fileName.replace('.json', '')}`,
        profile_name: `Kalagunaya Weather Station - ${fileName.replace('.json', '')}`,
        location: 'Nuwara Eliya, Sri Lanka',
        data: data,
        metadata: {
          source: 'Kalagunaya Sensor Network',
          topic: 'weather',
          importDate: new Date(),
          originalFile: fileName,
          dataPoints: data.length
        }
      };

      const result = await collection.insertOne(profile);
      console.log(`✅ Imported ${data.length} data points as profile: ${result.insertedId}`);
      totalImported += data.length;
    }

    console.log(`\n🎉 Import complete! Total data points: ${totalImported}`);
    console.log(`📊 Total profiles: ${dataFiles.length}`);

  } catch (error) {
    console.error('❌ Error importing data:', error);
  } finally {
    await client.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run the import
importData();
