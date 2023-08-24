module.exports = {
    // Middleware to check if a user is authenticated
    isAuthenticated: (req, res, next) => {
      if (req.isAuthenticated()) {
        return next();
      }
      res.redirect('/login'); // Redirect unauthenticated users to the login page
    },
  };
  