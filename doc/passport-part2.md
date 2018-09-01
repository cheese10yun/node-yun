## Node Passport를 이용한 Login + Mysql [develop-passport-mysql]

안녕하세요 스타트업에서 근무하고 있는 신입 개발자입니다. 이전 포스팅에서는 데이터베이스 연결 없이 가단 한 문자열로 비교로 Passport를 이용해서 사용자 인증 절차를 진행했었습니다.

이전에 간략하게 데이터베이스 연동도 포스팅했고, 이제 단순 문자열 비교가 아닌 데이터베이스를 활용하여 Passport Login 포스팅을 진행하겠습니다.

블로그를 보고 이해가 안 가시면 [GitHub Branch develop-passport-mysql](https://github.com/cheese10yun/node-yun)를 통해 전체 소스를 보시는 것과 이전 포스팅을 참고하시길 바랍니다.



**이번 포스팅에서 다룰 주제는 다음과 같습니다.**


* Login API 설정
* bcrypt를 통한 패스워드 비교
* JQuery Validate를 통한 Valdation 검사
* Passport Login 데이터베이스 비교 로직 추가


### 필수 모듈 설치

```bash
npm install jquery-validation --save
npm install bcrypt --save
```

### API 라우터 설정
`app.js`

```javascript
var api = require('./routes/api');
...
app.use(express.static(path.join(__dirname, 'node_modules')));
...
app.use('/api/v1', api);
```

새로 생성한  `api.js`를 라우터에 추가하는 작업을 진행합니다. 해당 파일을 require 시키고 라우터에 대한 URL를 지정합니다. `app.use('/api/v1', api);`  이런 식으로 라우터 설정을 진행하게 되면 `/ap/v1 URL`로 들어오는 클라이언트의 요청은 이곳으로 들어오게 됩니다.

다시 말하면
**/ap/v1/login**
**/ap/v1/user**
**/ap/v1/...**

위와 같은 클라이언트의 요청은 모두 api.js 라우터에서 처리하게 됩니다.

### 필수 모듈 require
`app.js`

```javascript
var express = require('express');
var router = express.Router();
var mysql_dbc = require('../db/db_con')();
var connection = mysql_dbc.init();
var bcrypt = require('bcrypt');
```

필요한 모듈을 require 시킵니다. bcrypt 모듈을 통해서 데이터베이스에 암호와 돼있는 패스워드와 로그인 시 입력한 패스워드를 비교 작업을 진행합니다. bcrypts는 다음 포스팅에서 다루겠습니다. 이번 포스팅에서는 정말 간단하게 설명하고 지나가겠습니다.

### API Login 로직
`api.js`

```javascript
router.post('/login', function (req, res, next) {
  var
    user_id = req.body.username,
    password =   req.body.password;

  connection.query('select *from `user` where `user_id` = ?', user_id, function (err, result) {
    if (err) {
      console.log('err :' + err);
    } else {
      if (result.length === 0) {
        res.json({success: false, msg: '해당 유저가 존재하지 않습니다.'})
      } else {
        if (!bcrypt.compareSync(password, result[0].password)) {
          res.json({success: false, msg: '비밀번호가 일치하지 않습니다.'})
        } else {
          res.json({success: true})
        }
      }
    }
  });
});
module.exports = router;
```

라우터의 URL 경로를 보시면 /login으로 돼있습니다. 이미 app.js에서 /api/v1 URL로 지정했으니 /api/v1는 생략하시고 나머지 URL 경로를 입력하시면 됩니다. 즉 위의 UR 경로는 /api/v1/login입니다.

위의 로직은 간단합니다. 로그인폼에서 넘어온 유저의 값으로 쿼리를 보내 해당 값을  result에 가져옵니다. result의length 값이  0이면 해당 유저가 존재하지 않으니 json 타입으로 해당 메시지와 로그인에 결과를 반환시킵니다.

bcrypt의 compareSync 메서드를 통해서 로그인 폼에서 넘어온 패스워드와 데이터베이스의 패스워드가 일치하는지 여부를  판단합니다. 패스워드가 일치하지 않으면 json 타입으로 해당 메시지와 로그인 결과를 반환시킵니다.

참고로 bcrypt 통해서 패스워드 "qwer1234"를 암호화시켰고 그 암호화된 값은 "$2a$10$gpZRmDYkWIfrKkPDfzPGEO.SB39f6qeFQ036yiZ0rdsQQgWeDudBO" 입니다. compareSync메서드는 위에서 말한 두 개의 문자열 값을 비교합니다. bcrypt에 대한 설명은 다음번에 다루겠습니다.

마지막으로 위의 로직인 해당 유저가 존재하고, 패스워드가 맞을 경우 json 타입으로 success에 true를 반환시켜줍니다.

이제 백엔드 작업을 어느 정도 마무리했으니 프런트 엔드 쪽으로 설명하겠습니다.


#### 이전 포스팅에서 작성한 login.hbs 하단에 아래코드를 붙여넣습니다.
```html
<script src="jquery-validation/dist/jquery.validate.min.js"></script>
<script src="javascripts/login.js"></script>
```

이전 예제에서 설정한 login.hbs 파일에 해당 js를 포함시켜줍니다. validation.js는 npm 모듈로 설치한 validation을 담당해주는 모듈이고 logis.js는 validation를 이용해서 위에서 만든 api.js에게 로그인폼 정보를 넘겨주는 것을 담당합니다.

해당 뷰 파일과 자바스크립트 파일 이름을 동일하게 하는 것이 관리하기 편해서 같은 네임을 갖는 것을 권장드립니다. 참고로 저런 식으로 npm으로 설치한 모듈에 대한 접근을 하시려면 app.js 파일에 아래의 소스를 반드시 작성해야합니다.

```javascript
app.use(express.static(path.join(__dirname, 'node_modules')));
```

`login.js`

```javascript
$('#frm_login').validate({
  onkeyup: false,
  submitHandler: function () {
    return true;
  },
  rules: {
    username: {
      required: true,
      minlength: 6
    },
    password: {
      required: true,
      minlength: 8,
      remote: {
        url: '/api/v1/login',
        type: 'post',
        data: {
          username: function () {
            return $('#username').val();
          }
        },
        dataFilter: function (data) {
          var data = JSON.parse(data);
          if (data.success) {
            return true
          } else {
            return "\"" + data.msg + "\"";
          }
        }
      }
    }
  }
});
```

jQuery validate는 많이들 사용하실 거 같으니 간략하게 설명하겠습니다. 사용자의 입력값에 대한 유효성 검사는 반드시 해야 할 작업이지만 상당히 귀찮은 작업입니다. 그런 것을 도와주는 라이브러리라고 생각하시면 됩니다.

사용법은 간단합니다. rules 객체에 해당  html input name값으로 객체를 만들고 필요한 설정을 이어 나가면 됩니다.

위에 설정은 username필드는 반드시 입력되어야 하고 최소 길이가 6 이상 이여야 한다는 조건이 설정돼있습니다. 방금 설명한 조건을 만족시키지 않을 경우는 `/api/v1/login`을 호출하지 않습니다. 이로서 서버는 불필요한 요청을 받지 않아도 되고 클라이언트도 불필요하게 서버에게 요청하지 않고 자신의 username 필드에 제대로 입력하지 않았다는 것을 확인할 수 있습니다.

![](https://i.imgur.com/2V9a6TK.png)
![](https://i.imgur.com/XKKtAdc.png)

해당 validation에 통화하지 않으면 각각에 맞는 메시지를 화면에 표시합니다. messsage 객체를 통해서 에러 메시지를 설정할 수도 있습니다. 아무것도 설정하지 않으면 영어로 해당  rules에 맞게 에러 메시지가 출력됩니다

####  login.js jQeury validate remove
```javascript
remote: {
  url: '/api/v1/login',
  type: 'post',
  data: {
    username: function () {
      return $('#username').val();
    }
  },
  dataFilter: function (data) {
    var data = JSON.parse(data);
    if (data.success) {
      return true
    } else {
      return "\"" + data.msg + "\"";
    }
  }
}
```

password의 객체에 remote가 중요합니다. 위의 소스 중에 remote 부분만 따로 설명드리겠습니다.

패스워드 필드의 rules조건이 충족되면 위에서 만든 api.js의 /api/v1/login URL로 요청을 보내게 됩니다. password 객체에 remote 객체가 있기 때문에 password 값은 자동으로 넘어가게 되고 유저네임의 값은 username 메서드를 통해서 전해지게 됩니다.

즉 위에서 작성한 router.post('/login', function (req, res, next) {...} 라우터로 username, password가 전달됩니다. 전달받은 값을 기준으로 로그인 성공 여부와 그에 따른 메시지를 반환시켜줍니다.

dataFilter 메서드는 위에서 반환시켜주는 값을 data 파마미터를 통해서 받습니다. JSON.parse 메서드를 통해서 Object로 변환시켜줍니다.

![](https://i.imgur.com/MCCndzb.png)
![](https://i.imgur.com/ZtlY3cK.png)

로그인 성공 여부를 판단하고 로그인 실패 시 login api에서 반환시키는 메시지를 출력시킵니다. 로그인이 성공할 경우는 login.hbs의  form action 값인 /login으로 전송이 이루어집니다.
`index.js`

```javascript
passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true //인증을 수행하는 인증 함수로 HTTP request를 그대로  전달할지 여부를 결정한다
}, function (req, username, password, done) {
  connection.query('select *from `user` where `user_id` = ?', username, function (err, result) {
    if (err) {
      console.log('err :' + err);
      return done(false, null);
    } else {
      if (result.length === 0) {
        console.log('해당 유저가 없습니다');
        return done(false, null);
      } else {
        if (!bcrypt.compareSync(password, result[0].password)) {
          console.log('패스워드가 일치하지 않습니다');
          return done(false, null);
        } else {
          console.log('로그인 성공');
          return done(null, {
            user_id: result[0].user_id,
            nickname: result[0].nickname
          });
        }
      }
    }
  })
}));
```

이전 포스팅에서는 문자열 비교로 passport 인증 부분을 데이터베이스를 통한 인증으로 수정하였습니다. 위에서 설명해드렸던 api login 로직과 크게 다르지 않으며 로그인 성공 시에 user_id, nickname을 세션에 저장시킵니다. 이 전에 포스팅했던 passport 로직이 index에 있어 이 곳에서 동일한 작업을 진행하였습니다.

![](https://i.imgur.com/E3Q7px1.png)


### 정리하며...
이번 포스팅은 상대적으로 소스 내용이 길어 다들 이해하셨을지 모르겠습니다. 이해가 안 되시면 깃허브에 있는 전체 소스를 보는 것을 추천드립니다. 깃허브에 있는 프로젝트에 해당 branch 마다 기능을 정리하는 방식으로 조금씩 조금씩 기능을 추가할 계획입니다. 기능은 딱히 통일성은 없고 많이 사용하고, 사내에서 만든 기능들을 추가할 거 같습니다. AWS S3 업로드, Passport 소셜 로그인, Redis 등 다소 통일성은 없으나 어디서나 쓸 수 있는 것들을 간단하게 정리해 나아가겠습니다.

긴 글 읽어주셔서 감사드립니다. 다들 올해도 재미있게 개발할 수 있는 한 해가 되셨으면 합니다.