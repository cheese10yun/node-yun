
<!-- TOC -->

- [AWS EC2 Node + Nginx Setting](#aws-ec2-node--nginx-setting)
    - [1. EC2 기본 셋팅 (AMI)](#1-ec2-%EA%B8%B0%EB%B3%B8-%EC%85%8B%ED%8C%85-ami)
        - [Port 설정](#port-%EC%84%A4%EC%A0%95)
        - [GitHub 설정](#github-%EC%84%A4%EC%A0%95)
    - [2. EC2 Node.js 설치](#2-ec2-nodejs-%EC%84%A4%EC%B9%98)
    - [3. GitHub Clone](#3-github-clone)
    - [4. Nginx 연동](#4-nginx-%EC%97%B0%EB%8F%99)

<!-- /TOC -->

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