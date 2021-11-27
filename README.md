## Data-Viewer
### 목차
1. [Key Summary](#key-summary)
2. [Tech Stacks](#tech-stacks)
3. [Directory structure](#directory-structure)
4. [Architecture](#architecture)

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

### Architecture
#### frontend(Global state management)
- Mobx로 state management 구성을 개괄적으로 설명하고 있는 그림입니다. 
![data-viewer-architecture](https://user-images.githubusercontent.com/41932978/143277384-82699769-d613-40f2-8d56-93110bcd5a62.png)

### backend(API endpoints)
#### GET - api/account/[option]
| Option | Required | Parameter | Type | Description |
| --- | --- | --- | --- | --- |
| `login` | required | { email: "", password: ""} | string | Database 조회 후 일치하는 값이 있는 경우 Token 발행 |
| `profile` | required | header: { Authorization: `Token [token]`}  | string | 해당 Token이 유효한지 검증 |

#### GET - api/browse/[option]
| Option | Required | Parameter | Type | Description |
| --- | --- | --- | --- | --- |
| `default` | required |  | string | mapped directory list object return |
| `dirEntry` | optional | `path` | string | `onClick` 이벤트가 발생한 directory의 하위 디렉토리 및 파일 list object return  |

### deploy
![data-viewer-deploy drawio](https://user-images.githubusercontent.com/41932978/143543575-546327b2-7792-4327-ae7d-650a54dc2935.png)

