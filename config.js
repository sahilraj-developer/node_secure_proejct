module.exports = {
    mongodbURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/secure', // Use the environment variable or a default value
    sessionSecret: process.env.SESSION_SECRET || 'your-session-secret', // Use the environment variable or a default value
  };