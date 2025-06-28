module.exports = {
  isAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ error: 'Unauthorized' });
  },
  
  hasRole: (role) => {
    return (req, res, next) => {
      if (req.isAuthenticated() && req.user.role === role) {
        return next();
      }
      res.status(403).json({ error: 'Forbidden' });
    }
  }
};