<!-- TOC -->

- [Passport를 이용한 Login [develop-passport]](#passport%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-login-develop-passport)
  - [필수 모듈 설치](#%ED%95%84%EC%88%98-%EB%AA%A8%EB%93%88-%EC%84%A4%EC%B9%98)
  - [Passport 설정](#passport-%EC%84%A4%EC%A0%95)
    - [Session 정보 확인](#session-%EC%A0%95%EB%B3%B4-%ED%99%95%EC%9D%B8)
  - [로그인 유저 판단](#%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EC%9C%A0%EC%A0%80-%ED%8C%90%EB%8B%A8)
  - [정리하며...](#%EC%A0%95%EB%A6%AC%ED%95%98%EB%A9%B0)

<!-- /TOC -->

## Passport를 이용한 Login [develop-passport]

![EC2 Innound](https://i.imgur.com/MlUddzo.png)

안녕하세요 스타트업에서 근무 중인 신입 개발자입니다. 포스팅 주제는 Passport Login입니다. 사실 passport는 다른 블로그에서도 더 깊고 잘 정리한 글들이 많아서 정리하지 않으려고 했습니다. 하지만 앞으로 passport를 이용한 소셜 로그인, rest api login 처리, 데이터베이스 연동 등을 정리할 예정이라 비교적 간단하게 설명해드리겠습니다. 어려운 기능들은 아니지만 그래도 팁이 될만한 것은 하나 이상은 준비해 오겠습니다.

본 프로젝트는 [Branch develop-passport](https://github.com/cheese10yun/node-yun) 를 참조하시면 됩니다. 직접 돌려보시면서 이해하시는 것을 추천드립니다.


### 필수 모듈 설치
npm 모듈로 모듈을 설치합니다.

```bash
npm install cookieSession --save
npm install connect-flash --save
npm install passport --save
npm install passport-local --save
```


### Passport 설정

**환경설정은 저의 프로젝트 환경에서 설명드려 다소 차이가 있을 수 있습니다.**

`app.js`

```javascript
var passport = require('passport') //passport module add
  , LocalStrategy = require('passport-local').Strategy;
var cookieSession = require('cookie-session');
var flash = require('connect-flash');

app.use(cookieSession({
  keys: ['node_yun'],
  cookie: {
    maxAge: 1000 * 60 * 60 // 유효기간 1시간
  }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
```

passport.initialize(), passport.session() 통해서 passport를 미들뒈어로 등록시킵니다. cookieSession을 Request 객체를 통해 Session을 핸들링할 수 있게 설정합니다. 만료기간 및 쿠키 키 값은 각자의 프로젝트에 맞게 설정하시면 됩니다.

`login.html`

```html
<form action="/login" method="post" name="frm_login" id="frm_login">
    <input type="text" name="username" />
    <input type="password" name="password"/>
    <input type="submit"  value="Login"/>
</form>
```

**여기서 name 값이 유저 아이디 필드는 username, 패스워드 필드는 password로 되어있습니다.**

Router설정은 `index.js`를 통해서 진행하겠습니다.

```javascript
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

router.post('/login', passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}), // 인증 실패 시 401 리턴, {} -> 인증 스트레티지
  function (req, res) {
    res.redirect('/home');
  });
```


login.html에서 post로 전송되면 이쪽에서 캐치하고 다음 작업을 진행하게 됩니다. passport.authenticate를 local strategy로 호출합니다.  이 호출은 아래에서 설명하겠습니다. failureRedirect를 통해서 로그인 실패 시 어디로 리다이렉트 할 것인지를 설정하고, 만약 로그인을 성공하게 되면 res.redirect를 통해 home으로 리다이렉트 시킵니다.



`LocalStrategy` 로그인 인증로직

```javascript
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
```

위의 로그인 처리 부분에서 passport.authenticate의 내부 메커니즘을 통해서 LocalStrategy 이쪽으로 인증 처리를 위임? 시킵니다.

usernameField, passwordField의 value는 login.html의 name 값이랑 동일해야 합니다. 이 값으로 데이터베이스의 값과 비교해서 인증 절차를 진행하게 됩니다. 만약 인증이 실패 한경우 done(false, null) 성공한 경우는  done(null, 유저 정보 객체)를 serializeUser을 넘기게 됩니다.

본 예제는 간단하게 문자열로 유저 아이디가 user001, 패스워드가 password 일 경우  유저 아이디를 done callback를 통해서 serializeUser 메서드로 넘기게 됩니다. 인증이 실패한 경우는 done(false, null)를 처리합니다.

`serializeUser`

```javascript
passport.serializeUser(function (user, done) {
  done(null, user)
});
```

로그인에 성공할 시 serializeUser 메서드를 통해서 사용자 정보를 Session에 저장하게 됩니다. 본 예제에는 "'user_id': username" 의값이 user에 들어가고 이 값을  Session에 저장하게 됩니다.

`deserializeUse`


```javascript
passport.deserializeUser(function (user, done) {
  done(null, user);
});
```

로그인에 성공하게 되면 Session정보를 저장을 완료했기에 이제 페이시 접근 시마다 사용자 정보를 갖게 Session에 갖게 됩니다. 인증이 완료되고 페이지 이동시 deserializeUser 메서드가 호출되는 것을 로그를 찍어 보시면 확인할 수 있습니다.

#### Session 정보 확인

![EC2 Innound](https://i.imgur.com/titCnYZ.png)


### 로그인 유저 판단

`isAuthenticated()`

```javascript
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
};
```


Connect 미들웨어를 이용해서 isAuthenticated 메서드를 호출하여 로그인 판단 여부를 확인할 수 있습니다. 로그인한 유저는 req.isAuthenticated는 true를 반환해서 next()를 호출해서 다음 작업을 진행하게 되고 로그인하지 않은 유저는 자연스럽게 login 페이지로 리다이렉트 시켜 로그인을 자연스럽게 유도할 수 있게 합니다.

`isAuthenticated` 사용법

```javascript
router.get('/myinfo', isAuthenticated, function (req, res) {
  res.render('myinfo',{
    title: 'My Info',
    user_info: req.user
  })
});
```

위에 설명한 isAuthenticated 메서드를 통해서 해당 접속자가 로그인하지 않은 유저일 경우는 login 페이지로 리다이렉트 시킬 것이고, 로그인한 접속자일 경우는 myinfo 페이지에 접속할 수 있게 합니다. 이 메서드를 사용하면 편리하게 접속자의 인증 여부와 그에 따른 추가 작업을 진행시키기 용이합니다.

`Lgout` 사용법

```javascript
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});
```

### 정리하며...

저희 회사에서도 passport를 이용해서 로그인 처리를 진행하고 있어 생각보다 어렵지 않게 정리할 수 있겠군 아 라는 생각을 했었습니다. 하지만 위의 기능을 하나하나 설명하려고 하니 그냥 전체적은 흐름만 대강 알지 각각의 기능들이 무엇을 의미하는지는 전혀 모르고 있었습니다. 그래서 초기에 생각했던 내용보다는 다소 길어졌고 다른 블로그에서도 이미 자세히 설명한 부분들이라 도음이 되셨을지는 모르겠습니다.

긴 글읽어주셔서 감사합니다.