import jwt from 'jsonwebtoken';

/*
jwt takes in the newly created users id and creates a signature with it in combination with
 our jwt secret token stored in the server. then we set a cookie with the token which will be sent to the
 users browser and stored as cookie.
  */
const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.cookie('jwtToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
    sameSite: 'strict', // Prevent CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

export default generateToken;