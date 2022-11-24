var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;
// require('dotenv').config();
var User = require('../models/User');

passport.use(
  new GitHubStrategy(
    {
      clientID: `d2a01307576c1d47296b`,
      clientSecret: `e388a998d1c7276d51b592d423d527174f65c07d`,
      callbackURL: '/auth/github/callback',
      scope: ['user:email'],
    },
    (accessToken, refreshToken, profile, done) => {
      var profileData = {
        name: profile.displayName,
        username: profile.username,
        photo: profile._json.avatar_url,
        email: profile.emails[0].value,
      };
      var email = profile.emails[0].value;
      User.findOne({ email }, (err, user) => {
        if (err) return done(err);
        if (!user) {
          User.create(profileData, (err, addedUser) => {
            if (err) return done(err);
            done(null, addedUser);
          });
        }
        done(null, user);
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, 'name email username', function (err, user) {
    done(err, user);
  });
});
