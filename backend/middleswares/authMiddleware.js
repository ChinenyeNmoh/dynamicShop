import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  /*we are able to get our cookie like this because of the cookie parser. 
  so now we have a key-value pair {userId: "user's id"}.
  if anyone tampers with the cookie in your browser, you wont be able to access these routes unless you log out
  and log back in to get a new cookie
  */
  token = req.cookies.chinenye;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select('-password'); // this means return the user minus the password
      console.log('User is authenticated');

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

export { protect };