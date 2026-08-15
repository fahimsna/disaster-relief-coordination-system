// backend/seedLocations.js
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const fs = require('fs');
const mongoose = require('mongoose');
const Location = require('./models/Locations');

const dataDir = path.join(__dirname, 'data');

const seedDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error("No MongoDB connection string found in .env");
    }

    console.log(' Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoURI);
    console.log(' Successfully connected to MongoDB Atlas!');

    const files = fs.readdirSync(dataDir).filter(file => file.endsWith('Division.json'));
    let combinedLocations = [];

    files.forEach(file => {
      const filePath = path.join(dataDir, file);
      
      try {
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const fileData = JSON.parse(rawData);

        if (Array.isArray(fileData)) {
          combinedLocations = combinedLocations.concat(fileData);
        } else {
          combinedLocations.push(fileData);
        }
        console.log(` Loaded ${file}`);
      } catch (jsonErr) {
        throw new Error(` Error parsing file "${file}": ${jsonErr.message}`);
      }
    });

    await Location.deleteMany({});
    console.log(' Cleared old location data from database.');

    await Location.insertMany(combinedLocations);
    console.log(` Successfully seeded ${combinedLocations.length} divisions into MongoDB!`);

    process.exit(0);
  } catch (error) {
    console.error(' Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDB();