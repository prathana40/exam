 require('dotenv').config(); // load .env variables

// PORT from .env, fallback to 4000
const PORT = process.env.PORT || 4000;

// Choose MONGO_URI based on environment, fallback to local defaults
const MONGO_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGO_URI || 'mongodb://localhost:27017/workoutdb_test'
    : process.env.MONGO_URI || 'mongodb://localhost:27017/workoutdb';

// Debugging: check if dotenv loaded correctly
console.log('Loaded config:', { PORT, MONGO_URI });

module.exports = {
  PORT,
  MONGO_URI,
};
