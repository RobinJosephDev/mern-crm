const authorize = (...roles) => {
  return (req, res, next) => {
    console.log("Decoded user:", req.user);
    console.log("User role:", req.user.role);
    console.log("Allowed roles:", roles);

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};

module.exports = authorize;
