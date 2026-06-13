import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateToken } from '../utils/generateToken.js';

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email || '').trim());

function normalizeEmail(email) {
  const normalizedEmail = String(email || '').trim().toLowerCase();

  if (!isValidEmail(normalizedEmail)) {
    const error = new Error('Please enter a valid email address.');
    error.statusCode = 400;
    throw error;
  }

  return normalizedEmail;
}

function toAuthUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    currency: user.currency
  };
}

function authPayload(user) {
  return {
    token: generateToken(user._id),
    user: toAuthUser(user)
  };
}

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const normalizedName = String(name || '').trim();
  const normalizedEmail = normalizeEmail(email);
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    const error = new Error('An account with this email already exists.');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword
    });
    const data = authPayload(user);

    res.status(201).json({
      success: true,
      message: 'Signup successful',
      data,
      ...data
    });
  } catch (createError) {
    if (createError?.code !== 11000) {
      throw createError;
    }

    const error = new Error('An account with this email already exists.');
    error.statusCode = 409;
    throw error;
  }
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = normalizeEmail(email);
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    const error = new Error('Account does not exist. Please create an account first.');
    error.statusCode = 404;
    throw error;
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    const error = new Error('Incorrect password.');
    error.statusCode = 401;
    throw error;
  }

  const data = authPayload(user);

  res.json({
    success: true,
    message: 'Login successful.',
    data,
    ...data
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Authenticated user fetched successfully.',
    data: {
      user: toAuthUser(req.user)
    }
  });
});
