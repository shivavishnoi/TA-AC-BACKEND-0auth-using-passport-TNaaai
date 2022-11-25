var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var GithubStrategy = require('passport-github2').Strategy;
var User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback',
      passReqToCallback: true,
    },
    function (req, accessToken, refreshToken, profile, done) {
      var profileData = {
        name: profile._json.name,
        email: profile._json.email,
        photo: profile._json.picture,
      };
      User.findOne({ email: profile._json.email }, (err, user) => {
        if (err) return done(err);
        if (!user) {
          User.create(profileData, (err, addedUser) => {
            if (err) return done(err);
            done(null, addedUser);
          });
        } else {
          done(null, user);
        }
      });
    }
  )
);

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: '/auth/github/callback',
      scope: ['user:email'],
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(profile);
      var githubProfile = {
        name: profile.displayName,
        username: profile.username,
        photo: profile._json.avatar_url,
        email: profile.emails[0].value,
      };
      var email = profile.emails[0].value;
      User.findOne({ email }, (err, user) => {
        if (err) return done(err);
        if (!user) {
          User.create(githubProfile, (err, addedUser) => {
            if (err) return done(err);
            done(null, addedUser);
          });
        } else {
          done(null, user);
        }
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, 'name email', (err, user) => {
    done(err, user);
  });
});
