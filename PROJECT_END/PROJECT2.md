# 当前状态
前端已完成与后端 API 的全面集成，所有静态数据已替换为动态 API 调用。

## 已完成的功能

### 1. 后端 API（全部完成）
- **认证系统**：GitHub OAuth + JWT，登录后自动识别管理员
- **文章 CRUD**：分页、搜索、标签过滤，管理员可发布/编辑/删除
- **标签系统**：公开获取标签列表（含文章计数）
- **评论系统**：创建/查询/删除/审核，支持嵌套回复

### 2. 前端集成（全部完成）
- **API 客户端**：`src/api/client.ts`（axios 实例 + 类型定义 + JWT 拦截器）
- **全局认证**：`src/context/AuthContext.tsx`（AuthProvider + useAuth）
- **文章列表**：`src/components/Articles.tsx`（调用 API，支持分页/搜索/标签过滤）
- **文章详情**：`src/pages/Post.tsx`（调用 API，集成评论区）
- **标签侧栏**：`src/components/layout/Aside.tsx`（调用 API 获取标签）
- **时间线归档**：`src/components/TimeLine.tsx`（调用 API，按年分组）
- **导航栏**：`src/components/layout/Navbar.tsx`（登录/注销、管理员入口）
- **评论组件**：`src/components/CommentSection.tsx`（递归渲染、发表评论）
- **文章编辑**：`src/pages/AdminPost.tsx`（发布/编辑表单）
- **OAuth 回调**：`src/pages/AuthCallback.tsx`

### 3. 路由配置
| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | Home | 文章列表 + 标签过滤 |
| `/archive` | Archive | 时间线归档 |
| `/about` | About | 关于页面 |
| `/post/:slug` | Post | 文章详情 + 评论 |
| `/auth/callback` | AuthCallback | GitHub OAuth 回调 |
| `/admin/new` | AdminPost | 发布新文章 |
| `/admin/edit/:slug` | AdminPost | 编辑文章 |
| `*` | NotFound | 404 页面 |

### 4. 环境变量配置（已完成）
- `backend/.env`：GitHub OAuth 凭据、JWT_SECRET、ADMIN_GITHUB_IDS 已配置
- `.env`：`VITE_API_BASE_URL=http://localhost:3000`

## 启动方式

```bash
# 后端
cd backend
npm run dev

# 前端（新终端）
npm run dev
```

## 部署配置（已完成）
- `render.yaml`：Render 后端部署
- `.github/workflows/deploy.yml`：前端自动部署到 GitHub Pages
- `README.md`：完整项目文档
