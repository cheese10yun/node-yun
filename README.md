# node-yun

* PM2 Module...
* Nginx...
* Passport Login...
* Mysql...


##Proejct 실행 방법

```
npm install
npm start
```
## Databases 설정
```
$ mysql -u root -p
password input...
mysql> create database node
mysql> use node
exit
$ cd node_yun
$ mysql -u root -p node < node_yun.sql
```
 


###AWS EC2 Node + Nginx Setting
*AWS EC2 Node.js 설치 및 Nginx 연동은 [블로그 AWS EC2 Nginx Node.js 설정](https://brunch.co.kr/@cheese10yun/3)을 참조해주세요*

###PM2 이용한 Node 프로세스 관리
*PM2 사용법, 명령어 및 start , strop, restart 쉘 스크립트를 통한 PM2제어는 [블로그 PM2 이용한 Node 프로세스 관리](https://brunch.co.kr/@cheese10yun/13)을 참조해주세요*


###develop-mysql
*본 branch는 mysql 연동 예제입니다. 예제에 대한소개는 [Node.JS + Mysql 연동](https://brunch.co.kr/@cheese10yun/14)설명을 참고하세요*

###develop-passport
*본 branch는 passport를 통한 로그인 인증 예제입니다. 예제에 대한소개는 [블로그 Node Passport를 이용한 Login](https://brunch.co.kr/@cheese10yun/12)설명을 참고하세요*

###develop-passport-mysql
*본 branch는 passport를 통한 로그인과 데이터베이스(mysql)예제입니다. 예제애 대한소개는 [블로그 Node Passport를 이용한 Login(2)](https://brunch.co.kr/@cheese10yun/15)설명을 참고하세요*

###develop-