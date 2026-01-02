import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function checkDatabase() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('weather_db');
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('\n📂 Collections in weather_db:');
    collections.forEach(col => console.log(`   - ${col.name}`));
    
    // Check profiles collection
    const profilesCollection = db.collection('profiles');
    const count = await profilesCollection.countDocuments();
    console.log(`\n📊 Documents in 'profiles' collection: ${count}`);
    
    if (count > 0) {
      const profiles = await profilesCollection.find({}).limit(5).toArray();
      console.log('\n📝 Sample profiles:');
      profiles.forEach((profile, i) => {
        console.log(`   ${i + 1}. ${profile.name || 'Unnamed'} (ID: ${profile._id})`);
        console.log(`      Data points: ${profile.data ? profile.data.length : 0}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

checkDatabase();
