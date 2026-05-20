# Render 部署指南

## 部署方案

采用**单服务方案**：后端同时托管前端静态文件，一个 Render Web Service 搞定一切。

```
用户访问 → Render Web Service (Express)
              ├── /api/*        → API 路由
              ├── /image/*      → 静态图片
              └── /*            → 前端 SPA (index.html)
```

---

## 第一步：修改后端，让它能托管前端

### 1.1 修改 `backend/src/index.ts`，添加前端静态文件服务

在 error handler 之前添加：

```typescript
// 前端静态文件
const frontendDist = path.resolve(process.cwd(), '../dist');
app.use(express.static(frontendDist));

// SPA fallback — 非 API 路由全部返回 index.html
app.get('*', (_req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});
```

### 1.2 修改 CORS 配置

生产环境下前端和后端是同一个 origin，CORS 可以放宽：

```typescript
app.use(cors({
  origin: [env.FRONTEND_URL, `http://localhost:${env.PORT}`].filter(Boolean),
  credentials: true,
}));
```

### 1.3 修改 `backend/src/config/env.ts`，添加 PORT 默认值

```typescript
PORT: parseInt(process.env.PORT || '3000', 10),
```

Render 会自动注入 `PORT` 环境变量，确保你的服务器监听 `process.env.PORT`。

---

## 第二步：修改 render.yaml

```yaml
services:
  - type: web
    name: self-blog
    runtime: node
    region: oregon
    plan: free
    buildCommand: |
      npm install && npm run build
      cd backend && npm install && npx prisma generate && npx prisma migrate deploy && npm run build
    startCommand: cd backend && node dist/index.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: GITHUB_CLIENT_ID
        sync: false
      - key: GITHUB_CLIENT_SECRET
        sync: false
      - key: FRONTEND_URL
        sync: false
      - key: ADMIN_GITHUB_IDS
        sync: false
```

关键变化：
- `buildCommand` 先构建前端（`npm run build` 生成 `dist/`），再构建后端
- 前端的 `dist/` 目录会被后端的 `express.static` 托管

---

## 第三步：修改 Vite 配置

`vite.config.ts` 的代理只在开发环境生效，不需要改。但确保 `API_BASE_URL` 在生产环境为空字符串（已是默认值）：

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
```

这样前端所有 `/api/*` 请求都会发到同一个 origin（即 Render 的地址）。

---

## 第四步：GitHub OAuth 配置

### 4.1 创建生产环境 OAuth App

1. 打开 https://github.com/settings/developers
2. **New OAuth App**（不是 GitHub App）
3. 填写：
   - **Application name**: `Self Blog Production`
   - **Homepage URL**: `https://你的app名.onrender.com`
   - **Authorization callback URL**: `https://你的app名.onrender.com/api/auth/github/callback`
4. 记录 **Client ID** 和 **Client Secret**

### 4.2 为什么需要新的 OAuth App？

开发环境的 callback URL 是 `http://localhost:3000/api/auth/github/callback`，而 GitHub OAuth 不支持多个 callback URL，所以生产环境需要单独创建一个。

---

## 第五步：推送到 GitHub 并在 Render 部署

### 5.1 确保所有改动已推送

```bash
git add -A
git commit -m "feat: 配置 Render 部署"
git push origin master
```

### 5.2 在 Render 创建服务

1. 打开 https://dashboard.render.com
2. **New** → **Web Service**
3. 连接 GitHub 仓库 `xiaobin118/self-blog`
4. 配置：
   - **Name**: `self-blog`（或你喜欢的名字）
   - **Region**: Oregon（或离你最近的）
   - **Branch**: `master`
   - **Runtime**: Node
   - **Build Command**: 见上方 render.yaml
   - **Start Command**: `cd backend && node dist/index.js`
5. 点击 **Create Web Service**

### 5.3 设置环境变量

在 Render Dashboard → 你的服务 → **Environment** 中添加：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NODE_ENV` | `production` | 已在 render.yaml 设置 |
| `DATABASE_URL` | `file:./prod.db` | SQLite 文件路径 |
| `JWT_SECRET` | *(自动生成)* | 已在 render.yaml 设置 |
| `GITHUB_CLIENT_ID` | `你的生产Client ID` | 第四步获取 |
| `GITHUB_CLIENT_SECRET` | `你的生产Client Secret` | 第四步获取 |
| `FRONTEND_URL` | `https://你的app名.onrender.com` | 你的 Render 域名 |
| `ADMIN_GITHUB_IDS` | `你的GitHub用户名` | 管理员标识 |

### 5.4 部署

点击 **Manual Deploy** → **Deploy latest commit**，等待构建完成。

---

## 第六步：验证

部署成功后访问 `https://你的app名.onrender.com`，检查：

1. 首页加载正常
2. 点击登录，跳转到 GitHub OAuth
3. OAuth 回调成功，获得 token
4. 管理员可以创建/编辑/删除文章
5. 标签管理正常
6. 图片画廊加载正常
7. 暗色模式切换正常

---

## 常见问题

### Q: SQLite 文件在哪里？
Render 的 free plan 文件系统是 ephemeral（临时的），每次重新部署会丢失数据。如果需要持久化：
- 升级 Render plan 使用 Persistent Disk
- 或改用 PostgreSQL（推荐，Render 免费提供）

### Q: 部署后图片不显示？
检查 `backend/src/index.ts` 的静态文件路径是否正确。`process.cwd()` 在 Render 上是 `backend/` 目录，所以 `../public/image` 应该能正确指向项目根目录的 `public/image`。

### Q: GitHub OAuth 报错 "redirect_uri mismatch"？
确认 Render 环境变量 `FRONTEND_URL` 和 GitHub OAuth App 的 **Authorization callback URL** 完全一致，包括 `https://` 前缀。

### Q: 免费 plan 会休眠？
是的，Render free plan 15 分钟无请求后会休眠，首次访问需要 30-60 秒冷启动。可以用 [UptimeRobot](https://uptimerobot.com/) 每 5 分钟 ping `/health` 端点保持唤醒。

### Q: 构建失败 "Cannot find module"？
确保 `buildCommand` 的顺序正确：先 `npm install`（前端），再 `cd backend && npm install`（后端）。

---

## 未来改进

- [ ] 切换到 PostgreSQL（数据持久化）
- [ ] 添加 GitHub Actions 自动部署（push 到 master 自动触发）
- [ ] 配置自定义域名
- [ ] 添加图片上传功能（需要对象存储如 S3/Cloudflare R2）
