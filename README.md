## Data-Viewer
### 목차
1. [Key Summary](#key-summary)
2. [Tech Stacks](#tech-stacks)
3. [Directory structure](#directory-structure)

### Key Summary
- **딥러닝 모델의 학습 결과**(image, loss by epoch)를 눈으로 볼 수 있는 `web-application` 프로젝트
- Backend: 서버에 저장되어있는 결과값 directory를 mapping하여 Serve
- Frontend: Nested Object로 화면 좌측 drawer를 구성 및 image zoom-in-out 구현
- Deploy: web server는 nginx, AWS의 ec2(ubuntu) 환경에서 docker-compose servieces

***

### Tech Stacks
해당 프로젝트를 진행함에 있어서 중요하게 사용된 기술들을 나열합니다. 비교적 작은 부분을 차지하는 라이브러리는 생략했습니다.

#### Frontend
- Language: **Javascript**
- code formatter: **ESLint, prettier**
- Framework: **React**
- State management: **MobX**
- UI-framework: **material-ui**
- HTTP client: **axios**
- web server: **nginx**

#### Backend
- Language: **Python**
- code formatter: **black**
- Framework: **Django**
- Toolkit: **DRF(django rest framwork)**

#### Deploy
- AWS ec2(ubuntu)
- docker

***

### Directory structure
```bash
├── README.md
├── backend
│   ├── Dockerfile
│   ├── account
│   ├── core
│   ├── data_root    // DATA mapped dir 
│   ├── manage.py
│   ├── requirements.txt
│   ├── settings
│   ├── urls.py
├── frontend
│   ├── Dockerfile
│   ├── node_modules
│   ├── package.json
│   ├── public
│   └── src
│        ├── App.js
│        ├── api
│        ├── assets
│        ├── components
│        ├── index.js
│        ├── pages
│        ├── stores
│        └── styles
├── nginx.conf
└── docker-compose.yml
```
***
