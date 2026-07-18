import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import generateToken from '../utils/generateToken.js';

const sanitizeUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt
});

export const register = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(409);
    throw new Error('An account with this email already exists');
  }

  const user = await User.create({ fullName, email, password });
  const token = generateToken(user);

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    token,
    user: sanitizeUser(user)
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user);

  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    token,
    user: sanitizeUser(user)
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: sanitizeUser(req.user)
  });
});
