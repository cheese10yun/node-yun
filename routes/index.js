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

/*로그인 유저 판단 로직*/
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
};


passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true //인증을 수행하는 인증 함수로 HTTP request를 그대로  전달할지 여부를 결정한다
}, function (req, username, password, done) {
  if(username === 'user001' && password === 'password'){
    return done(null, {
      'user_id': username,
    });
  }else{
    return done(false, null)
  }
}));

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log(req.user);
  res.render('index', {
    title: 'Express'
  });
});


router.get('/login', function (req, res) {
  res.render('login', {
    title: 'login'
  })
});


router.post('/login', passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}), // 인증실패시 401 리턴, {} -> 인증 스트레티지
  function (req, res) {
    res.redirect('/');
  });

/*Log out*/
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});


router.get('/myinfo', isAuthenticated, function (req, res) {
  res.render('myinfo',{
    title: 'My Info',
    user_info: req.user
  })
});




module.exports = router;


