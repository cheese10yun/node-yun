
<!-- TOC -->

- [Node 다른 서버 API 호출 [develop-api-call]](#node-다른-서버-api-호출-develop-api-call)
- [필수 패키지 설치](#필수-패키지-설치)
    - [전체 소스](#전체-소스)
    - [HOST 설정](#host-설정)
    - [타 서버의 API 정보 설정](#타-서버의-api-정보-설정)
- [로그인 API를 호출 오는 로직으로 간단하게 설명해드리겠습니다.](#로그인-api를-호출-오는-로직으로-간단하게-설명해드리겠습니다)
    - [API 호출](#api-호출)
    - [마무리](#마무리)

<!-- /TOC -->
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