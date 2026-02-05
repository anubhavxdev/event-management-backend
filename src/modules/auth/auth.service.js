const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../../config/prisma");
const AppError = require("../../utils/AppError");
const env = require("../../config/env");

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    env.jwtSecret,
    { expiresIn: "7d" }
  );
};

exports.register = async ({ name, email, password, role }) => {
  if (!name || !email || !password) {
    throw new AppError("Name, email and password are required", 400);
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || "ATTENDEE",
    },
  });

  return {
    token: generateToken(user),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

exports.login = async ({ email, password }) => {
  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  return {
    token: generateToken(user),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};
