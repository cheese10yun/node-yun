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