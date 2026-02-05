const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const env = require("../config/env");
const prisma = require("../config/prisma");
const { isTokenBlacklisted } = require("../utils/tokenBlacklist");

/**
 * Protect routes (JWT authentication)
 */
exports.protect = async (req, res, next) => {
  let token;

  // 1️⃣ Get token from header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not logged in", 401));
  }

  // 2️⃣ Check if token is blacklisted (Redis)
  const blacklisted = await isTokenBlacklisted(token);
  if (blacklisted) {
    return next(new AppError("Token has been revoked", 401));
  }

  try {
    // 3️⃣ Verify JWT
    const decoded = jwt.verify(token, env.jwtSecret);

    // 4️⃣ Check user exists in DB
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!currentUser) {
      return next(new AppError("User no longer exists", 401));
    }

    // 5️⃣ Attach user to request
    req.user = currentUser;
    next();
  } catch (err) {
    return next(new AppError("Invalid or expired token", 401));
  }
};

/**
 * Restrict access based on roles
 */
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
