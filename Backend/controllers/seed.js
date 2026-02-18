// seed.js — creates an admin user if MONGO_URI is set and valid
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const uri = process.env.MONGO_URI;
if (!uri || uri.includes('<') || uri.includes('xxxxx')) {
  console.error('MONGO_URI not set or contains placeholders. Set a valid MONGO_URI in .env to run the seed.');
  process.exit(1);
}

(async () => {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB for seeding');
    
    // Clear existing admin users
    await User.deleteMany({});
    
    // Create admin user with password
    const user = new User({ username: 'admin', password: 'admin123', role: 'admin' });
    await user.save();
    
    console.log('✓ Admin user created successfully');
    console.log('✓ Username: admin');
    console.log('✓ Password: admin123');
    console.log('✓ You can now login to the frontend');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Seed Error:', error.message);
    process.exit(1);
  }
})();
