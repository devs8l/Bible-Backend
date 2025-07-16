/*import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userModel from "../models/userModel.js"; 

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await userModel.findById(id);
  done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL,
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const existingUser = await userModel.findOne({ email: profile.emails[0].value });

    if (existingUser) {
      return done(null, existingUser);
    }

    const newUser = new userModel({
      name: profile.displayName,
      email: profile.emails[0].value,
      password: "google-oauth",
      isVerified: true,
    });

    const savedUser = await newUser.save();
    return done(null, savedUser);
  } catch (err) {
    return done(err, null);
  }
}));*/

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userModel from "../models/userModel.js";

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await userModel.findById(id);
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const existingUser = await userModel.findOne({ email });

        if (existingUser) return done(null, existingUser);

        const newUser = new userModel({
          name: profile.displayName,
          email,
          password: "google-oauth", // Not used
          isVerified: true,
        });

        const savedUser = await newUser.save();
        return done(null, savedUser);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
