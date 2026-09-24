const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas and start server
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Athlete Performance Tracker Server running on port ${PORT}`);
  });
}

startServer();
