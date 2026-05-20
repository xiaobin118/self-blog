# 项目状态总览

## 已完成

### 后端 API
- **认证系统**：GitHub OAuth + JWT，管理员自动识别
- **文章 CRUD**：分页、搜索、标签过滤，管理员可发布/编辑/删除
- **标签系统**：公开获取标签列表（含文章计数）
- **评论系统**：创建/查询/删除，支持嵌套回复
- **图片接口**：`/api/images` 扫描 `public/image/gallery` 返回 9 张图片

### 前端
- **API 集成**：所有组件已替换静态数据，调用后端 API
- **全局认证**：AuthContext + useAuth，Navbar 显示登录/注销
- **文章列表**：分页、搜索、标签过滤，管理员悬停显示编辑/删除
- **文章详情**：Markdown 渲染，管理员编辑/删除按钮，评论区
- **评论组件**：递归渲染评论树，删除功能（管理员/作者）
- **图片画廊**：侧栏展示 `public/image/gallery` 下的图片，点击放大
- **加载动画**：Spinner 组件用于各加载状态
- **黑暗模式**：Tailwind v4 class 策略（`@custom-variant dark`）
- **背景图片**：absolute 定位，长图可滚动查看
- **GitHub OAuth 回调**：`/auth/callback` 页面
- **管理员文章编辑**：`/admin/new` 和 `/admin/edit/:slug`

### 路由配置
| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | Home | 文章列表 + 标签过滤 + 图片画廊 |
| `/archive` | Archive | 时间线归档 |
| `/about` | About | 关于页面 |
| `/post/:slug` | Post | 文章详情 + 评论 |
| `/auth/callback` | AuthCallback | GitHub OAuth 回调 |
| `/admin/new` | AdminPost | 发布新文章 |
| `/admin/edit/:slug` | AdminPost | 编辑文章 |
| `*` | NotFound | 404 页面 |

### 部署配置
- `render.yaml`：Render 后端部署
- `.github/workflows/deploy.yml`：前端部署到 GitHub Pages
- `README.md`：完整项目文档

## 环境变量

### 后端 (`backend/.env`)
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="<random-secret>"
GITHUB_CLIENT_ID="<your-client-id>"
GITHUB_CLIENT_SECRET="<your-client-secret>"
GITHUB_CALLBACK_URL="http://localhost:3000/api/auth/github/callback"
FRONTEND_URL="http://localhost:5173"
ADMIN_GITHUB_IDS="<your-github-id>"
PORT=3000
NODE_ENV="development"
```

### 前端 (`.env`)
```
VITE_API_BASE_URL=http://localhost:3000
```

## 启动方式

```bash
# 后端
cd backend && npm run dev

# 前端（新终端）
npm run dev
```

## 关键文件清单

### 前端
- `src/api/client.ts` — API 客户端（axios + 类型定义）
- `src/context/AuthContext.tsx` — 全局认证状态
- `src/context/ThemeContext.tsx` — 主题切换
- `src/components/Articles.tsx` — 文章列表
- `src/components/CommentSection.tsx` — 评论组件
- `src/components/ImageGallery.tsx` — 图片画廊
- `src/components/layout/Navbar.tsx` — 导航栏（登录/注销）
- `src/components/layout/Aside.tsx` — 侧栏（标签 + 画廊）
- `src/components/layout/BackgroundLayout.tsx` — 背景布局
- `src/components/ui/Spinner.tsx` — 加载动画
- `src/pages/Post.tsx` — 文章详情
- `src/pages/AdminPost.tsx` — 文章编辑
- `src/pages/AuthCallback.tsx` — OAuth 回调

### 后端
- `backend/src/index.ts` — Express 入口
- `backend/src/config/passport.ts` — GitHub OAuth 配置
- `backend/src/controllers/postController.ts` — 文章控制器
- `backend/src/controllers/commentController.ts` — 评论控制器
- `backend/src/routes/posts.ts` — 文章路由
- `backend/src/routes/comments.ts` — 评论路由
- `backend/src/routes/tags.ts` — 标签路由
- `backend/src/routes/auth.ts` — 认证路由
- `backend/src/routes/images.ts` — 图片路由
- `backend/prisma/schema.prisma` — 数据库模型
