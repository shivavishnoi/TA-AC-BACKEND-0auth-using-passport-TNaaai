var express = require('express');
var router = express.Router();
var passport = require('passport');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/success', (req, res) => {
  res.render('success');
});
router.get('/failure', (req, res) => {
  res.render('failure');
});
//google auth -2
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);
router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/success',
    failureRedirect: '/failure',
  })
);
//github
router.get('/auth/github', passport.authenticate('github'));
router.get('/auth/github/callback', passport.authenticate("github", {
  failureRedirect: "/failure"
}), (req, res)=>{
  res.redirect("/success")
});
//logout
router.get('/logout', (req, res) => {
  res.clearCookie('connect.sid');
  req.session.destroy();
  res.render('index', { title: 'Express' });
});

module.exports = router;
