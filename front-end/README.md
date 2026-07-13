# Bilibili 前端项目

## 技术栈
- Vue 3
- Vue Router
- Vite

## 项目结构
```
front-end/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.js
│   ├── App.vue
│   ├── router/
│   │   └── index.js
│   └── views/
│       ├── Home.vue      # 首页（包含轮播图和视频列表）
│       ├── VideoDetail.vue  # 视频详情页
│       └── Login.vue     # 登录页面
```

## 功能
- 轮播图展示
- 视频列表展示
- 视频详情查看
- 用户登录

## 启动步骤

### 1. 安装依赖
```bash
npm install
```

### 2. 启动前端开发服务器
```bash
npm run dev
```

### 3. 访问项目
前端服务器运行在 http://localhost:3000

## 接口说明
前端使用的后端接口地址为 http://localhost:8080，包含以下接口：

### 轮播图接口
- GET /carousels - 获取所有轮播图

### 视频接口
- GET /videos - 获取所有视频
- GET /videos/:id - 获取单个视频详情

### 用户接口
- POST /users - 新增用户
- GET /users - 获取所有用户
- GET /users/:id - 获取单个用户
- PUT /users/:id - 更新用户
- DELETE /users/:id - 删除用户

## 注意事项
- 确保后端服务已经启动（运行在 http://localhost:8080）
- 确保数据库已经创建并初始化
- 跨域问题已在后端处理