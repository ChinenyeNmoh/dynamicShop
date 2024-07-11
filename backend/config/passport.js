import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GoogleStrategy  } from 'passport-google-oauth20';
import mongoose from 'mongoose';
import User from '../models/userModel.js';

const configurePassport = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/users/google/callback',
      },
      async (accessToken, refreshToken, profile, email, done) => {
        console.log(email);
        const newUser = {
          "google.googleId": email.id,
          "google.firstname": email.name.givenName,
          "google.lastname": email.name.familyName,
          "google.email": email.emails[0].value,
          isVerified: true,
        };

        try {
          let googleUser = await User.findOne({ "google.googleId": email.id });
          let localUser = await User.findOne({ "local.email": email.emails[0].value });
          let facebookUser = await User.findOne({ "facebook.email": email.emails[0].value });

          if (googleUser) {
            console.log('User found with Google ID');
            done(null, googleUser);
          } else if (localUser || facebookUser) {
            // Update the existing local or facebook user with Google information
            const updatedGoogleUser = await User.findOneAndUpdate(
              {$or: [{"local.email": email.emails[0].value}, {"facebook.email": email.emails[0].value}] },
              {
                $set: {
                  "google.googleId": email.id,
                  "google.firstname": email.name.givenName,
                  "google.lastname": email.name.familyName,
                  "google.email": email.emails[0].value,
                },
              },
              { new: true }
            );

            console.log('Local user updated with Google info');
            done(null, updatedGoogleUser);
          }else if (localUser && facebookUser) {
            // Update the existing local and facbook user with Google information
            const updatedGoogleUser = await User.findOneAndUpdate(
              {$or: [{"local.email": email.emails[0].value}, {"facebook.email": email.emails[0].value}] },
              {
                $set: {
                  "google.googleId": email.id,
                  "google.firstname": email.name.givenName,
                  "google.lastname": email.name.familyName,
                  "google.email": email.emails[0].value,
                },
              },
              { new: true }
            );

            console.log('Local or facebook user updated with Google info');
            done(null, updatedGoogleUser);
          } else {
            const user = await User.create(newUser);
            console.log('New user created with Google info');
            done(null, user);
          }
        } catch (err) {
          console.error('Error during Google authentication:', err);
          done(err, null);
        }
      }
    )
  );

  // Passport strategies for Facebook and Google
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: '/api/users/facebook/callback',
        profileFields: ["email", "name"]
    }, async (accessToken, refreshToken, profile,  done) => {
        // Handle Facebook login and find/create user in the database
        const newUser = {
          "facebook.facebookId": profile._json.id,
          "facebook.firstname": profile._json.first_name,
          "facebook.lastname": profile._json.last_name,
          "facebook.email": profile._json.email,
          isVerified: true,
        };

        try {
          let googleUser = await User.findOne({ "google.googleId": profile._json.email });
          let facebookUser = await User.findOne({ "facebook.facebookId": profile._json.id });
          let localUser = await User.findOne({ "local.email": profile._json.email});

          if (facebookUser) {
            console.log('User found with Facebook ID');
            done(null, facebookUser);
          } else if (localUser || googleUser) {
            // Update the existing local user with Google information
            const updatedFacebookUser = await User.findOneAndUpdate(
              {$or: [{ "local.email": profile._json.email }, { "google.email":  profile._json.email}] },
              {
                $set: {
                  "facebook.facebookId": profile._json.id,
                  "facebook.firstname": profile._json.first_name,
                  "facebook.lastname": profile._json.last_name,
                  "facebook.email": profile._json.email,
                },
              },
              { new: true }
            );

            console.log('Local or google user updated with facebook info');
            done(null, updatedFacebookUser);
          }  else if (localUser && googleUser) {
            // Update the existing local user with Google information
            const updatedFacebookUser = await User.findOneAndUpdate(
              { "local.email": profile._json.email },
              {
                $set: {
                  "facebook.facebookId": profile._json.id,
                  "facebook.firstname": profile._json.first_name,
                  "facebook.lastname": profile._json.last_name,
                  "facebook.email": profile._json.email,
                },
              },
              { new: true }
            );

            console.log('Local user updated with facebook info');
            done(null, updatedFacebookUser);
          } else {
            const user = await User.create(newUser);
            console.log('New user created with Facebook info');
            done(null, user);
          }
        } catch (err) {
          console.error('Error during facebook authentication:', err);
          done(err, null);
        }
    }
  ));
  
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    // Check if the id belongs to a User model
    const user = await User.findById(id);
    if (user) {
      console.log('User found during deserialization');
      return done(null, user);
    }  
    console.log('User not found during deserialization');
    return done(null, null);
  } catch (err) {
    console.error('Error during user deserialization:', err);
    return done(err, null);
  }
});

};

export default configurePassport;