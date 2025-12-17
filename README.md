# 短網址服務架構

## 1\. 核心技術選型與容器化部署

本服務採用標準的 Web 應用程式堆疊，並透過 Docker 進行環境管理。

### 1.1 技術選型

|Type                 | Technology             | Description of Responsibility                 |
|:--------------------|:-----------------------|:----------------------------------------------|
|Frontend             | Vue, Vue Router, Bulma | Frontend presentation and routing management  |
|Backend              | Express, Node.js       | API services and business logic processing    |
|Database             | MySQL                  | Data storage and management                   |
|Reverse Proxy Server | Nginx                  | Traffic management and routing forwarding     |
|Containerization     | Docker, Docker Compose | Environment deployment and service management |
|SSL/TLS              | Cloudflare, Certbot    | Secure connection and certificate management  |

### 1.2 Docker 服務部署

| Service     | Docker Image        | Port Mapping  |
|:------------|:--------------------|:--------------|
| Database    | mysql:5.7           | Internal Only *temporary exposure for development* |
| Backend API | custom-node-express | 3000:3000     |
| Frontend    | custom-vue-app      | 80:80         |

備註: nginx 服務將直接在host上運行，以便於進行反向代理和 SSL 終端管理，不使用容器化部署。

-----

## 2\. 網址結構與頁面路由定義

服務統一使用 `s.domain.com` 網域提供，區分為重定向、儀表板管理及 API 三大路徑。

### 2.1 網址結構定義

| Path                      | Description           |
|:--------------------------|:----------------------|
| `s.domain.com/`           | Landing Page          |
| `s.domain.com/****`       | Short URL Redirection |
| `s.domain.com/login`      | Dashboard Login Page  |
| `s.domain.com/manage`     | Dashboard Page        |
| `s.domain.com/api/v1/...` | API Endpoints         |

### 2.2 視覺頁面架構

| Page Type       | Domain         | Path      | Description               |
|:----------------|:---------------|:----------|:--------------------------|
| Landing page    | `s.domain.com` | `/`       | Main service landing page |
| Dashboard       | `s.domain.com` | `/manage` | Admin dashboard           |
| Dashboard Login | `s.domain.com` | `/login`  | Admin login page          |

-----

## 3\. API 服務架構

所有後端服務透過 `/api/v1/` 路徑提供，並區分是否需要身份驗證。

### 3.1 API 端點定義

| Endpoint         | Method  | Description        | Authentication |
|:-----------------|:-------:|:-------------------|:---------------|
| `/api/v1/create` | `POST`  | Create short URL   | `false`        |
| `/api/v1/login`  | `POST`  | management login   | `false`        |
| `/api/v1/urls`   | `GET`   | Get all short URLs | `true`         |
| `/api/v1/delete` | `POST`  | Delete short URL   | `true`         |

can't use payload in GET method

-----

### 資料表

| Column Name      | Data Type     | Attributes                | Description         |
|:-----------------|:--------------|:--------------------------|:--------------------|
| `id`             | INT           | PK, AI, NOT NULL          | Unique identifier   |
| `short_url_code` | VARCHAR(10)   | UNIQUE, NOT NULL          | The short code      |
| `full_url`       | VARCHAR(2048) | NOT NULL                  | The original URL    |
| `created_at`     | DATETIME      | DEFAULT CURRENT_TIMESTAMP | Creation time       |

Example Data:

| id | short_url_code | full_url                   | created_at          |
|----|----------------|----------------------------|---------------------|
| 1  | abc123         | `https://www.example.com/` | 2024-01-01 12:00:00 |
| 2  | xyz789         | `https://www.google.com/`  | 2024-01-02 13:30:00 |


-----

### Router 分配

| Router     | Responsibility (Traffic/Logic)              | Example Path Handled      | Action                                                                                                 |
|:----------:|:--------------------------------------------|:--------------------------|:-------------------------------------------------------------------------------------------------------|
| Nginx      | Reverse Proxy / Traffic Steering            | `s.domain.com/****`       | Forwards the request to Express to handle the **Redirection** logic.                                   |
|            |                                             | `s.domain.com/api/v1/...` | Forwards the request to Express to handle **API Services**.                                            |
|            |                                             | `s.domain.com/login`      | Forwards the request to the Frontend Container, to be handled by Vue Router.                           |
| Express    | Backend Business Routing / API Services     | `POST /api/v1/create`     | Processes the short URL creation request, **writes to MySQL**, and returns the short code.             |
|            |                                             | `GET /****`               | Queries MySQL for the full URL based on the short code, then issues an **HTTP 302 Redirect** response. |
| Vue Router | Frontend Page Routing / Component Switching | `/manage`                 | Renders the `<DashboardPage>` component.                                                               |
|            |                                             | `/login`                  | Renders the `<LoginPage>` component.                                                                   |
|            |                                             | `/`                       | Renders the `<LandingPage>` component.                                                                 |

<!--
| Router     | 職責 (Traffic/Logic)     | 處理的 Path 範例           | 動作 (Action)                                                     |
|:-----------|:-------------------------|:--------------------------|:-----------------------------------------------------------------|
| Nginx      | **反向代理/流量導向**     | `s.domain.com/****`       | 將請求導向 Express 處理 **重定向** 邏輯。                           |
|            |                          | `s.domain.com/api/v1/...` | 將請求導向 Express 處理 **API 服務**。                             |
|            |                          | `s.domain.com/login`      | 將請求導向 Frontend Container, 由 Vue Router 接管。                |
| Express    | **後端業務路由/API 服務** | `POST /api/v1/create`     | 處理短網址建立請求，**寫入 MySQL**，回傳短碼。                       |
|            |                          | `GET /****`               | 根據短碼查詢 MySQL 取得完整 URL, 然後發出 **HTTP 302 重定向** 響應。 |
| Vue Router | **前端頁面路由/元件切換**  | `/manage`                 | 渲染 `<DashboardPage>` 元件。                                     |
|            |                          | `/login`                  | 渲染 `<LoginPage>` 元件。                                         |
|            |                          | `/`                       | 渲染 `<LandingPage>` 元件。                                       |
-->