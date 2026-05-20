# PROJECT2 — 项目进展记录

## 项目概述
基于 React 19 + TypeScript + Vite 8 + Tailwind CSS 4 的个人博客，已完成前端基础搭建、后端 API 开发、前后端集成、功能扩展及部署准备。

---

## 已完成阶段

### 阶段 1：前端基础搭建（PROJECT_FRONT/PROJECT.md）
- React 19 + TypeScript + Vite 8 + Tailwind CSS 4 + Framer Motion
- 主题系统：`ThemeContext` + `localStorage` 持久化 + `prefers-color-scheme` 检测
- Tailwind v4 暗色模式：`@custom-variant dark (&:is(.dark *))` 实现 class 策略
- 响应式布局：Navbar（桌面水平/移动汉堡菜单）、Aside（桌面侧边栏/移动横滑卡片）
- 页面路由：Home、Archive、About、404
- 全局背景系统 `BackgroundLayout`：随机选图、预加载淡入、主题遮罩
- 内容组件：Articles（文章列表）、TimeLine（时间轴）、LifeBoard（生活板块）
- 动画系统：页面切换 AnimatePresence、列表交错加载、头像呼吸效果、导航下划线滑动

### 阶段 2：Bug 修复与功能增强（PROJECT_FRONT/PROJECT2.md）
**修复的 Bug：**
1. Dark Mode 下 Articles 组件颜色问题 — 已修复
2. 背景图片加载闪烁 — 预加载 + 淡入动画
3. Archive.tsx 背景图片未显示 — 修复路径 + encodeURI
4. Dark/Light 模式背景无变化 — 遮罩层随主题切换

**新增功能：**
1. 文章详情页 `Post.tsx`：路由 `/post/:slug`，Markdown 渲染（react-markdown + remark-gfm）
2. 搜索功能：按标题/摘要/标签实时过滤，与标签筛选联动（AND 逻辑）
3. 文章分页：每页 5 篇，与搜索/标签过滤联动
4. 滚动条美化：自定义圆角样式，滚动时显示/停止后自动隐藏

### 阶段 3：后端开发（PROJECT_END/PROJECT.md）
**技术栈：** Node.js + Express 5 + TypeScript + Prisma + SQLite + GitHub OAuth + JWT

**Phase 1 — 基础架构：**
- Express 服务器 + 全局中间件（cors, helmet, morgan）
- Prisma 单例 + SQLite 配置
- 统一错误处理 `asyncHandler` + `errorHandler`
- 输入验证 `express-validator` + `validate` 中间件
- 统一响应类型 `ApiResponse<T>`

**Phase 2 — 认证系统：**
- GitHub OAuth 流程（Passport.js + GitHub Strategy）
- JWT 签发（7 天有效期）+ 验证中间件
- `authenticateJWT` + `requireAdmin` 中间件
- 路由：`GET /api/auth/github`、`GET /api/auth/github/callback`、`GET /api/auth/me`

**Phase 3 — 文章与标签 API：**
- Prisma 模型：User、Post、Tag、PostTag（多对多）
- slug 自动生成（标题转小写+连字符，重复追加数字）
- 路由：`GET/POST /api/posts`、`GET/PUT/DELETE /api/posts/:id`
- 标签路由：`GET /api/tags`、`POST /api/tags`、`DELETE /api/tags/:id`

**Phase 4 — 评论 API：**
- Prisma 模型：Comment（扁平表 + parentId，前端组装树形）
- 路由：`GET /api/comments`、`POST /api/comments`、`DELETE /api/comments/:id`、`PUT /api/comments/:id/approve`

**Phase 5 — 前端集成指导**

**Phase 6 — 部署配置：**
- GitHub Actions 工作流
- render.yaml 配置

### 阶段 4：前端全面集成后端 API
**替换静态数据为 API 调用：**
- `src/api/client.ts`：axios 实例 + 拦截器 + 完整类型定义
- `src/context/AuthContext.tsx`：全局认证状态管理
- `src/components/Articles.tsx`：`postsApi.getList()` 替代静态数据
- `src/pages/Post.tsx`：`postsApi.getBySlug(slug)` 替代 `getPostById`
- `src/components/CommentSection.tsx`：评论 CRUD API
- `src/components/layout/Aside.tsx`：`tagsApi.getAll()` 替代 `getAllTags()`
- `src/components/layout/Navbar.tsx`：登录/登出、用户菜单、管理员入口

**路由更新（App.tsx）：**
- `/post/:slug` — 文章详情
- `/auth/callback` — OAuth 回调
- `/admin/new` — 新建文章
- `/admin/edit/:slug` — 编辑文章

### 阶段 5：Bug 修复与功能扩展
**Bug 修复：**
1. **Dark Mode 不生效**：Tailwind v4 默认 `prefers-color-scheme`，需添加 `@custom-variant dark (&:is(.dark *))` 到 index.css
2. **背景图片不滚动**：`fixed` 定位改为 `absolute`，遮罩层保持 `fixed`
3. **图片画廊不加载**：
   - `encodeURIComponent` 编码了 `/`，改用 `encodeURI`
   - CSP/CORS 跨域问题，通过 Vite 代理解决
   - API 端点只返回 9 张图片
4. **头像路径错误**：尝试 `/img/Ole.webp` → `/image/OLP.webp` → 最终 `/image/OIP.webp`

**Vite 代理配置：**
```typescript
server: {
  proxy: {
    '/api': 'http://localhost:3000',
    '/image': 'http://localhost:3000',
  },
},
```

**新增功能：**
1. **管理员文章编辑**：Articles 列表悬浮显示编辑/删除按钮
2. **评论删除**：管理员和评论作者可删除，带确认对话框
3. **图片画廊**：`ImageGallery` 组件 + `/api/images` 端点扫描 `public/image/gallery`
4. **Loading Spinner**：`Spinner` 组件用于加载状态
5. **标签管理**：管理员可在 Aside 中添加/删除标签
6. **AdminPost 编辑改进**：
   - 修复编辑模式表单空白（使用 slug 参数加载文章）
   - 可点击已有标签进行切换
   - 移除 Cover Image URL 字段

### 阶段 6：个人内容更新
- **Aside**：头像 `/image/OIP.webp`，用户名 "Lilly"，签名更新
- **LifeBoard**：填充个人兴趣内容（Diverse System、Sakuzyo、ARForest、Monet、少女前线等）
- **图片资源**：`public/image/OIP.webp`（头像）、`public/image/gallery/`（画廊图片）

### 阶段 7：GitHub 部署准备
- `gh` CLI 推送代码到 GitHub
- 解决 OAuth token 缺少 `workflow` scope 问题
- 提交并推送所有代码到 `master` 分支

---

## 项目目录结构

```
self blog/
├── backend/
│   ├── prisma/schema.prisma          # 数据库模型
│   ├── src/
│   │   ├── config/env.ts, passport.ts
│   │   ├── middleware/auth.ts, errorHandler.ts, validate.ts
│   │   ├── routes/auth.ts, posts.ts, tags.ts, comments.ts, images.ts
│   │   ├── lib/prisma.ts
│   │   ├── types/api.ts, express.d.ts
│   │   ├── utils/asyncHandler.ts, slugify.ts
│   │   └── index.ts                  # Express 入口
│   ├── .env                          # GitHub OAuth + JWT 密钥
│   └── package.json
├── src/
│   ├── api/client.ts                 # axios API 客户端
│   ├── context/AuthContext.tsx       # 认证状态
│   ├── context/ThemeContext.tsx       # 主题切换
│   ├── hooks/useAuth.ts, useImages.ts
│   ├── components/
│   │   ├── layout/Navbar.tsx, Aside.tsx, BackgroundLayout.tsx
│   │   ├── Articles.tsx, CommentSection.tsx, ImageGallery.tsx, LifeBoard.tsx, TimeLine.tsx
│   │   └── ui/Spinner.tsx
│   ├── pages/Home.tsx, Archive.tsx, About.tsx, Post.tsx, AdminPost.tsx, NotFound.tsx
│   ├── App.tsx
│   └── index.css                     # Tailwind + 暗色模式配置
├── public/image/                     # 图片资源
├── vite.config.ts                    # Vite 代理配置
└── package.json
```

## 关键技术决策

| 决策 | 原因 |
|------|------|
| Tailwind v4 `@custom-variant` 暗色模式 | v4 默认 media query，需显式声明 class 策略 |
| Vite 代理解决图片跨域 | 开发环境前后端端口不同（5173 vs 3000） |
| `encodeURI` 替代 `encodeURIComponent` | 图片路径含 `/`，不能被编码 |
| 评论扁平表 + parentId | 后端简单，前端组装树形结构 |
| slug 参数路由 `/post/:slug` | SEO 友好，slug 唯一 |

## 待办事项
- [ ] Render 后端部署
- [ ] 生产环境 PostgreSQL 切换
- [ ] GitHub Actions 自动部署
- [ ] 文章封面图上传功能
- [ ] 评论审核功能完善
