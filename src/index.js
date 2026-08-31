require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('./db');

require('./models/User');
require('./models/Event');
require('./models/Registration');

connectDB()
  .then(() => {
    console.log('Models registered:', mongoose.modelNames().join(', '));
    return mongoose.connection.close();
  })
  .catch((err) => {
    console.error('Error:', err.message);
    process.exit(1);
  });
