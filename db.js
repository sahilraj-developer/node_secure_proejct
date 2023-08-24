const mongoose = require('mongoose');
const config = require('./config'); // Assuming your config file is in the same directory as db.js

const uri = 'mongodb://localhost:27017/secure';


mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = db;
