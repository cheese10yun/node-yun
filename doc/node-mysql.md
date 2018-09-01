<!-- TOC -->

- [Node.JS + Mysql 연동 [develop-mysql]](#nodejs--mysql-%EC%97%B0%EB%8F%99-develop-mysql)
    - [mysql 모듈설치](#mysql-%EB%AA%A8%EB%93%88%EC%84%A4%EC%B9%98)
    - [마무리](#%EB%A7%88%EB%AC%B4%EB%A6%AC)

<!-- /TOC -->


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