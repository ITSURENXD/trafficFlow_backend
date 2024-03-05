const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const User = require('../models/user.model');
const passport = require('passport');

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY,
};

passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const user = await User.findOne({ _id: jwtPayload.id }).select(
        '-password'
      );

      if (user) {
        const safeUser = {
          _id: user._id,
          email: user.email,
          username: user.username,
          profileImageUrl: user.profileImageUrl,
        };
        return done(null, safeUser);
      } else {
        return done(null, false);
        // or you can create a new account
      }
    } catch (err) {
      return done(err, false);
    }
  })
);
