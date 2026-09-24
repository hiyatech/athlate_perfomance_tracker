const mongoose = require('mongoose');
const dns = require('dns');

// Configure Google Public DNS for MongoDB Atlas SRV resolution on Windows
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {
  // Ignore if DNS override is restricted
}

// Connect to MongoDB Atlas cluster
async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error('Error: MONGODB_URI is not set in .env file.');
    return;
  }

  try {
    console.log('Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log(`MongoDB Connected successfully to Atlas: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
  }
}

module.exports = connectDB;
