import { MongoClient } from 'mongodb';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const files = [
  { path: 'C:\\Users\\Dumeesha\\Downloads\\kalagunaya_v2.V3.json', name: 'Kalagunaya Profile 1', location: 'Nuwara Eliya' },
  { path: 'C:\\Users\\Dumeesha\\Downloads\\Kalagunaya_v2 (1).json', name: 'Kalagunaya Profile 2', location: 'Nuwara Eliya' },
  { path: 'C:\\Users\\Dumeesha\\Downloads\\Kalagunaya_v2 (2).json', name: 'Kalagunaya Profile 3', location: 'Nuwara Eliya' },
  { path: 'C:\\Users\\Dumeesha\\Downloads\\Kalagunaya_v2 (4).json', name: 'Kalagunaya Profile 4', location: 'Nuwara Eliya' },
  { path: 'C:\\Users\\Dumeesha\\Downloads\\Kalagunaya_v2 (5).json', name: 'Kalagunaya Profile 5', location: 'Nuwara Eliya' }
];

async function importData() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('weather_db');
    const collection = db.collection('profiles');
    
    // Clear existing data
    await collection.deleteMany({});
    console.log('🗑️  Cleared existing data');
    
    // Import each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(`\n📂 Reading ${file.path}...`);
      
      const rawData = readFileSync(file.path, 'utf8');
      const data = JSON.parse(rawData);
      
      console.log(`   Found ${data.length} data points`);
      
      const profile = {
        name: file.name,
        location: file.location,
        data: data,
        metadata: {
          source: 'Kalagunaya Weather Station',
          originalFile: file.path.split('\\').pop(),
          importedAt: new Date()
        }
      };
      
      const result = await collection.insertOne(profile);
      console.log(`   ✅ Imported as ${result.insertedId}`);
    }
    
    const count = await collection.countDocuments();
    console.log(`\n🎉 Successfully imported ${count} profiles!`);
    
    // Show sample
    const samples = await collection.find({}).limit(4).toArray();
    console.log('\n📊 Imported Profiles:');
    samples.forEach((profile, i) => {
      console.log(`   ${i + 1}. ${profile.name} - ${profile.data.length} data points`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

importData();
