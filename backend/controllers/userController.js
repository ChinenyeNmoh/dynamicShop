import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import Token from '../models/tokenModel.js';
import passwordResetToken from '../models/passwordTokenModel.js';
import {sendEmail, emailVerificationTemplate, passwordResetTemplate} from '../utils/mail.js';
import jwt from 'jsonwebtoken';
import Product from '../models/productModel.js';

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  
  const { email, password } = req.body;
  const user = await User.findOne({ "local.email": email }).populate('wishlist')
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
    }else if(user.isBlocked){
      return res.status(403).json({ 
        message: "Your account has been blocked. Contact the admin for more information" 
      });
    }
    generateToken(res, user._id);
     // Remove sensitive fields before sending the user data
     const userResponse = user.toObject();
    if (userResponse.local) {
      delete userResponse.local.password;
      
    }
    if (userResponse.google) {
      delete userResponse.google.googleId;
    }
    if (userResponse.facebook) {
      delete userResponse.facebook.facebookId;
    }
    res.json({
      user: userResponse,
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
            "local.password": password,
            
            "address": address,
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
            "local.password": password,
            "address": address,
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
            address,
            password
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

        res.status(201).json({ message: 'Account created successfully. Check your email to verify your account' });
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
  res.status(200).redirect('http://localhost:3000/login?message="Email verified successfully. you can login"');
});




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
    // Delete any existing password reset tokens
    const existingToken = await passwordResetToken.findOne({ userId: user._id });
    if (existingToken) {
      await existingToken.deleteOne();
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

const resetPassword = asyncHandler(async (req, res) => {
  const { id, token } = req.params;
  const user = await User.findById(id);

  if (!user) {
    return res.status(400).redirect('http://localhost:3000/login?err=No user found with this id');
  }

  const userToken = await passwordResetToken.findOne({
    userId: user._id,
    token: token,
  });

  if (!userToken) {
    return res.status(400).redirect('http://localhost:3000/login?err=Token is Invalid');
  }

  // Token is valid, update the user and delete the token
  await User.findByIdAndUpdate(id, { isPasswordModified: true }, { new: true });

  // The TTL index will automatically remove expired tokens
  await passwordResetToken.findByIdAndDelete(userToken._id);

  return res.status(200).redirect(`http://localhost:3000/update/?message=You+are+a+verified+user.+You+can+update+your+password+now&id=${user._id}`);
});

//update password route
const updatePassword = asyncHandler(async (req, res) => {
  const {id} = req.params;
  const {password, confirmPassword,  } = req.body;
  console.log('request body',req.body)

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
    if (password !== confirmPassword) {
      res.status(400);
      throw new Error("Passwords do not match");
    }

    const salt = await bcrypt.genSalt(10);
    const hashPw = await bcrypt.hash(password, salt);
    // Update the password
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { "local.password": hashPw },
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



// @desc    delete user
const deleteUser = asyncHandler(async(req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    res.status(400);
    throw new Error("No user found with this id");
  }else{
    await User.findByIdAndDelete(id);
    res.status(200).send({ message: "User deleted successfully" });
  }
})

// @desc    update user
const updateUser = asyncHandler(async(req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    res.status(400);
    throw new Error("No user found with this id");
  }else{
    const updatedUser = await User.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.status(200).send({ 
      message: "User updated successfully",
      user: updatedUser

     });
  }
});


// @desc    Get all users
const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const keyword = req.query.keyword;

  // Build the query object based on the keyword
  let query = {};
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    query = {
      $or: [
        { 'local.firstname': { $regex: lowerKeyword, $options: 'i' } },
        { 'local.lastname': { $regex: lowerKeyword, $options: 'i' } },
        { 'local.email': { $regex: lowerKeyword, $options: 'i' } },
        { 'google.firstname': { $regex: lowerKeyword, $options: 'i' } },
        { 'google.lastname': { $regex: lowerKeyword, $options: 'i' } },
        { 'google.email': { $regex: lowerKeyword, $options: 'i' } },
        { 'facebook.firstname': { $regex: lowerKeyword, $options: 'i' } },
        { 'facebook.lastname': { $regex: lowerKeyword, $options: 'i' } },
        { 'facebook.email': { $regex: lowerKeyword, $options: 'i' } },
      ],
    };
  }

  // Get the total count of matching users
  const count = await User.countDocuments(query);

  // Fetch users based on the query and pagination
  const users = await User.find(query)
    .limit(limit)
    .skip(limit * (page - 1));

  if (users.length === 0) {
    return res.status(404).json({ error: "No users found" });
  }

  // Sort users based on available names (if sorting in-memory)
  users.sort((a, b) => {
    const getName = (user) => {
      if (user.local && user.local.firstname) return user.local.firstname;
      if (user.google && user.google.firstname) return user.google.firstname;
      if (user.facebook && user.facebook.firstname) return user.facebook.firstname;
      return ''; // Default to an empty string if no name is found
    };

    // Convert names to lowercase so that sorting is case-insensitive
    const nameA = getName(a).toLowerCase();
    const nameB = getName(b).toLowerCase();

    // Sort alphabetically by name
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });

  res.status(200).json({
    message: "Users fetched successfully",
    page,
    totalPages: Math.ceil(count / limit),
    totalCount: count,
    users,
  });
});

// @desc  my user profile
const myProfile = asyncHandler(async(req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(400);
    throw new Error("No user found with this id");
  }else{
    res.status(200).send({ message: "User fetched successfully",  user });
  }
})



// @desc  user profile
const getUser = asyncHandler(async(req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    res.status(400);
    throw new Error("No user found with this id");
  }else{
    res.status(200).send({ message: "User fetched successfully", user: user });
  }
})


// @desc    update my profile
const updateMyProfile = asyncHandler(async(req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(400);
    throw new Error("No user found with this id");
  }else{
    const newUser = {
      "local.firstname": req.body.firstname ? req.body.firstname : user.local.firstname,
      "local.lastname": req.body.lastname ? req.body.lastname : user.local.lastname,
      "local.mobile": req.body.mobile? req.body.mobile : "",
      "address": req.body.address ? req.body.address : user.address
    };
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      newUser,
      { new: true,runValidators: true }
    );
    res.status(200).send({ 
      message: "User updated successfully", 
      user: updatedUser});
  }
});

// @desc   add to wishlist
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const productExist = user.wishlist.some((p) => p.toString() === productId.toString());
    if (productExist) {
      res.status(400);
      throw new Error('Product already in wishlist');
    }

    user.wishlist.push(productId);
    await user.save();
    await user.populate('wishlist');

    res.status(200).json({ message: 'Product added to wishlist', user });

});

// @desc   remove from wishlist
const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { wishlist: productId } },
      { new: true }
    ).populate('wishlist');

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.status(200).json({ message: 'Product removed from wishlist', user });
});


const sendData = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error('User not authenticated');
  }

  try {
    const user = await User.findById(req.user._id).select('-local.password  -google.googleId -facebook.facebookId');
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    await user.populate('wishlist');

    const token = jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Redirecting with token in URL
    res.redirect(`http://localhost:3000/login?token=${token}`);
  } catch (error) {
    res.status(500).send({ message: 'Error sending data', error: error.message });
  }
});


export {
  createUser,
  sendData, 
  logOut,
  verifyToken,
  updatePassword,
  resetPassword,
  forgotPassword,
  authUser,
  updateUser,
  deleteUser,
  getUsers,
  myProfile,
  updateMyProfile,
  getUser,
  addToWishlist,
  removeFromWishlist,
};
