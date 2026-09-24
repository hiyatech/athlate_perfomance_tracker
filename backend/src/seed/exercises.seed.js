const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');

const Sport = require('../models/sport.model');
const Goal = require('../models/goal.model');
const Exercise = require('../models/exercise.model');

try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {}

dotenv.config({ path: path.join(__dirname, '../../.env') });

const generalExercisesData = [
  // Increase Speed
  { name: '50m Sprint', goalName: 'Increase Speed', unitType: 'distance', instructions: 'Sprint 50m at maximum effort with full arm drive.' },
  { name: 'Interval Sprint', goalName: 'Increase Speed', unitType: 'duration', instructions: 'Sprint 30 seconds followed by 60 seconds recovery walk.' },
  { name: 'Hill Sprint', goalName: 'Increase Speed', unitType: 'distance', instructions: 'Explosive sprint up an incline to build stride power.' },
  { name: 'Acceleration Run', goalName: 'Increase Speed', unitType: 'distance', instructions: 'Gradual buildup to 100% top speed over 40 meters.' },
  { name: 'High Knees', goalName: 'Increase Speed', unitType: 'duration', instructions: 'Drive knees up rapidly towards chest in quick cadence.' },

  // Increase Strength
  { name: 'Squats', goalName: 'Increase Strength', unitType: 'reps', instructions: 'Lower hips until thighs are parallel to ground, press up through heels.' },
  { name: 'Lunges', goalName: 'Increase Strength', unitType: 'reps', instructions: 'Step forward landing at 90-degree knee angles.' },
  { name: 'Push-ups', goalName: 'Increase Strength', unitType: 'reps', instructions: 'Lower chest to floor, press up maintaining straight rigid torso.' },
  { name: 'Deadlift', goalName: 'Increase Strength', unitType: 'reps', instructions: 'Hinge hips back, keep back flat, stand up with barbell.' },
  { name: 'Pull-ups', goalName: 'Increase Strength', unitType: 'reps', instructions: 'Pull body up until chin clears the bar, lower under control.' },

  // Improve Endurance
  { name: 'Long Distance Running', goalName: 'Improve Endurance', unitType: 'distance', instructions: 'Maintain steady aerobic heart rate pace over long distance.' },
  { name: 'Tempo Run', goalName: 'Improve Endurance', unitType: 'duration', instructions: 'Run at sustained threshold pace for 20 minutes.' },
  { name: 'Interval Running', goalName: 'Improve Endurance', unitType: 'duration', instructions: 'Alternate high effort intervals with recovery periods.' },
  { name: 'Cycling', goalName: 'Improve Endurance', unitType: 'duration', instructions: 'Maintain steady pedal cadence at Zone 2 aerobic intensity.' },
  { name: 'Stair Climbing', goalName: 'Improve Endurance', unitType: 'duration', instructions: 'Continuous step climb targeting cardiovascular endurance.' },

  // Improve Stamina
  { name: 'Jogging', goalName: 'Improve Stamina', unitType: 'duration', instructions: 'Light steady jogging to build aerobic base stamina.' },
  { name: 'Jump Rope', goalName: 'Improve Stamina', unitType: 'duration', instructions: 'Maintain continuous skipping rhythm on balls of feet.' },
  { name: 'Burpees', goalName: 'Improve Stamina', unitType: 'reps', instructions: 'Drop into push-up, jump feet in, explode vertically into jump.' },
  { name: 'Circuit Training', goalName: 'Improve Stamina', unitType: 'duration', instructions: 'Rotate through full-body exercises with minimal rest.' },
  { name: 'HIIT', goalName: 'Improve Stamina', unitType: 'duration', instructions: 'High intensity effort bursts followed by brief recovery intervals.' },

  // Improve Agility
  { name: 'Ladder Drills', goalName: 'Improve Agility', unitType: 'reps', instructions: 'Quick footwork drills through agility ladder rungs.' },
  { name: 'Cone Drills', goalName: 'Improve Agility', unitType: 'reps', instructions: 'Weave and shuffle between cone markers at high speed.' },
  { name: 'Shuttle Run', goalName: 'Improve Agility', unitType: 'distance', instructions: 'Sprint 10m, touch line, turn and sprint back.' },
  { name: 'T-Drill', goalName: 'Improve Agility', unitType: 'reps', instructions: 'Sprint forward, side-shuffle left, shuffle right, backpedal back.' },
  { name: 'Lateral Hops', goalName: 'Improve Agility', unitType: 'reps', instructions: 'Explosive side-to-side bounds over marker line.' },

  // Improve Flexibility
  { name: 'Hamstring Stretch', goalName: 'Improve Flexibility', unitType: 'duration', instructions: 'Hold static stretch targeting rear leg muscle fibers.' },
  { name: 'Quad Stretch', goalName: 'Improve Flexibility', unitType: 'duration', instructions: 'Pull ankle towards glute keeping knees aligned.' },
  { name: 'Hip Flexor Stretch', goalName: 'Improve Flexibility', unitType: 'duration', instructions: 'Lunge position pushing hips forward to stretch flexors.' },
  { name: 'Shoulder Stretch', goalName: 'Improve Flexibility', unitType: 'duration', instructions: 'Cross arm across chest and pull gently with opposite hand.' },
  { name: 'Leg Swings', goalName: 'Improve Flexibility', unitType: 'reps', instructions: 'Dynamic front-to-back and side-to-side leg swings.' },

  // Improve Balance
  { name: 'Single-Leg Stand', goalName: 'Improve Balance', unitType: 'duration', instructions: 'Balance on one leg keeping core engaged.' },
  { name: 'Single-Leg Squat', goalName: 'Improve Balance', unitType: 'reps', instructions: 'Squat down on single leg while extending opposite leg.' },
  { name: 'Heel-to-Toe Walk', goalName: 'Improve Balance', unitType: 'reps', instructions: 'Walk in straight line placing heel directly in front of toe.' },
  { name: 'Single-Leg Deadlift', goalName: 'Improve Balance', unitType: 'reps', instructions: 'Hinge at hip on single leg while extending rear leg back.' },
  { name: 'Balance Board Exercise', goalName: 'Improve Balance', unitType: 'duration', instructions: 'Maintain center of gravity on wobble balance board.' },

  // Improve Coordination
  { name: 'Ball Toss', goalName: 'Improve Coordination', unitType: 'reps', instructions: 'Toss ball against wall and catch with alternating hands.' },
  { name: 'Catching Drill', goalName: 'Improve Coordination', unitType: 'reps', instructions: 'Hand-eye coordination catching drills at varied speeds.' },
  { name: 'Reaction Ball', goalName: 'Improve Coordination', unitType: 'reps', instructions: 'Bounce unpredictable multi-sided reaction ball and catch.' },

  // Improve Reaction Time
  { name: 'Partner Reaction Drill', goalName: 'Improve Reaction Time', unitType: 'reps', instructions: 'React instantly to partner hand drops or signals.' },
  { name: 'Catch-and-React', goalName: 'Improve Reaction Time', unitType: 'reps', instructions: 'Rapid response catching drill on unpredictable cue.' },
  { name: 'Light Reaction Drill', goalName: 'Improve Reaction Time', unitType: 'duration', instructions: 'Tap illuminated reaction targets as quickly as possible.' },
  { name: 'Direction Change Drill', goalName: 'Improve Reaction Time', unitType: 'reps', instructions: 'Sprint and change direction on audio or visual cue.' },

  // Improve Core Strength
  { name: 'Plank', goalName: 'Improve Core Strength', unitType: 'duration', instructions: 'Hold straight forearm plank position keeping core braced.' },
  { name: 'Side Plank', goalName: 'Improve Core Strength', unitType: 'duration', instructions: 'Side forearm hold strengthening obliques and hip stabilizers.' },
  { name: 'Russian Twists', goalName: 'Improve Core Strength', unitType: 'reps', instructions: 'Rotate torso side to side from seated V-position.' },
  { name: 'Bicycle Crunches', goalName: 'Improve Core Strength', unitType: 'reps', instructions: 'Alternate elbow to opposite knee crunching motion.' },
  { name: 'Dead Bug', goalName: 'Improve Core Strength', unitType: 'reps', instructions: 'Lower opposite arm and leg while pressing lower back flat.' }
];

const sportSpecificExercisesData = [
  // Football
  { sportName: 'Football', goalName: 'Improve Dribbling', name: 'Dribbling', unitType: 'duration' },
  { sportName: 'Football', goalName: 'Improve Passing', name: 'Short Passing', unitType: 'reps' },
  { sportName: 'Football', goalName: 'Improve Passing', name: 'Long Passing', unitType: 'reps' },
  { sportName: 'Football', goalName: 'Improve Shooting', name: 'Shooting', unitType: 'reps' },
  { sportName: 'Football', goalName: 'Improve Ball Control', name: 'Ball Control', unitType: 'duration' },
  { sportName: 'Football', goalName: 'Improve Ball Control', name: 'First Touch', unitType: 'reps' },
  { sportName: 'Football', goalName: 'Improve Passing', name: 'Crossing', unitType: 'reps' },
  { sportName: 'Football', goalName: 'Improve Ball Control', name: 'Heading', unitType: 'reps' },
  { sportName: 'Football', goalName: 'Improve Sprint Speed', name: 'Sprint With Ball', unitType: 'distance' },
  { sportName: 'Football', goalName: 'Improve Dribbling', name: 'Cone Dribbling', unitType: 'reps' },
  { sportName: 'Football', goalName: 'Improve Sprint Speed', name: 'Agility Ladder', unitType: 'duration' },
  { sportName: 'Football', goalName: 'Improve Defensive Skills', name: 'Defensive Footwork', unitType: 'duration' },
  { sportName: 'Football', goalName: 'Improve Sprint Speed', name: 'Change of Direction', unitType: 'reps' },
  { sportName: 'Football', goalName: 'Improve Ball Control', name: 'Small-Sided Game', unitType: 'duration' },

  // Cricket
  { sportName: 'Cricket', goalName: 'Improve Batting', name: 'Batting Practice', unitType: 'duration' },
  { sportName: 'Cricket', goalName: 'Improve Batting', name: 'Front-Foot Drive', unitType: 'reps' },
  { sportName: 'Cricket', goalName: 'Improve Batting', name: 'Back-Foot Shot', unitType: 'reps' },
  { sportName: 'Cricket', goalName: 'Improve Batting', name: 'Defensive Shot', unitType: 'reps' },
  { sportName: 'Cricket', goalName: 'Improve Batting', name: 'Pull Shot', unitType: 'reps' },
  { sportName: 'Cricket', goalName: 'Improve Batting', name: 'Cut Shot', unitType: 'reps' },
  { sportName: 'Cricket', goalName: 'Improve Batting', name: 'Straight Drive', unitType: 'reps' },
  { sportName: 'Cricket', goalName: 'Improve Bowling', name: 'Bowling Practice', unitType: 'duration' },
  { sportName: 'Cricket', goalName: 'Improve Bowling', name: 'Run-Up Practice', unitType: 'reps' },
  { sportName: 'Cricket', goalName: 'Improve Bowling', name: 'Line and Length Bowling', unitType: 'reps' },
  { sportName: 'Cricket', goalName: 'Improve Bowling', name: 'Yorker Practice', unitType: 'reps' },
  { sportName: 'Cricket', goalName: 'Improve Bowling', name: 'Bouncer Practice', unitType: 'reps' },
  { sportName: 'Cricket', goalName: 'Improve Catching', name: 'Catching', unitType: 'reps' },
  { sportName: 'Cricket', goalName: 'Improve Fielding', name: 'Ground Fielding', unitType: 'reps' },
  { sportName: 'Cricket', goalName: 'Improve Throwing', name: 'Throwing', unitType: 'reps' },
  { sportName: 'Cricket', goalName: 'Improve Catching', name: 'High Catch', unitType: 'reps' },
  { sportName: 'Cricket', goalName: 'Improve Catching', name: 'Reaction Catch', unitType: 'reps' },
  { sportName: 'Cricket', goalName: 'Improve Throwing', name: 'Direct Hit Practice', unitType: 'reps' },

  // Basketball
  { sportName: 'Basketball', goalName: 'Improve Dribbling', name: 'Dribbling', unitType: 'duration' },
  { sportName: 'Basketball', goalName: 'Improve Shooting', name: 'Shooting', unitType: 'reps' },
  { sportName: 'Basketball', goalName: 'Improve Shooting', name: 'Free Throws', unitType: 'reps' },
  { sportName: 'Basketball', goalName: 'Improve Shooting', name: 'Layups', unitType: 'reps' },
  { sportName: 'Basketball', goalName: 'Improve Passing', name: 'Passing', unitType: 'reps' },
  { sportName: 'Basketball', goalName: 'Improve Defensive Footwork', name: 'Defensive Footwork', unitType: 'duration' },
  { sportName: 'Basketball', goalName: 'Improve Rebounding', name: 'Rebounding', unitType: 'reps' },
  { sportName: 'Basketball', goalName: 'Improve Dribbling', name: 'Ball Handling', unitType: 'duration' },
  { sportName: 'Basketball', goalName: 'Improve Jumping', name: 'Sprint Training', unitType: 'distance' },
  { sportName: 'Basketball', goalName: 'Improve Defensive Footwork', name: 'Agility Training', unitType: 'duration' },
  { sportName: 'Basketball', goalName: 'Improve Jumping', name: 'Jump Training', unitType: 'reps' },

  // Badminton
  { sportName: 'Badminton', goalName: 'Improve Serve', name: 'Serve', unitType: 'reps' },
  { sportName: 'Badminton', goalName: 'Improve Smash', name: 'Smash', unitType: 'reps' },
  { sportName: 'Badminton', goalName: 'Improve Smash', name: 'Drop Shot', unitType: 'reps' },
  { sportName: 'Badminton', goalName: 'Improve Smash', name: 'Clear', unitType: 'reps' },
  { sportName: 'Badminton', goalName: 'Improve Net Play', name: 'Drive', unitType: 'reps' },
  { sportName: 'Badminton', goalName: 'Improve Net Play', name: 'Net Play', unitType: 'reps' },
  { sportName: 'Badminton', goalName: 'Improve Footwork', name: 'Footwork', unitType: 'duration' },
  { sportName: 'Badminton', goalName: 'Improve Footwork', name: 'Shadow Badminton', unitType: 'duration' },
  { sportName: 'Badminton', goalName: 'Improve Footwork', name: 'Defensive Movement', unitType: 'duration' },
  { sportName: 'Badminton', goalName: 'Improve Smash', name: 'Jump Smash', unitType: 'reps' },
  { sportName: 'Badminton', goalName: 'Improve Reaction Time', name: 'Reaction Drill', unitType: 'duration' },

  // Tennis
  { sportName: 'Tennis', goalName: 'Improve Forehand', name: 'Forehand', unitType: 'reps' },
  { sportName: 'Tennis', goalName: 'Improve Backhand', name: 'Backhand', unitType: 'reps' },
  { sportName: 'Tennis', goalName: 'Improve Serve', name: 'Serve', unitType: 'reps' },
  { sportName: 'Tennis', goalName: 'Improve Volley', name: 'Volley', unitType: 'reps' },
  { sportName: 'Tennis', goalName: 'Improve Serve', name: 'Smash', unitType: 'reps' },
  { sportName: 'Tennis', goalName: 'Improve Footwork', name: 'Footwork', unitType: 'duration' },
  { sportName: 'Tennis', goalName: 'Improve Forehand', name: 'Baseline Rally', unitType: 'duration' },
  { sportName: 'Tennis', goalName: 'Improve Footwork', name: 'Net Movement', unitType: 'duration' },
  { sportName: 'Tennis', goalName: 'Improve Return of Serve', name: 'Return of Serve', unitType: 'reps' },
  { sportName: 'Tennis', goalName: 'Improve Footwork', name: 'Side-to-Side Movement', unitType: 'duration' },

  // Swimming
  { sportName: 'Swimming', goalName: 'Improve Endurance', name: 'Freestyle', unitType: 'distance' },
  { sportName: 'Swimming', goalName: 'Improve Endurance', name: 'Backstroke', unitType: 'distance' },
  { sportName: 'Swimming', goalName: 'Improve Endurance', name: 'Breaststroke', unitType: 'distance' },
  { sportName: 'Swimming', goalName: 'Improve Endurance', name: 'Butterfly', unitType: 'distance' },
  { sportName: 'Swimming', goalName: 'Improve Stamina', name: 'Kickboard', unitType: 'distance' },
  { sportName: 'Swimming', goalName: 'Improve Strength', name: 'Pull Buoy', unitType: 'distance' },
  { sportName: 'Swimming', goalName: 'Increase Speed', name: 'Sprint Swimming', unitType: 'distance' },
  { sportName: 'Swimming', goalName: 'Improve Endurance', name: 'Distance Swimming', unitType: 'distance' },
  { sportName: 'Swimming', goalName: 'Improve Stamina', name: 'Breathing Practice', unitType: 'duration' },
  { sportName: 'Swimming', goalName: 'Improve Coordination', name: 'Stroke Technique', unitType: 'duration' },
  { sportName: 'Swimming', goalName: 'Improve Agility', name: 'Turn Practice', unitType: 'reps' },

  // Volleyball
  { sportName: 'Volleyball', goalName: 'Increase Strength', name: 'Serving', unitType: 'reps' },
  { sportName: 'Volleyball', goalName: 'Improve Coordination', name: 'Passing', unitType: 'reps' },
  { sportName: 'Volleyball', goalName: 'Improve Coordination', name: 'Setting', unitType: 'reps' },
  { sportName: 'Volleyball', goalName: 'Increase Strength', name: 'Spiking', unitType: 'reps' },
  { sportName: 'Volleyball', goalName: 'Increase Strength', name: 'Blocking', unitType: 'reps' },
  { sportName: 'Volleyball', goalName: 'Improve Agility', name: 'Digging', unitType: 'reps' },
  { sportName: 'Volleyball', goalName: 'Increase Strength', name: 'Jump Training', unitType: 'reps' },
  { sportName: 'Volleyball', goalName: 'Improve Reaction Time', name: 'Reaction Training', unitType: 'duration' },
  { sportName: 'Volleyball', goalName: 'Improve Agility', name: 'Footwork', unitType: 'duration' },
  { sportName: 'Volleyball', goalName: 'Improve Agility', name: 'Defensive Movement', unitType: 'duration' },

  // Cycling
  { sportName: 'Cycling', goalName: 'Increase Speed', name: 'Sprint Cycling', unitType: 'distance' },
  { sportName: 'Cycling', goalName: 'Increase Strength', name: 'Hill Climbing', unitType: 'duration' },
  { sportName: 'Cycling', goalName: 'Improve Endurance', name: 'Long Distance Ride', unitType: 'distance' },
  { sportName: 'Cycling', goalName: 'Improve Stamina', name: 'Interval Cycling', unitType: 'duration' },
  { sportName: 'Cycling', goalName: 'Improve Coordination', name: 'Cadence Training', unitType: 'duration' },
  { sportName: 'Cycling', goalName: 'Improve Endurance', name: 'Endurance Ride', unitType: 'distance' },
  { sportName: 'Cycling', goalName: 'Increase Speed', name: 'Time Trial', unitType: 'distance' },
  { sportName: 'Cycling', goalName: 'Improve Flexibility', name: 'Recovery Ride', unitType: 'duration' },

  // Boxing
  { sportName: 'Boxing', goalName: 'Improve Stamina', name: 'Shadow Boxing', unitType: 'duration' },
  { sportName: 'Boxing', goalName: 'Increase Strength', name: 'Jab', unitType: 'reps' },
  { sportName: 'Boxing', goalName: 'Increase Strength', name: 'Cross', unitType: 'reps' },
  { sportName: 'Boxing', goalName: 'Increase Strength', name: 'Hook', unitType: 'reps' },
  { sportName: 'Boxing', goalName: 'Increase Strength', name: 'Uppercut', unitType: 'reps' },
  { sportName: 'Boxing', goalName: 'Improve Agility', name: 'Footwork', unitType: 'duration' },
  { sportName: 'Boxing', goalName: 'Increase Strength', name: 'Heavy Bag', unitType: 'duration' },
  { sportName: 'Boxing', goalName: 'Improve Reaction Time', name: 'Speed Bag', unitType: 'duration' },
  { sportName: 'Boxing', goalName: 'Improve Agility', name: 'Defensive Movement', unitType: 'duration' },
  { sportName: 'Boxing', goalName: 'Improve Reaction Time', name: 'Reaction Drill', unitType: 'duration' },
  { sportName: 'Boxing', goalName: 'Improve Coordination', name: 'Combination Training', unitType: 'duration' },
  { sportName: 'Boxing', goalName: 'Improve Stamina', name: 'Skipping', unitType: 'duration' }
];

async function seedExercises() {
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
    const goals = await Goal.find({});

    const sportsByName = {};
    sports.forEach(s => { sportsByName[s.name] = s._id; });

    const goalsByName = {};
    goals.forEach(g => { goalsByName[g.name] = g._id; });

    await Exercise.deleteMany({});
    const exercisesToInsert = [];

    // 1. Map General Exercises
    generalExercisesData.forEach(ex => {
      const goalId = goalsByName[ex.goalName] || null;
      exercisesToInsert.push({
        name: ex.name,
        type: 'general',
        sportId: null,
        goalId: goalId,
        difficulty: 'beginner',
        unitType: ex.unitType,
        description: `General athletic exercise for ${ex.goalName}.`,
        instructions: ex.instructions || `Perform ${ex.name} focusing on proper technique.`,
        isActive: true
      });
    });

    // 2. Map Sport-Specific Exercises
    sportSpecificExercisesData.forEach(ex => {
      const sportId = sportsByName[ex.sportName] || null;
      const goalId = goalsByName[ex.goalName] || null;

      exercisesToInsert.push({
        name: ex.name,
        type: 'sportSpecific',
        sportId: sportId,
        goalId: goalId,
        difficulty: 'beginner',
        unitType: ex.unitType,
        description: `${ex.sportName} specific training exercise.`,
        instructions: `Perform ${ex.name} focusing on sport-specific movement mechanics.`,
        isActive: true
      });
    });

    const created = await Exercise.insertMany(exercisesToInsert);
    console.log(`Successfully seeded ${created.length} exercises (${generalExercisesData.length} general, ${sportSpecificExercisesData.length} sport-specific) into MongoDB Atlas!`);

    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    console.error('Error seeding exercises:', error.message);
    if (require.main === module) {
      process.exit(1);
    }
  }
}

if (require.main === module) {
  seedExercises();
}

module.exports = seedExercises;
