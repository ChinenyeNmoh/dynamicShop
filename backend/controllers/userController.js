import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import Token from '../models/tokenModel.js';
import passwordResetToken from '../models/passwordTokenModel.js';
import {sendEmail, emailVerificationTemplate, passwordResetTemplate} from '../utils/mail.js';

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ "local.email": email });
  if (user && (await user.isPasswordMatched(password))) {
    console.log("user password match")
    if (!user.isVerified) {
      const userToken = await Token.findOne({userId: user._id})
      console.log(userToken)
      if(!userToken){
        const token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save()
        // Construct the verification URL
      const link = `${process.env.BASE_URL}/${user.id}/verify/${token.token}`;
      const htmlContent = emailVerificationTemplate(link, user);
      // Send the verification email
      await sendEmail(user.local.email, 'Verify Email', htmlContent); 
      }
      return res.status(400).json({ 
        message: "An Email was sent to your account.Verify your account to login" 
      });
    }
    generateToken(res, user._id);
    

    res.json({
      message: "user found",
      data: user
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const createUser = asyncHandler(async (req, res) => {
  
    const { email, mobile, firstname, lastname, password, confirm_password, address } = req.body;
    console.log(req.body)

    // Check if the email already exists in Google or Facebook fields
    const findGoogleUser = await User.findOne({ "google.email": email });
    const findFacebookUser = await User.findOne({ "facebook.email": email });

    // Check if the email already exists in the local field
    const findLocalUser = await User.findOne({ "local.email": email });

    // Check if the mobile number already exists in the local field
    const findPhoneNo = await User.findOne({ "local.mobile": mobile });

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    if (findGoogleUser) {
      // Update the existing Google user with local information
      const updatedGoogleUser = await User.findOneAndUpdate(
        { "google.email": email },
        {
          $set: {
            "local.firstname": firstname,
            "local.lastname": lastname,
            "local.email": email,
            "local.mobile": mobile,
            "local.password": hashPassword,
            "local.confirm_password": hashPassword,
            "address": address || "",
            isVerified: true,
          },
        },
        { new: true }
      );
      res.status(201).json({ message: 'Google user updated with local info', data: updatedGoogleUser });
      console.log('Google user updated with Local info');
    } else if (findFacebookUser) {
      // Update the existing Facebook user with local information
      const updatedFacebookUser = await User.findOneAndUpdate(
        { "facebook.email": email },
        {
          $set: {
            "local.firstname": firstname,
            "local.lastname": lastname,
            "local.email": email,
            "local.mobile": mobile,
            "local.password": hashPassword,
            "local.confirm_password": hashPassword,
            "address": address || "",
            isVerified: true,
          },
        },
        { new: true }
      );
      res.status(201).json({ message: 'Facebook user updated with local info', data: updatedFacebookUser });
      console.log('Facebook user updated with Local info');
    } else {
      if (findLocalUser) {
        res.status(400)
        throw new Error('User with this email already exists');
      } else if (findPhoneNo) {
        throw new Error('Phone number  already exists');
      }else {
        const newUser = new User({
          local: {
            firstname,
            lastname,
            email,
            mobile,
            password: hashPassword,
            confirm_password: hashPassword,
          },
          address,
        });

        await newUser.save();
        // Generate a token
      const token = await new Token({
        userId: newUser._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save()

      // Construct the verification URL
      const link = `${process.env.BASE_URL}/${newUser.id}/verify/${token.token}`;
      const htmlContent = emailVerificationTemplate(link, newUser);

      // Send the verification email
      await sendEmail(newUser.local.email, 'Account verification',htmlContent);
      console.log('Verification email sent');

        res.status(201).json({ message: 'User created successfully', data: newUser });
      }
    }
  
});

// verify token
const verifyToken = asyncHandler(async (req, res) => {
  const { id, token } = req.params;
  console.log(token)

  const user = await User.findById(id);

  if (!user) {
    res.status(400)
    throw new Error("No user found with this id");
  }

  const userToken = await Token.findOne({
    userId: user._id,
    token: token,
  });

  if (!userToken) {
    res.status(400)
    throw new Error("Token is Invalid");
  }

  // Token is valid, update the user and delete the token
  await User.findByIdAndUpdate(
    id,
    { isVerified: true },
    { new: true }
  );

  await Token.findByIdAndDelete(userToken._id);
  res.status(200).send({ message: "Email verified successfully. you can login" });
});

// login success function
const successRoute = asyncHandler((req, res) => {
  // Access user information from req.user
  const user = req.user;
  console.log(req.user)

    if (!user) {
      // Handle the case where user information is not available
    res.status(401)
    throw new Error('User not authenticated');
    }else{
      return res.json({ message: 'Authentication successful', user: user });
    }
});

// login fail function
const failed = (req, res) => {
  res.status(400).json({ 
    message: 'Login failed' 
  });
};

// request password reset
const forgotPassword = asyncHandler(async (req, res) => {
  const email = req.body.email;
  if(!email){
    return res.status(400).json({
      message: "Provide your email address"
    })
  }
  
    const user = await User.findOne({ "local.email": email });

    if (!user) {
      return res.status(400).json({ message: "No user found with this email" });
    }

    if (user.isPasswordModified === true) {
      await User.findByIdAndUpdate(
        user._id,
        { isPasswordModified: false },
        { new: true }
      );
    }

    if (user.isVerified === false) {
      res.status(400)
      throw new Error( "An Email was sent to your account. Verify your account to login");
    } else {
      // Generate a token
      const token = await new passwordResetToken({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();

      // Construct the verification URL
      const link = `${process.env.BASE_URL}/${user.id}/resetpassword/${token.token}`;
      const htmlContent = passwordResetTemplate(link, user)

      // Send the verification email
      await sendEmail(user.local.email, 'Reset Password', htmlContent);

      return res.status(201).json({
        message: "An email has been sent to your account. Click on it to reset your password.",
      });
    }
});

// reset password
const resetPassword = asyncHandler(async (req, res) => {
  const { id, token } = req.params;
    const user = await User.findById(id);

    if (!user) {
      res.status(400);
      throw new Error("No user found with this id");
    }

    const userToken = await passwordResetToken.findOne({
      userId: user._id,
      token: token,
    });

    if (!userToken) {
      res.status(400);
      throw new Error("Token is Invalid");
    }

    // Token is valid, update the user and delete the token
    await User.findByIdAndUpdate(
      id,
      { isPasswordModified: true },
      { new: true }
    );

    // The TTL index will automatically remove expired tokens
    await passwordResetToken.findByIdAndDelete(userToken._id);
    res.status(200).send({ message: "You are a verified user. You can update your password now" });

});

//update password route
const updatePassword = asyncHandler(async (req, res) => {
  const { id, token } = req.params;
  const {newPassword, confirmPassword} = req.body;

    // Check if the user exists
    const user = await User.findById(id);
    if (!user) {
      res.status(400);
      throw new Error("No user found with this id");
    }

    // Check if the password has already been modified
    if (!user.isPasswordModified) {
      const existingToken = await passwordResetToken.findOne({ userId: user._id });

      if (existingToken) {
        // Re-send the existing token
        res.status(400);
        throw new Error("Check your mail for a password reset token");
      }

      //if the password reset token has expired, generate a new token
      const newToken = await new passwordResetToken({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();

      // Construct the verification URL
      const link = `${process.env.BASE_URL}/${user.id}/resetpassword/${newToken.token}`;
      const htmlContent = passwordResetTemplate(link, user);

      // Send the verification email
      await sendEmail(user.local.email, 'Reset Password', htmlContent);

      return res.status(201).json({
        message: "An email has been sent to your account. Click on it to reset your password.",
      });
    }else{
       // Validate and compare passwords
    if (newPassword !== confirmPassword) {
      res.status(400);
      throw new Error("Passwords do not match");
    }

    // Hash the passwords
    const salt = await bcrypt.genSalt(10);
    const hashPassword1 = await bcrypt.hash(newPassword, salt);
    const hashPassword2 = await bcrypt.hash(confirmPassword, salt);

    // Update the password
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { "local.password": hashPassword1, "local.confirm_password": hashPassword2 },
      { new: true }
    );

    return res.status(200).json({
      message: "Password reset successful",
      data: updatedUser,
    });
    }
   
});



// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logOut = asyncHandler(async (req, res) => {
  let token = req.cookies.jwtToken || "";
  console.log('Token:', token);

  if (token) {
    // Clear the JWT token
    res.cookie('jwtToken', '', {
      httpOnly: true,
      expires: new Date(0), // Expire the token immediately
    });
    console.log('JWT token cleared');
  }
    console.log('Logging out', req.user ? req.user._id : 'No user');
    req.logout(function(err) {
      if (err) {
        console.error('Error during logout:', err);
        res.status(500);
        throw new Error('Error during logout');
      }
      
      // Destroy the session if session-based authentication is used
      req.session.destroy(function(err) {
        if (err) {
          console.error('Error destroying session:', err);
          res.status(500);
          throw new Error('Error during logout');
        }

        res.clearCookie('passportSessionId'); // Clear the session cookie
        console.log('Session destroyed and cookie cleared');
        return res.status(200).json({
          message: 'User logged out successfully',
        });
      });
    });
});

export {
  createUser, 
  successRoute,
  failed,
  logOut,
  verifyToken,
  updatePassword,
  resetPassword,
  forgotPassword,
  authUser,
};
