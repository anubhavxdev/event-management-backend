const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const env = require("../config/env");
const { users } = require("../modules/auth/user.store");

exports.protect = (req, res, next) => {
  let token;
    //  Getting token and check of it's there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not logged in", 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, env.jwtSecret);

    // Check user still exists
    const currentUser = users.find((u) => u.id === decoded.id);
    if (!currentUser) {
      return next(new AppError("User no longer exists", 401));
    }

    // Attach user to request
    req.user = currentUser;
    next();
  } catch (err) {
    return next(new AppError("Invalid or expired token", 401));
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};
