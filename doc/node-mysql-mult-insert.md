<!-- TOC -->

- [Node Mysql Multiple Insert [develop-passport-mysql-multiple-insert]](#node-mysql-multiple-insert-develop-passport-mysql-multiple-insert)

<!-- /TOC -->

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