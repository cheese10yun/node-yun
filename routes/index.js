var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


/**
 * */

/*로그인 성공시 사용자 정보를 Session에 저장한다*/
passport.serializeUser(function (user, done) {
  done(null, user)
});

/*인증 후, 페이지 접근시 마다 사용자 정보를 Session에서 읽어옴.*/
passport.deserializeUser(function (user, done) {
  done(null, user);
});

/*블로그 소개시 이함수 소개하자*/
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
};

passport.use(new LocalStrategy({
  usernameField: 'user_id',
  passwordField: 'password',
  passReqToCallback: true //인증을 수행하는 인증 함수로 HTTP request를 그대로  전달할지 여부를 결정한다
}, function (req, user_id, password, done) {
  if (false) {
    return done(null, false);
  } else {
    var user = {
      user: user_id
  };
    return done(null, user)
  }
}));

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title: 'Express'});
});


module.exports = router;


