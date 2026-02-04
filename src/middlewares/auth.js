const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const env = require("../config/env");
const { users } = require("../modules/auth/user.store");
const { isTokenBlacklisted } = require("../utils/tokenBlacklist");

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not logged in", 401));
  }

  // Check blacklist
  const blacklisted = await isTokenBlacklisted(token);
  if (blacklisted) {
    return next(new AppError("Token has been revoked", 401));
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);

    const currentUser = users.find((u) => u.id === decoded.id);
    if (!currentUser) {
      return next(new AppError("User no longer exists", 401));
    }

    req.user = currentUser;
    next();
  } catch (err) {
    return next(new AppError("Invalid or expired token", 401));
  }
};
