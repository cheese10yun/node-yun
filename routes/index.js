var express = require('express');
var router = express.Router();
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;


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

/**
 * TODO user, password field 좀 정확히 알아보자
 * TODO flash 가 정확히 무슨 역할을 하는지?
 * TODO function (req, username, password, done) 여기 arg에 뭐가 어떻게 들어가는지
 * TODO login, logout 간단소개
 * TODO isAuthenticated 함수 소개 이해해야된다
 * TODO  passport.serializeUser, deserializeUser 이해 및 소개
 *
 * */

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true //인증을 수행하는 인증 함수로 HTTP request를 그대로  전달할지 여부를 결정한다
}, function (req, username, password, done) {
  return done(null, {
    'user_id': 'player001',
    'nickname': 'nickname'
  });
}));

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title: 'Express'});
});


router.get('/login', function (req, res) {
  console.log(req.user);
  res.render('login', {
    title: 'login'
  })
})


router.post('/login', passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}), // 인증실패시 401 리턴, {} -> 인증 스트레티지
  function (req, res) {
    res.redirect('/');
  });


/*Log out*/
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});


module.exports = router;


