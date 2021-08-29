const authorize = (roles = []) => {
  if (typeof roles === 'string') {
      roles = [roles];
  }
  return [
      (req, res, next) => {
        if (!req.isServiceCall && roles.length && !roles.includes(req.user.role)) {
          return res.send(400).json({ msg: "You do not have permission to access to this resource." });
        }
        return next();
      }
  ];
}

module.exports = authorize;