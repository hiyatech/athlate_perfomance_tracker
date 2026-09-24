const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');
const Sport = require('../models/sport.model');
const Goal = require('../models/goal.model');

try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
  dns.setDefaultResultOrder('ipv4first');
} catch (e) { }

dotenv.config({ path: path.join(__dirname, '../../.env') });

const generalGoals = [
  { name: 'Increase Speed', description: 'Enhance sprint acceleration and top speed.' },
  { name: 'Increase Strength', description: 'Build maximum muscle force and power.' },
  { name: 'Improve Endurance', description: 'Sustain athletic effort over long durations.' },
  { name: 'Improve Stamina', description: 'Delay physical fatigue during intense workouts.' },
  { name: 'Improve Agility', description: 'Rapid change of direction and foot speed.' },
  { name: 'Improve Flexibility', description: 'Increase joint range of motion and mobility.' },
  { name: 'Improve Balance', description: 'Enhance postural stability and body poise.' },
  { name: 'Improve Coordination', description: 'Harmonize neuromuscular motor movements.' },
  { name: 'Improve Reaction Time', description: 'Accelerate mental processing and physical reflex.' },
  { name: 'Improve Core Strength', description: 'Strengthen abdominal and lower back stability.' }
];

const sportSpecificGoalsMap = {
  'Football': [
    'Improve Dribbling', 'Improve Passing', 'Improve Shooting',
    'Improve Ball Control', 'Improve Sprint Speed', 'Improve Defensive Skills'
  ],
  'Cricket': [
    'Improve Batting', 'Improve Bowling', 'Improve Fielding',
    'Improve Catching', 'Improve Throwing', 'Improve Running Between Wickets'
  ],
  'Badminton': [
    'Improve Smash', 'Improve Serve', 'Improve Footwork',
    'Improve Agility', 'Improve Reaction Time', 'Improve Net Play'
  ],
  'Basketball': [
    'Improve Shooting', 'Improve Dribbling', 'Improve Passing',
    'Improve Rebounding', 'Improve Defensive Footwork', 'Improve Jumping'
  ],
  'Tennis': [
    'Improve Forehand', 'Improve Backhand', 'Improve Serve',
    'Improve Volley', 'Improve Footwork', 'Improve Return of Serve'
  ]
};

async function seedGoals() {
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

    const sports = await Sport.find({});
    const sportsByName = {};
    sports.forEach(s => { sportsByName[s.name] = s._id; });

    await Goal.deleteMany({});
    const allGoalsToInsert = [];

    // 1. Add General Goals
    generalGoals.forEach(g => {
      allGoalsToInsert.push({
        name: g.name,
        type: 'general',
        sportId: null,
        description: g.description,
        isActive: true
      });
    });

    // 2. Add Sport-Specific Goals
    Object.keys(sportSpecificGoalsMap).forEach(sportName => {
      const sportId = sportsByName[sportName];
      const goalList = sportSpecificGoalsMap[sportName];

      if (sportId && goalList) {
        goalList.forEach(goalName => {
          allGoalsToInsert.push({
            name: goalName,
            type: 'sportSpecific',
            sportId: sportId,
            description: `${goalName} tailored specifically for ${sportName}.`,
            isActive: true
          });
        });
      }
    });

    const created = await Goal.insertMany(allGoalsToInsert);
    console.log(`Successfully seeded ${created.length} goals (${generalGoals.length} general, ${created.length - generalGoals.length} sport-specific) into MongoDB Atlas!`);

    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    console.error('Error seeding goals:', error.message);
    if (require.main === module) {
      process.exit(1);
    }
  }
}

if (require.main === module) {
  seedGoals();
}

module.exports = seedGoals;
