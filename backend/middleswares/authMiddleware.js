import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import mongoose from 'mongoose';

const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwtToken;
  console.log('Token:', token);

  if (req.isAuthenticated()) {
    console.log('User is authenticated with Passport');
    return next();
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);
      req.user = await User.findById(decoded.userId).select('-password');
      console.log('User is authenticated with JWT');
      return next();
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});


const ensureGuest = (req, res, next) => {
  const token = req.cookies.jwtToken;

  if (token || req.isAuthenticated()) {
    console.log('User is already logged in');
    return res.status(400).json({
      message: "You are already logged in. You need to be a guest."
    });
  }

  console.log('User is not authenticated');
  next();
};


const ensureAdmin = asyncHandler(async (req, res, next) => {
  // Check if the user is authenticated via Passport.js
  if (req.isAuthenticated() && req.user.role === "admin") {
    console.log('User is an admin via Passport.js');
    return next();
  }

  // If not authenticated via Passport.js, check the JWT token
  const token = req.cookies.jwtToken;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select('-password');

    if (req.user && req.user.role === "admin") {
      console.log('User is an admin via JWT');
      return next();
    } else {
      return res.status(403).json({ message: 'You are not an admin' });
    }
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
});


// Function to check if a string is a valid MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);


const validateId = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({
      message: 'Invalid ObjectId',
    });
  }
  console.log("Object id is valid")
  // If the ID is valid, continue to the next middleware or route handler
  next();
});

const validateQuery =  async (req, res, next) => {
  // Check if the page query parameter is not present
  if (!req.query.page) {
    // Add page=1 query parameter
    req.query.page = 1;
}
next()
};
export { protect, ensureAdmin, ensureGuest, validateId, validateQuery};
