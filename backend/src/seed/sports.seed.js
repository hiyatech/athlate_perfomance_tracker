const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');
const Sport = require('../models/sport.model');

try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {}

dotenv.config({ path: path.join(__dirname, '../../.env') });

const sportsData = [
  { name: 'Running / Athletics', description: 'Sprint mechanics, long distance pacing, and track athletics.' },
  { name: 'Football', description: 'Ball control, short passing, tactical positioning, and agility.' },
  { name: 'Cricket', description: 'Batting strokes, bowling line & length, and fielding drills.' },
  { name: 'Basketball', description: 'Dribbling, shooting, vertical jumping, and perimeter defense.' },
  { name: 'Badminton', description: 'Explosive footwork, smash mechanics, and net precision.' },
  { name: 'Tennis', description: 'Baseline groundstrokes, serve accuracy, and court coverage.' },
  { name: 'Swimming', description: 'Stroke technique, breath control, and aerobic water endurance.' },
  { name: 'Volleyball', description: 'Vertical spike power, setting accuracy, and defensive digging.' },
  { name: 'Cycling', description: 'Cadence control, hill climbs, and leg power output.' },
  { name: 'Table Tennis', description: 'Rapid reaction speed, wrist snap strokes, and footwork.' },
  { name: 'Boxing', description: 'Punch combinations, shadow boxing, head movement, and heavy bag work.' },
  { name: 'Wrestling', description: 'Takedown power, core stability, and grappling endurance.' },
  { name: 'Hockey', description: 'Stick handling, low-stance mobility, and endurance sprints.' },
  { name: 'Kabaddi', description: 'Raiding momentum, hold defense, and explosive agility.' },
  { name: 'Gymnastics', description: 'Full-body flexibility, core poise, and kinetic balance.' }
];

async function seedSports() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('Error: MONGODB_URI is not set in .env file');
      process.exit(1);
    }

    if (mongoose.connection.readyState === 0) {
      console.log('Connecting to MongoDB Atlas...');
      await mongoose.connect(mongoUri);
    }

    await Sport.deleteMany({});
    const created = await Sport.insertMany(sportsData.map(s => ({ ...s, isActive: true })));
    console.log(`Successfully seeded ${created.length} sports into MongoDB Atlas!`);
    
    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    console.error('Error seeding sports:', error.message);
    if (require.main === module) {
      process.exit(1);
    }
  }
}

if (require.main === module) {
  seedSports();
}

module.exports = seedSports;
