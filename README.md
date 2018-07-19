[![HitCount](http://hits.dwyl.io/cheese10yun/github-project-management.svg)](https://github.com/cheese10yun/node-yun)
# Proejct 소개
* 프로젝트 명 [Branch name] ex) ->  AWS S3 업로드시 이미지 최적화 [develop-s3-upload]

## 프로그램 실행
```
npm install
npm start
```

## Database 설정
```
$ mysql -u root -p
password input...
mysql> create database node
mysql> use node
exit
$ cd node_yun
$ mysql -u root -p node < node_yun.sql
```

## 목차

- [Proejct 소개](#proejct-소개)
- [AWS EC2 Node + Nginx Setting](#aws-ec2-node--nginx-setting)
- [PM2 이용한 Node 프로세스 관리](#pm2-이용한-node-프로세스-관리)
- [Node.JS + Mysql 연동 [develop-mysql]](#nodejs--mysql-연동-develop-mysql)
- [Passport를 이용한 Login [develop-passport]](#passport를-이용한-login-develop-passport)
- [Node Passport를 이용한 Login + Mysql [develop-passport-mysql]](#node-passport를-이용한-login--mysql-develop-passport-mysql)
- [Crontab을 이용한 노드 API 호출 [develop-crontab-api]](#crontab을-이용한-노드-api-호출-develop-crontab-api)
- [Passport를 이용한 네이버, 카카오, 페이스북 로그인 [develop-passport-social-login]](#passport를-이용한-네이버-카카오-페이스북-로그인-develop-passport-social-login)
- [Node Mysql Multiple Insert [develop-passport-mysql-multiple-insert]](#node-mysql-multiple-insert-develop-passport-mysql-multiple-insert)
- [Node 다른 서버 API 호출 [develop-api-call]](#node-다른-서버-api-호출-develop-api-call)
- [AWS S3 업로드시 이미지 최적화 [develop-s3-upload]](#aws-s3-업로드시-이미지-최적화-develop-s3-upload)

## AWS EC2 Node + Nginx Setting
안녕하세요. 스타트업에서 근무 중인 신입 개발자입니다. 근무하면서 얻은 정보를 정리하며 올려봅니다. 사내환경 같은 경우는 각자 로컬 환경에서 개발하고, 어느 정도 작업이 완료됐다 싶으면 테스트 서버(EC2)에 프로젝트를 올리는 작업을 아래와 같이 진행하게 됩니다.


1. EC2 기본 셋팅 (AMI)
2. EC2 Node.js 설치
3. GitHub Clone
4. Nginx 연동

### 1. EC2 기본 셋팅 (AMI)
AWS EC2에 접속하셔서 필수 패키지 설치를 진행합니다.

```bash
sudo yum update -y
sudo yum install gcc gcc-c++
sudo yum  install -y git
sudo yum install -y nginx
```


#### Port 설정
EC2의 포트 80, 3000이 열려있어야 합니다. EC2포트 설정은 여기서 다룰 내용이 아니니 생략하겠습니다. 포트 설정은 원하시는 포트를 사용하셔도 됩니다만 기본 포트를 권장합니다.

![EC2 Innound](https://i.imgur.com/XnEOclk.png)


#### GitHub 설정
GitHub에 프로젝트를 업로드해주세요. GitHub 설정은 여기서 다룰 내용이 아니니 생략하겠습니다.


### 2. EC2 Node.js 설치
AWS EC2에 접속하셔서 아래 명령어를 순차적으로 입력합니다. 다른 버전 노드를 설치해도 무방합니다만 로컬에 있는 노드 버전과 동일하게 설치하는 것을 권장합니다. 다소 시간이 걸리는 작업입니다.

```bash
wget https://nodejs.org/dist/v6.7.0/node-v6.7.0.tar.gz
tar -xvf node-v6.7.0.tar.gz
cd 해당폴더이동
./configure
make
sudo make install
```
설치를 완료하셨다면 아래의 명령어로 Node, NPM 버전을 확인합니다

![Node, NPM Version](https://i.imgur.com/joOtMGi.png)

### 3. GitHub Clone
이미 프로젝트가 GitHub에 업로드되었 다고 가정하고 진행하겠습니다.

```bash
git init
git remote add origin [단축 이름] [url]
ex) git remote add origin https://github.com/cheese10yun/node-yun.git
git clone [url]
ex) git clone https://github.com/cheese10yun/node-yun.git
```

**node_modules 디렉토리는 gitignore 시키는 것을 권장합니다.**


```bash
cd gitclone 폴더이동/
npm install
npm start
```

노드 모듈을 설치한 이후 해당 노드 프로젝트에 알맞게 노드 서버를 실행시켜주세요. 저 같은 경우는 `npm start`로 프로젝트를 실행시켰습니다.
![Node Server](https://i.imgur.com/bLIrf9x.png)

EC2 IP:3000로 접속하시면 해당 노드 서버가 실행 있는 것을 확인하실 수 있습니다. 만약 접속이 안되시면 EC2 IP 및 inbound 설정을 확인해보세요.

### 4. Nginx 연동

nginx를 실행시킨 이후 EC2 IP로 접속하시면 아래 그림과 같은 화면이 출력되시면 nginx 설정으로 진행하시면 됩니다.

```bash
sudo service nginx restart
```

![Nginx](https://i.imgur.com/ShyNzxi.png)
**Nginx 기본 포트는 80으로 설정되어있습니다.**

```bash
sudo vi /etc/nginx/nginx.conf
```

![Nginx.conf](https://i.imgur.com/rBNAhpq.png)

위의 그림과 같이 server {
    아래의 location을 붙여 넣습니다.
} Nginx를 재실행시킵니다.


```bash
location / {
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header Host $http_host;
      proxy_set_header X-NginX-Proxy true;

      proxy_pass http://127.0.0.1:3000/;
      proxy_redirect off;
}
```

```bash
sudo service nginx restart
```

![Nginx Node](https://i.imgur.com/jEsxV1H.png)


Nginx를 재실행시키시고 EC2 IP에 접속하시면 Nginx 화면이 아니라 노드 서버 화면이 나오시는 것을 확인할 수 있습니다.

최대한 쉽게 설명하려 노력했으나 도움이 됐을지 의문입니다. 어려운 주제는 아니지만, 문서로 정리해보니 이틀이라는 시간이 걸리긴 했습니다만 뭔가 코딩하는 거랑 비슷한 느낌이라고 할까요? 결과물을 보니 뭔가 뿌듯하고 재미도 있네요. 다들 이런 재미로 블로그를 하시나 봅니다.

현재 회사에서 노드를 기반으로 서비스하고 있어 node 중심적으로 블로그 진행할 거 같습니다. 노드나 스타트업에 관심이 있는 분이시면 종종 찾아와 주시기 바랍니다.

## PM2 이용한 Node 프로세스 관리

안녕하세요 스타트업에서 근무하고 있는 신입 개발자입니다. 저희는 Node 프로세스 관리를 PM2 모듈을 이용해서 관리하고 있습니다. PM2에 대한 기초지식이 있으신 분들은 3번 항목만 보셔도 좋습니다.


1. PM2 소개 및 설치
2. PM2 명령어
3. 쉘 스크립트 PM2 제어


### 1. PM2 소개 및 설치  

개발 중에 에러를 만나면 노드  서버가 강제로 죽어 버리는 경우를 빈번하게 맞이하게 됩니다. 이럴 때 앱을 재실행해주는 기능도 담당하고 있어 실제 노드 서버에서는 필수적인 패키지이라고 할 수 있습니다. 물론 이밖에 다양한 기능들을 재공해 주고 있습니다. 기능을 크게 정리하면 다음과 같습니다.

* 앱에서 충돌이 발생할 경우 앱을 자동으로 다시 시작
* 런타임 성능 및 자원 소비에 대한 통찰력을 획득
* 성능 향상을 위해 설정을 동적으로 수정
* 클러스터링을 제어  

```bash
[sudo] npm install pm2 -g
```


### 2. PM2 간단 명령어

```bash
pm2 start  <실행시킬 서버. js> -- name <AppName>
```

![](https://i.imgur.com/HPbXbRg.png)

제 환경에서는 www 파일로 노드 서버를 시행시키고 있어 위 그림과 같은 명령어로 PM2를 실행합니다. App Name을 설정하는 것을 권장해 드립니다. 아래 소개하여드릴 명령어를 App Name으로 쉽게 제어할 수 있어집니다.

```bash
pm2 list
```

pm2 리스트를 보여주는 명령어입니다. 설정하신 App Name 값으로 실행되신 걸 확인하실 수 있습니다.

![](https://i.imgur.com/SgojMzT.png)

```bash
pm2 stop <app_name>
pm2 restart <app_name>
pm2 delete <app_name>
```

간단한 명령어이므로 설명은 생략하겠습니다. 명령어 뜻 그대로 해석하시면 됩니다. 위에서 설명했던 것처럼 App_name으로 편리하게 pm2 명령어를 제어할 수 있습니다

```bash
pm2 show <app_name>
```

![](https://i.imgur.com/HTe0f4I.png)

pm2 정보뿐만이 아니라 노드 버전, 로그 위치, 기타 등등 다양한 정보를 확인하실 수 있습니다. 또 git을 사용하신다면 branch 정보 등 간략한 정보도 출력됩니다.


### 3. 쉘 스크립트 PM2 제어

사실 이 내용을 포스팅하기 위해서 시작했습니다. 이 부분만 따로 올리기에는 포스팅 내용이 너무 짧아서 조금씩 넣다 보니 이렇게 길어.... 졌습니다.

서버를 시작, 정지, 재시작하는 경우는 정말 빈번하게 발생합니다. 그래서 저희는 start.sh, restart.sh, stop.sh 쉘 스크립트를 통해서 start, restart, stop 작업을 진행시킵니다.항상 그렇듯 반복되는 귀찮은 작업은 간략화시키는 것이 좋습니다.

`start.sh`

```bash
#!/bin/bash

pm2 reload node_yun;
echo 'Reload pm2 demon...';
sleep 1;
sudo service nginx restart;
echo 'Restart nginx server...';
echo 'All Done!'
exit;
```

`stop.sh`

```bash
#!/bin/bash

pm2 stop node_yun;
echo 'Stop node_yun by pm2';
sleep 1;
sudo service nginx stop;
echo 'Stop nginx server...';
echo 'All Done!';
exit;
```

`restart.sh`

```bash
#!/bin/bash

pm2 delete node_yun;
pm2 start /home/ec2-user/node-yun/bin/www -i 0 --name node_yun;
echo 'start node_yun by pm2';
sleep 1;
sudo service nginx start;
echo 'Start nginx server...';
echo 'All Done!';
exit;
```


#### 클러스터 모드

pm2를 실행시킬 때 -i 옵션을 사용하면 클러스터 모드로 실행이 됩니다. -i 뒤에 0을 지정하면 사용 가능한 CPU가 모두 실행이 됩니다. 간단하게 클러스터 모드를 실행시킬 수 있습니다.

![](https://i.imgur.com/vLBjZd5.png)

**pm2 list 명령어로 현재 실행 중인 인스턴스 개수를 확인할 수 있습니다**

`restart.sh 실행화면`

![](https://i.imgur.com/Jre6Yql.gif)

#### 정리


# Node.JS + Mysql 연동 [develop-mysql]

안녕하세요 스타트업에서 근무하고 있는 신입 개발자입니다. 이번에 정리할 내용은 Node + Mysql 연동입니다. 이미 수많은 예제가 있으나 앞으로 포스팅할 내용들이 데이터베이스가 필수적으로 필요하니 간단 정리 및 간단하게 팁?을 소개하여드리겠습니다.

저희 회사 개발 환경은 각자 로컬에서 개발을 진행하고, 어느 정도 개발이 완료되면 테스트 서버에서 QA를 진행하고 실제 서버에 반영시키는 방식으로 진행하고 있습니다.

그래서 데이터 베이스도 로컬, 데브 서버, 리얼서버 이렇게 3개의 정보를 갖고 있어야 합니다. 또 개발 중간중간에 실서버의 데이터 베이스의 접근이 필요할 경우도 더러 있습니다. 이러한 경우에 간단하게 프로퍼티를 이용해서 데이터베이스 정보를 변경할 수 있는  팁을 알려드리겠습니다. 아래에 링크도 있으니 이해가 안 되시면 참조하시길 바랍니다.

[Branch develop-mysql](https://github.com/cheese10yun/node-yun)

### mysql 모듈설치

*우선 필요 모듈부터 설치를 진행합니다. 데이터베이스 설치 및 설정은 다른 블로그에서 많이 다루고 있으니 생략하겠습니다.*

```bash
npm install mysql --save
```

`db_info.js`

```javascript
module.exports = (function () {
  return {
    local: { // localhost
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: '',
      database: ''
    },
    real: { // real server db info
      host: '',
      port: '',
      user: '',
      password: '!',
      database: ''
    },
    dev: { // dev server db info
      host: '',
      port: '',
      user: '',
      password: '',
      database: ''
    }
  }
})();
```

데이터베이스의 정보가 저장돼있는 곳입니다. 로컬 환경, 실제 서버 환경, 테스트 서버 환경에 필요한 정보를 입력해주세요.

`db_con.js`

```javascript
var mysql = require('mysql');
var config = require('../db/db_info').local;

module.exports = function () {
  return {
    init: function () {
      return mysql.createConnection({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        database: config.database
      })
    },

    test_open: function (con) {
      con.connect(function (err) {
        if (err) {
          console.error('mysql connection error :' + err);
        } else {
          console.info('mysql is connected successfully.');
        }
      })
    }
  }
};
```

데이터베이에 커넥트 하는 부분을 담당합니다. config 변수를 보시면 local 프로퍼티를 이용해서 db_info.js에 있는 local 객체를 config 변수에 바인딩시킵니다.

init 메서드를 보시면 방금 바인딩시킨 config 값의 기반으로  mysql connection을 생성이 가능합니다. 또 `var config = require('../db/db_info').(XXX)` 이런 형태로 `db_info.js`에 저장돼있는 데이터베이스의 정보를 손쉽게 변경이 가능합니다.

**router에서 사용하기 (1)**

```javascript
var mysql_dbc = require('../db/db_con')();
var connection = mysql_dbc.init();
mysql_dbc.test_open(connection);
```
mysql_dbc 변수에  db_con의 값을 require을 시키고, 위에서 설명한 init 메서드를 통해서 생성된 Mysql Connnection을 변수 connection에 저장시킵니다


**router에서 사용하기 (2)**


```javascript
router.get('/mysql/test', function (req, res) {
  var stmt = 'select *from ....';
  connection.query(stmt, function (err, result) {
    .....
  })
});
```

위에서 설명한 connection 객체를 이용해서 쿼리 작업을 진행하시면 됩니다.

![EC2 Innound](https://i.imgur.com/yloTaE9.png)

서버를 실행시키면 입력된 데이터베이스와 연결이 되고 `test_open` 메서드를 통해서 데이터베이스의 컨넥션이 제대로 생성이 됐나 간단한 로그로 출력됩니다. 이처럼 서버를 실행시켰을 때 데이터베이스와 제대로 연결되었는지 정보를 출력하시는 것을 권장합니다.


### 마무리
이번 포스팅 내용은 짧긴 짧았지만 생각을 정리하고, 코드를 작성하고 또 그것을 문서로 다시 작성하는 것은 상당히 시간이 거리는 작업인 거 같습니다.  그래도 점점 익숙해지고 있기도 하고, 블로그를 포스팅한 날은 조회수를 보는 재미도 있습니다. 그런 의미로 좋아요, 공유하기 좀 부탁드리겠습니다....

포스팅하다 보면 "아 이 내용이 먼저 나와야 이걸 설명하기가 편할 거 같아" 이런 생각이 계속 들어 제가 하고 싶은 포스팅하고 싶은 내용보다는 좀 더 앞부분을 계속 설명해드렸던 거 같습니다. 그래도 제가 전하고 싶은 기술 천천히, 꾸준하게 포스팅해 나아가겠습니다.

긴글 읽어주셔서 감사합니다. 조만간에 찾아 뵙겠습니다.

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

## Crontab을 이용한 노드 API 호출 [develop-crontab-api]

안녕하세요 스타트업에서 근무하고 있는 신입 개발자입니다. 이번에 포스팅할 주제는 Crontab을 이용해서 특정 시점에Node API를 호출하는 내용입니다. [GitHub Brnacb develop-crontab-api](https://github.com/cheese10yun/node-yun)에 소스코드 참고해주세요

### Crontab 간단 설명
Crontab은 스케줄링을 관리해주는 프로그램으로 특정 시간에 사용자가 직성한 스크립트나 명령어을 간단하게 실행시킬수 있습니다. 시간 설정이 매우 간단하고 직관적이라서 쉽게 사용 가능한게 가장큰 장점입니다.

    *    *    *    *    *  수행할 명령어
    ┬   ┬   ┬   ┬   ┬
    │   │   │   │   │
    │   │   │   │   │
    │   │   │   │   └───────── 요일 (0 - 6) (0 =일요일)
    │   │   │   └────────── 월 (1 - 12)
    │   │   └─────────── 일 (1 - 31)
    │   └──────────── 시 (0 - 23)
    └───────────── 분 (0 - 59)

### Crontab 등록

  Crontab 설치는 여기서 다루지 않고 진행하겠습니다. 등록하기 전에 crontab에서 실행될 쉘스크립트 파일을 생성합니다. 해당 스크립트 작성은 Crontab등록이후 진행하겠습니다. 저 같은 경우는 crontab.sh로 생성했습니다.

```bash
crontab -e
5 0 * * * /path/../crontab.sh
```
crontab -e 명령어를 입력하게 되면 VI 모드로 반복될 시간 설정과 해당 스크립프 파일 경로를 설정합니다. 위에서 설명 했다 싶이 매일 12시간 05분에 crontab.sh를 호출하게 설정하였습니다.

```bash
crontab -l
```
위의 명령어로 crontab 등록을 확인합니다.

`crontab.sh` 스크립트 파일 작성

```bash
#!/bin/bash

echo 'start delete table info...';

curl -H "Content-Type: application/json" -X DELETE -d '
  {"sql":"delete from `user` where  `user_id` is not null;"}
  ' http://localhost:3500/api/v1/crontab

echo 'success...';
```

사실 게임데이터는 레디스에 저장하고 있어 셈플 예제로는 다소 복잡해서 이전에 설명했던 예제로 간단한 user 테이블의 모든 항목의 user 칼럼을 지우는 예제로 대체 하겠습니다. "DELETE"을 PUT, POST로 변경하셔도 그대로 작성 가능합니다

### Node API 설정

`api.js` [api.js 설정](https://cheese10yun.github.io/2017/01/05/passport-mysql/) 은 이전 블로그 포스팅 내용을 참고해주세요.

```javascript
router.delete('/crontab', function (req, res) {
  var sql = req.body.sql;
  connection.query(sql, function (err, result) {
    if (err) {
      res.json({
        success: false,
        err: err
      });
    } else {
      res.json({
        success: true,
        msg: 'Delete Success'
      })
    }
  });
})
```
req.body.sql 객체로 쿼리문을 받고 해당 쿼리문을 실행하는 간단한 예제입니다.
### Crontab 실행 확인

![EC2 Innound](https://i.imgur.com/BFB2EKG.png)


위의 예제는 12시 05분에 실행되니 그 시간까지 기다릴 수는 없죠…. 그래도 1분에 한 번 실행되는 crontab 설정으로 실행이 되나 테스트를 진행하는 것도 권장합니다. 또한, 스크립트 파일을 명령어로 직접 실행시켜 일단 스크립트 파일이 제대로 작성되었나부터 확인하시는 것이 더욱 더 권장합니다.

### 마무리...

브런치를 사용하다가 소스코드 올리는 것이 너무 불편해서 티스토리로 블로그를 이전했습니다. 앞으로는 티스토리에서 계속 찾아뵙겠습니다. 긴글 읽어주셔서 감사합니다.
하지만... 깃허브 페이지로 또 옮겼네요... 3 번째 이사....


## Passport를 이용한 네이버, 카카오, 페이스북 로그인 [develop-passport-social-login]

![EC2 Innound](https://i.imgur.com/dJDKGrn.png)

이전에 [Passport 간단로그인](https://cheese10yun.github.io/2017/01/01/Passport-part1/) [Passport 데이터베이스 연동](https://cheese10yun.github.io/2017/01/05/passport-mysql/)을 포스팅했습니다. 그래서 이번에는 Passport를 이용한 소셜 로그인 **페이스북, 카카오, 네이버 로그인 및 회원 가입** 기능을 포스팅해보겠습니다. Passport에 대해서 기초지식이 없으시며 앞서 포스티한 주제를 보시는 것을 권장드립니다. 또한 [GitHub develop-passport-social-login](https://github.com/cheese10yun/node-yun)에 올려져있는 전체 소스를 보는 것을 권장드립니다.

### Developers 등록
![EC2 Innound](https://i.imgur.com/2qLERpk.png)


본 포스팅에서는 개발자 등록은 다루지 않겠습니다. 아래의 작업을 하기위해서는 네이버, 카카오, 페이스북 개발자 센터에서 앱설정을 완료해주세요. 본 포스팅은 Passport 로직에 집중하겠습니다.


### 필수 모듈설치 및 require


```bash
npm install passport-facebook --save
npm install passport-kakao --save
npm install passport-naver --save
```


`index.js(router)`설치한 모듈을 require 시켜줍니다.

```javascript
var NaverStrategy = require('passport-naver').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var KakaoStrategy = require('passport-kakao').Strategy;
```

### Developers 정보 등록

더이상 데이터베이스 정보만 갖고 있지 않아 `db_info.js` 에서 `secret.js ` 변경했습니다. `db_info` 로 데이터베이스 접근을 진행하겠습니다. 자세한 내용은 아래에서 다시 설명드리겠습니다.

```javascript
module.exports = {
  'secret' :  '',
  'db_info': {
    local: { // localhost
    ...
    },
    real: { // real
    ...
    },
    dev: { // dev
    ...
    }
  },
  'federation' : {
    'naver' : {
      'client_id' : '',
      'secret_id' : '',
      'callback_url' : '/auth/login/naver/callback'
    },
    'facebook' : {
      'client_id' : '',
      'secret_id' : '',
      'callback_url' : '/auth/login/facebook/callback'
    },
    'kakao' : {
      'client_id' : '',
      'callback_url' : '/auth/login/kakao/callback'
    }
  }
};
```

`federation` 객체에 네이버, 카카오, 페이스북 Developers 정보를 입력합니다.  `secret.js`  민감한 정보를 갖고있는 파일들은 프로젝트 디렉토리에 포함시키지 않는 것이 바람직합니다. 깃허브에는 소스코드를 공개하기 위해서 업로드하긴 했습니다... <del>안티패턴도 좋은 경험 입니다.</del>

### 회원 가입 페이지

`login.hbs <a href>` 태그에 로그인 처리를 담당할 URL을 입력합니다. 자세한 로직은 아래에서 설명하겠습니다.

```html
<form action="/login" method="post" name="frm_login" id="frm_login">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="text-center">Node JS Passport Login</h1>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <input type="text" id="username" name="username" class="form-control input-lg" placeholder="ID" required="required" autocomplete="off" />
                </div>

                <div class="errorTxt"></div>
                <div class="form-group">
                    <input type="password" id="password" name="password" class="form-control input-lg" placeholder="Password" required="required" autocomplete="off" />
                </div>
                <div class="errorTxt"></div>
                <div class="form-group">
                    <input type="submit" class="btn btn-block btn-lg btn-default btn_login" value="Login" />
                    <a href="/auth/login/facebook" class="btn btn-block btn-lg btn-primary btn_login">FaceBook</a>
                    <a href="/auth/login/kakao" class="btn btn-block btn-lg btn-warning btn_login">KaKao</a>
                    <a href="/auth/login/naver" class="btn btn-block btn-lg btn-success btn_login">Naver</a>
                </div>
            </div>
        </div>
    </div>
</form>
```

### Passport 로직 구현

`index.js(router)`**네이버 로그인**

```javascript
var secret_config = require('../commons/secret');

passport.use(new NaverStrategy({
    clientID: secret_config.federation.naver.client_id,
    clientSecret: secret_config.federation.naver.secret_id,
    callbackURL: secret_config.federation.naver.callback_url
  },
  function (accessToken, refreshToken, profile, done) {
    var _profile = profile._json;

    loginByThirdparty({
      'auth_type': 'naver',
      'auth_id': _profile.id,
      'auth_name': _profile.nickname,
      'auth_email': _profile.email
    }, done);
  }
));
```

`index.js(router)`**카카오 로그인**
```javascript
passport.use(new KakaoStrategy({
    clientID: secret_config.federation.kakao.client_id,
    callbackURL: secret_config.federation.kakao.callback_url
  },
  function (accessToken, refreshToken, profile, done) {
    var _profile = profile._json;

    loginByThirdparty({
      'auth_type': 'kakao',
      'auth_id': _profile.id,
      'auth_name': _profile.properties.nickname,
      'auth_email': _profile.id
    }, done);
  }
));
```

`index.js(router)` **페이스북 로그인**

```javascript
passport.use(new FacebookStrategy({
    clientID: secret_config.federation.facebook.client_id,
    clientSecret: secret_config.federation.facebook.secret_id,
    callbackURL: secret_config.federation.facebook.callback_url,
    profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone',
      'updated_time', 'verified', 'displayName']
  }, function (accessToken, refreshToken, profile, done) {
    var _profile = profile._json;

    loginByThirdparty({
      'auth_type': 'facebook',
      'auth_id': _profile.id,
      'auth_name': _profile.name,
      'auth_email': _profile.id
    }, done);
  }
));
```


* accessToken : OAtuh tokken을 이용해서 네이버, 카카오, 페이스북 오픈 API를 호출합니다.
* refreshToken : tokken이 만료되었을 때 재발급을 용청합니다.
* profile : 네이버, 카카오, 페이스북의 사용자의 정보가 들어있습니다. (이걸 얻기위해서...이 많은 소스를...)


로직은 크게 다르지 않아 한 번에 설명하겠습니다. `secret.js` `federation` 객체있는 `client_id, secret_id, callback_url`를  passport 에 바인딩 시킵니다.  profile 파라미터로 네이버, 카카오, 페이스북 프로필 정보가 각기 다르게 들어오기 때문에 공통이름으로 바인딩 시키고 `loginByThirdparty()` 메서드에 바인딩 시킨 유저 정보와 done을 넘겨 줍니다. `loginByThirdparty()` 메서드에서 로그인 처리 및 회원 가입 절차가 진행되게 됩니다. 아래에서 자세하게 설명하겠습니다.

`index.js(router)`라우처 처리

```javascript
// naver 로그인
router.get('/auth/login/naver',
  passport.authenticate('naver')
);
// naver 로그인 연동 콜백
router.get('/auth/login/naver/callback',
  passport.authenticate('naver', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);

// kakao 로그인
router.get('/auth/login/kakao',
  passport.authenticate('kakao')
);
// kakao 로그인 연동 콜백
router.get('/auth/login/kakao/callback',
  passport.authenticate('kakao', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);

// facebook 로그인
router.get('/auth/login/facebook',
  passport.authenticate('facebook')
);
// facebook 로그인 연동 콜백
router.get('/auth/login/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);
```

반복적인 소스라 대표적으로 **Naver** 기준으로 통합해서 설명하겠습니다. `login.hbs` 에서 네이버 로그인을 클릭했을 경우 `router.get('/auth/login/naver'...)` 으로 요청이들어고 아래의 `NaverStrategy` 모듈로 다시 전달됩니다.

`passport.use(new NaverStrategy(...)` 여기에서는 OAuth 요청을 만들어서 네이버 로그인 처리를 진행하고 요청결과를 아래의 라우터로 리다이렉트를 시켜줍니다.

`router.get('/auth/login/naver/callback'...)` 해당 라우터는 로그인이 성공할 경우 인덱스 페이지로 리다이렉트 시켜주고 실패할 경우에는 다시 `'/login'` 다시 로그인 페이지로 리다이렉트 시켜줍니다.

### 로그인 및 회원 가입 로직

```javascript
function loginByThirdparty(info, done) {
  console.log('process : ' + info.auth_type);
  var stmt_duplicated = 'select *from `user` where `user_id` = ?';

  connection.query(stmt_duplicated, info.auth_id, function (err, result) {
    if (err) {
      return done(err);
    } else {
      if (result.length === 0) {
        // 신규 유저는 회원 가입 이후 로그인 처리
        var stmt_thridparty_signup = 'insert into `user` set `user_id`= ?, `nickname`= ?';
        connection.query(stmt_thridparty_signup, [info.auth_id, info.auth_name], function (err, result) {
          if(err){
            return done(err);
          }else{
            done(null, {
              'user_id': info.auth_id,
              'nickname': info.auth_name
            });
          }
        });
      } else {
        //기존유저 로그인 처리
        console.log('Old User');
        done(null, {
          'user_id': result[0].user_id,
          'nickname': result[0].nickname
        });
      }
    }
  });
}
```

`auth.id` 기반으로 신규 회원인지 기존 회원인지 판단합니다. 신규 회원일 경우에는 `user` 테이블에 회원 정보를 저장 시키고 로그인 처리를 진행하고, 기존 유저일 경우에는 쿼리로 조회한 회원정보를 기반으로 로그인 처리를 진행합니다.
간단하게 말씀드리면 신규회원이든 기존 회원이든 원클릭으로 회원 가입 절차를 진행하게 할 수 있습니다.

사실 위의 예제는 좀 과격?한 부분이 좀있습니다. `auth.id` 는 중복될 일이 거의 없을 거 같긴 하지만  `auth.nickname` 같은 경우는 중복의 여지가 상당합니다. 사실 위의 예제는 중복의 여지가 있으니 추후 로직은 각자 알아서....<del>안티패턴도 좋은 경험 입니다.</del>

저희 서비스에는 타 게임회사의 계정과 연동해야 하기 때문에 소셜 회원가입을 진행한 사용자에 대해서는 게임 로그인 진행 전에 아이디, 패스워드, 닉네임값을 한 번 더 입력 더 받고 있습니다.

교보문고 사이트 경우에도 네이버 아이디로 회원가입을 진행하고 교보문고 계정에 대해서 아이디, 패스워드를 한 번 더 입력받는 시스템입니다. <del>우리만 그런게 아니야...</del>

### 마무리
위의 예제는 깃허브에 있는 전체 코드를 보시는 것을 권장해 드립니다. 생각보다 예제소스가 길어서 설명하는 게 매끄럽지 못한 거 같습니다. 로그인 및 회원 가입 로직은 각자 환경에 맞게 설계해야 할 거 같아 최대한 단순하게 로직 처리를 진행하게 됐습니다. 긴글 읽어주셔서 감사합니다.

## Node Mysql Multiple Insert [develop-passport-mysql-multiple-insert]

데이터베이스에 여러 개의 Insert를 할 일은 정말 많습니다. 저희는 대체로 타 게임회사의 데이터를 벌크로 내려받아야 하는 경우가 있어 여러 번의 Insert 작업을 진행하게 됩니다.
이러한 경우에 ***반복문을 사용하지 않고 여러 개를 Insert 하는 방법을 소개해드리겠습니다.***

![](https://i.imgur.com/0v9jD2z.png)
위와 같은 데이터베이스 구조일 경우의 예로 설명을 진행하겠습니다.



```javascript
var stmt_multiple_insert = 'insert into `user` (`user_id`, `password`, `nickname`, `email`, `signup_dt`) values ?;'; // 쿼리문
var values = [
    ['user_001', 'pw_01', 'name_01', 'email_01@a.com', '2016-10-10'],
    ['user_002', 'pw_02', 'name_02', 'email_02@a.com', '2016-10-10'],
    ['user_003', 'pw_03', 'name_03', 'email_03@a.com', '2016-10-10'],
    ['user_004', 'pw_04', 'name_04', 'email_04@a.com', '2016-10-10'],
    ['user_005', 'pw_05', 'name_05', 'email_05@a.com', '2016-10-10']
];

var str_query = connection.query(stmt_multiple_insert, [values], function (err, result) {
    if (err) {
        console.log(err);
    } else {
        console.log(str_query.sql);
    }
});
```

구조는 간단합니다. ***쿼리문은 입력값과 1:1로 대응시키고, 입력값은*** <code><b>var values</b></code> ***처럼 배열형태로 선언합니다.***


<code><b>var str_query = connection.query(....)</b></code> 이렇게 connection 객체를 변수로 할당시키고 <code><b>console.log(str_query.sql)</b></code>
으로 해당 쿼리를 확인할 수 있습니다.

  쿼리문을 확인하기 위한 작업이라서 실제 배포하는 소스코드에서는 사용하지 않는 것을 권장합니다.

```mysql-sql
//해당 쿼리문
insert into `user` (`user_id`, `password`, `nickname`, `email`, `signup_dt`) values
('user_001', 'pw_01', 'name_01', 'email_01@a.com', '2016-10-10'),
('user_002', 'pw_02', 'name_02', 'email_02@a.com', '2016-10-10'),
('user_003', 'pw_03', 'name_03', 'email_03@a.com', '2016-10-10'),
('user_004', 'pw_04', 'name_04', 'email_04@a.com', '2016-10-10'),
('user_005', 'pw_05', 'name_05', 'email_05@a.com', '2016-10-10');
```

## Node 다른 서버 API 호출 [develop-api-call]
노드 서버에서 다른 API를 호출하는 방법을 소개해드리겠습니다. 물론 프론트에서 Ajax를 이용해서 다른 서버의 API를 간단하게 호출할 수 있지만 Ajax로 간단하게 호출할 수 있지만, 해당 API를 호출한 이후 자신의 서버에 해당 기록을 남겨야 하는 경우는 프론트가 아닌 백에서 처리해야 합니다.

***저희 서비스 예를 들어 설명하면 노드 서버에서 제휴 모바일 게임의 포인트를 Credit 할 수 있는 기능이 있습니다. 이때 게임 서버의 API를 호출을 Node 서버에서 진행해야 해당 기록을 데이터베이스에 남길 수 있습니다.***

**전체소스는 [Github](https://github.com/cheese10yun/node-yun)에서 확인할수있습니다. 전체소스를 보시는 것을 권장합니다.**

## 필수 패키지 설치
```npm
npm install request --save
```


### 전체 소스
```javascript
module.exports = function (callee) {
    function API_Call(callee) {
        var OPTIONS = {
            headers: {'Content-Type': 'application/json'},
            url: null,
            body: null
        };
        const PORT = '3500';
        const BASE_PATH = '/api/v1';
        var HOST = null;
        (function () {
            switch (callee) {
                case 'dev':
                    HOST = 'https://dev-api.com';
                    break;
                case 'prod':
                    HOST = 'https://prod-api.com';
                    break;
                case 'another':
                    HOST = 'http://localhost';
                    break;
                default:
                    HOST = 'http://localhost';
            }
        })(callee);
        return {
            login : function (user_id, password, callback) {
                OPTIONS.url = HOST + ':' + PORT + BASE_PATH + '/login';
                OPTIONS.body = JSON.stringify({
                    "user_id": user_id,
                    "password": password
                });
                request.post(OPTIONS, function (err, res, result) {
                    statusCodeErrorHandler(res.statusCode, callback, result);
                });
            }
        };
    }
    function statusCodeErrorHandler(statusCode, callback , data) {
        switch (statusCode) {
            case 200:
                callback(null, JSON.parse(data));
                break;
            default:
                callback('error', JSON.parse(data));
                break;
        }
    }
    var INSTANCE;
    if (INSTANCE === undefined) {
        INSTANCE = new API_Call(callee);
    }
    return INSTANCE;
};
```

### HOST 설정
```javascript
(function () {
    switch (callee) {
        case 'dev':
            HOST = 'https://dev-api.com';
            break;
        case 'prod':
            HOST = 'https://prod-api.com';
            break;
        case 'another':
            HOST = 'http://localhost';
            break;
        default:
            HOST = 'http://localhost';
    }
})(callee);
```

즉시 실행 함수로 감싸고 switch 문을 실행시킵니다. ***타 서버의 API 주소도 dev, prod, etc 등등 각기 다르므로 유동적으로 변경할 수 있게 설정합니다.***
<code><b>var API_Call = require('../service/API_Call')('another');</b></code> 이런 식으로 모듈을 require 시킬 때 해당 API 서버를 쉽게 정할 수 있습니다.


### 타 서버의 API 정보 설정
```javascript
function API_Call(callee) {
    var OPTIONS = {
        headers: {'Content-Type': 'application/json'},
        url: null,
        body: null
    };
    const PORT = '3500';
    const BASE_PATH = '/api/v1';
    var HOST = null;
```
* headers: JSON으로 API를 받을 예정이니 Content-Type을 JSON 으로 설정합니다.
* url : 해당 API의 URL을 의마합니다. 특정 요청에 따라서 달라질 예정이니 null 처리했습니다.
* body : POST,PUT, DEL 등 body값을 전달해주는 객체로 사용됩니다.
* HOST, PORT, BASE_PATH = http://localhost:3500/api/v1 로 됩니다.

## 로그인 API를 호출 오는 로직으로 간단하게 설명해드리겠습니다.
```javascript
return {
    login : function (user_id, password, callback) {
        OPTIONS.url = HOST + ':' + PORT + BASE_PATH + '/login';
        OPTIONS.body = JSON.stringify({
            "user_id": user_id,
            "password": password
        });
        request.post(OPTIONS, function (err, res, result) {
            statusCodeErrorHandler(res.statusCode, callback, result);
        });
    }
};
```

이전 블로그에서 포스팅했던 API인 [Login API](https://cheese10yun.github.io/passport-mysql)를 호출해보겠습니다. 최종적인 url 값인 <code><b>http://localhost:3500/api/v1/login</b></code>로body 값으로 넘길 user_id, password를 바인딩 시켜줍니다.

타 서버의 API를 호출이 완료되면 <code><b>statusCodeErrorHandler</b></code> 메서드를 통해서 에러 핸들링 작업을 진행하게 됩니다.

***예제는 같은 로컬 서버의 API를 호출하는 예제 이긴 합니다.(다른 서버를 못구해서.. 어쩔수업싱 로컬을 호출했습니다.)***

<code><b>statusCodeErrorHandler</b></code> 에러 헨들링

```javascript
function statusCodeErrorHandler(statusCode, callback , data) {
    switch (statusCode) {
        case 200:
            callback(null, JSON.parse(data));
            break;
        default:
            callback('error', JSON.parse(data));
            break;
    }
}
```

메서드는 로직은 간단합니다. <code><b>statusCode</b></code>를 넘겨 받고 <code><b>statusCode</b></code>200일 경우는 callback으로 결괏값을 넘겨줍니다. 200 이 아닌 경우에는 각각의 환경에 맞게 구현하시면 됩니다.

* 200 성공
* 400 Bad Request - field validation 실패시
* 401 Unauthorized - API 인증,인가 실패
* 404 Not found ? 해당 리소스가 없음
* 500 Internal Server Error - 서버 에러

**최소 위의 5개 정도의 StatusCode에 알맞은 로직을 추가하는 것을 권장합니다.**


### API 호출

```javascript
var API_Call = require('../service/API_Call')('another');
router.post('/login/another/api', function (req, res) {
    var
        user_id = req.body.user_id,
        password = req.body.password;

    API_Call.login(user_id, password, function (err, result) {
        if (!err) {
            res.json(result);
        } else {
            res.json(err);
        }
    });
});
```

<code><b>API_Call.js</b></code>를 require 시킬 경우 <code><b>('another')</b></code>를 인자로 넘겨주게되면
위에서 설명한 <code><b>HOST 설정</b></code>에서 HOST가 결정됩니다.

<code><b>http://localhost:3500/api/v1/login/another/api</b></code>를 호출하게되면 넘겨 받은 user_id, password를 <code><b>API_Call.login</b></code>에게
전달되고  <code><b>statusCodeErrorHandler</b></code>를 통해서 최종적으로 callback으로 <code><b>err, result</b></code>를 JSON으로 클라이언트에게 넘겨집니다.

![](https://i.imgur.com/BpezpxV.png) 

**Postman을 이용해서 api/v1/login/another/api 를 호출한 결과입니다.**

### 마무리

역시 소스 코드가 길어지면 코드 설명이 산으로 가는 듯합니다.
역량 부족이겠죠… 애초에 구상했던 코드는 아주 간단했는데 욕심을 부려서 조금 더 넣다 보니 제가 봐도 설명 부분이 부족하다는 것이 느껴지네요.
그래도 조금이라도 도움이 됬으면 합니다. 긴글 읽어주셔서 감사합니다.


# AWS S3 업로드시 이미지 최적화 [develop-s3-upload]

***AWS S3 이미지 업로드시 이미지 최적화를 진행하고 업로드하는 것이 브라우저에서의 속도가 크게 도움이 됩니다.*** `formidable` 업로드 , `AWS-S3` 업로드는 이 전 포스팅에서 한번 다뤘기 때문에 간단하게 설명하고 이미지 최적화 적업에 대해서 자세히 포스팅하겠습니다.
***[Github](https://github.com/cheese10yun/node-aws-s3-Image-optimization)클릭해서 전체 소스를 보시는 것을 권장합니다.***

### 작업순서
1. `formidable` 모듈로 이미지 업로드 진행
2. `imagemin` 모듈로 업로드된 이미지 최적화 진행
3. `aws-sdk` 모듈을로 최적화 작업이 완료된 이미지 S3에 업로드

## 필수 패키지 설치
```bash
npm install --save async
npm install --save aws-sdk
npm install --save imagemin
npm install --save imagemin-pngquant
npm install --save formidable
```


### UploadService.js 설명

### formidable 모듈을 이용한 이미지 업로드
```javascript
Upload.formidable = (req, callback) => {
  let _fields;

  form.parse(req, function (err, fields) {
    _fields = fields;
  });

  form.on('error', function (err) {
    callback(err, null, null);
  });

  form.on('end', function () {
    callback(null, this.openedFiles, _fields);
  });
};
```

* `form.on('error')` formidable 업로드 중 오류 발생시 `callback`으로 `err` 전달
* `form.on('end')` formidable 업로드가 오류 없이 완료되면 `callback`으로 파일정보와, 필드값 전달

#### imagemin 모듈을 이용한 이미지 최적화
```javascript
Upload.optimize = (files, callback) => {
  async.each(files, (file, cb) => {
    imagemin([file.path], `${ROOT_PATH}/temp/`, {
      plugins: [
        imageminPngquant({quality: '0-80', verbose: false, floyd: 1})
      ]
    }).then(() => {
      cb();
    })
  }, (err) => {
    callback(err)
  });
};
```

* `async.each`으로 업로드할 파일의 개수만큼 이미지 최적화 적업 진행
* `imagemin([최적화할 이미지 경로(배열 타입이여야함)], 최적화 이후 저장될 이미지 경로, 이미지 최적화 작업)`
* 위의 예제는 업로된 경로와 최적화가 이루어지는 경로가 동일하여 덮어쓰여 집니다.
* 이미지 최적화 플러그인 `imageminPngquant` 사용

#### imageminPngquant 플러그인

```javascript
plugins: [
	imageminPngquant({quality: '0-80', verbose: false, floyd: 1})
]
```
* `floyd` 이미지 디더링 작업 사용 `Type: boolean, Default: false`
* `quality` 이미지 퀄리 지정 사용 `Type: string` 0~100 사용 가능
* `verbose` 불필효한 메타정보 제거 사용 `Type: boolean, Default: false`
* `imageminPngquant` 의 다양한 속성은 [imageminPngquant](https://www.npmjs.com/package/imagemin-pngquant) 에서 확인 할 수 있습니다.
* `imageminPngquant` 플러그인 이외에도 다양한 플러그인을 사용해서 이미지에 대한 다양한 작업들을 진행할 수 있습니다.

#### 최적화 완료된 이미지 S3 업로드

```javascript
Upload.s3 = (files, key, callback) => {
  async.each(files, (file, cb) => {
    params.Key = key + file.name;
    params.Body = require('fs').createReadStream(file.path);

    S3.upload(params, (err, result) => {
      cb(err, result);
    });
  }, (err, result) => {
    callback(err, result);
  });
};
```

* `async.each`으로 업로드할 파잇의 개수만큼 S3에 업로드 작업 진행
* `files` 업로드할 파일들의 정보
* `params.Key` S3에 업로드 될 경로와 파일이름을 지정합니다.
* `params.Body` 이미지 최적화 작업이 끝난 파일의 경로를 입력합니다.
* `S3.upload(...)` 실질적인 S3 이미지 업로드가 진행됩니다. `cb(err, result)`으로 에러가 발생하면 즉시 정지하고, 에러가 발생하지 않으면 파일의 개수만큼 업로드를 반복합니다.
* [Yun Blog Node AWS S3 업로드](https://cheese10yun.github.io/Node-AWS-S3-Upload) 자세한 설명은 참고


### router 에서 사용법
```javascript
router.post('/upload', (req, res) => {
  const tasks = [
    (callback) => {
      Upload.formidable(req, (err, files, fields) => {
        callback(err, files, fields);
      });
    },
    (files, fields, callback) => {
      Upload.optimize(files, (err) => {
        callback(err, files, fields);
      });
    },
    (files, fields, callback) => {
      Upload.s3(files, 'channel/test/', (err, result) => {
        callback(err, result)
      });
    }
  ];
  async.waterfall(tasks, (err, result) => {
    if (!err) {
      res.json({success: true, msg: '업로드 성공'})
    } else {
      res.json({success: false, msg: '업로드 실패'})
    }
  });
});
```

#### tasks 작업은 UploadService 모듈로 진행

* 위에서 작성한 `UploadService.js` 모듈로 아래의 작업들이 진행됩니다.
* `formidable` 메소드로 이미지 업로드 진행
* `optimize` 메소드로 이미지 최적화 진행
* `s3` 메서드로 s3 업로드 진행
* `async.waterfall` 으로 위 작업 순차 진행


### 사이즈 비교

원본              | imageOptim App | imagemin
:-------------- | :------------- | :-------------
10,645,070 byte | 8,499,904 byte | 2,858,674 byte |
473,459 byte    | 282,029 byte   | 177,423 byte   |
421,698 byte    | 258,743 byte   | 189,266 byte   |
382,774 byte    | 232,684 byte   | 182,071 byte   |
467,184 byte    | 282,368 byte   | 164,739 byte   |

**imageOptim App은 맥에서 사용하는 이미지 최적화 툴입니다.**

* 이미지 사이즈(가로세로 크기)는 변경되지 않습니다.
* bit color 값은 8bit로 수정됩니다.
* 이미지에 대한 지식이 없어 비포 에프터 사진을 첨부했습니다.

### 원본 이미지
![](http://i.imgur.com/mx9UTs2.png)

### 최적화 이미지
![](http://i.imgur.com/4pEMLxw.png)

### 마무리

최근에 이미지 S3 업로드시 이미지 최적화 해야 할 작업이 있어서 코드를 만들고 간단하게 정리해보았습니다. 아직 프로덕션에 사용하는 코드는 아니라서 그렇게 안전한 코드는 아닌점... 미리 말씀드립니다. 이 플러그인 외에도 이미지 크롭, 이미지 해상도 조정 등 다양한 플러그인들이 많아 좀 더 검색해보시고 적용하시면 보다 좋을 거 같습니다. 부디 도움이 조금이라도 되셨기를 바랍니다.


