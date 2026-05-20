# 角色与目标
你是一位资深后端工程师和全栈架构师。请从零实现一个完整的 Node.js 后端服务，为个人博客网站提供 API 支持。前端已完成（React + TypeScript 等），你需要让网站具备动态数据管理、用户评论、管理员发布文章、GitHub 社交登录等功能，并最终让整个项目托管到 GitHub 上，所有人都能访问。

## 重要：输出方式（分阶段进行）
**请不要一次性输出整个项目**。请严格按照下面的步骤**逐步生成**。每完成一个步骤，输出该步骤所有相关文件的完整代码，并等待我确认“继续”，然后再进行下一步。每一步的代码必须独立可运行，不依赖后续未生成的代码。

## 技术栈（后端）
- Node.js (v20 LTS) + Express.js
- TypeScript
- Prisma (ORM) + SQLite（开发环境） / PostgreSQL（生产环境）
- Passport.js + GitHub Strategy（仅用于 OAuth 流程，不使用 session）
- JSON Web Token (JWT)
- cors, helmet, morgan, express-validator
- dotenv

## 整体要求
- 完整的 TypeScript 类型定义，不使用 any。
- RESTful API 风格，统一返回格式使用 `ApiResponse<T>` 接口。
- API 统一前缀 `/api`。
- 使用 Prisma 单例模式（`src/lib/prisma.ts`），避免热重载创建多个实例。
- SQLite 开发时，Prisma datasource 需要设置 `relationMode = "prisma"`。
- GitHub OAuth：不使用 session，OAuth 成功后签发 JWT，前端存储 token，后续请求使用 `Authorization: Bearer <token>`。
- 管理员权限：通过环境变量 `ADMIN_GITHUB_IDS`（逗号分隔的 GitHub ID 字符串）配置，该用户登录后自动拥有管理员权限。
- 数据库模型：用户、文章、标签（多对多）、评论（扁平表 + parentId，前端组装树形结构）。
- 文章 slug：唯一，生成规则：标题 → 小写 → 替换空格为连字符 → 若重复则追加数字（如 `my-post`, `my-post-1`, `my-post-2`）。
- 所有接口需要统一的错误处理中间件，避免重复 try-catch。使用 `asyncHandler` 包装异步路由。
- 输入验证使用 `express-validator`，并统一在 `validate` 中间件中处理验证错误，返回 `ApiResponse` 格式。
- 评论不需要递归查询，API 返回扁平数组，前端负责递归组装。
- CORS 配置：只允许环境变量 `FRONTEND_URL` 指定的源，并支持 credentials。
- 开发环境使用 SQLite，生产环境使用 PostgreSQL（通过 DATABASE_URL 切换），部署时使用 `prisma migrate deploy`。

---

## 项目目录结构（必须严格遵循）
backend/
├── prisma/
│ └── schema.prisma
├── src/
│ ├── config/
│ │ ├── env.ts # 环境变量解析与校验
│ │ └── passport.ts # Passport GitHub Strategy 配置
│ ├── controllers/ # 业务逻辑（posts, comments, auth 等）
│ ├── middleware/ # auth, errorHandler, validate, asyncHandler
│ ├── routes/ # 路由定义（/api/posts, /api/comments 等）
│ ├── lib/
│ │ └── prisma.ts # PrismaClient 单例
│ ├── types/
│ │ ├── api.ts # 统一响应类型 ApiResponse
│ │ └── express.d.ts # 扩展 Request 类型，添加 user
│ ├── utils/ # 工具函数（slugify, asyncHandler 等）
│ └── index.ts # 应用入口
├── package.json
├── tsconfig.json
└── .env.example

---

## 分阶段任务

### 阶段 1：基础架构与环境配置（不包含业务模型）
生成以下文件（确保 Express 可以启动，Prisma 客户端能生成，但没有 User/Post 等模型）：
- `package.json`
- `tsconfig.json`
- `.env.example`
- `prisma/schema.prisma`：**只包含 generator 和 datasource**（不含任何 model）。配置 SQLite 作为开发数据库，并设置 `relationMode = "prisma"`。
- `src/lib/prisma.ts`：PrismaClient 单例。
- `src/config/env.ts`：校验所有必需的环境变量，缺变量时抛出错误。
- `src/types/api.ts`：定义 `ApiResponse<T>` 接口。
- `src/utils/asyncHandler.ts`：包装异步路由函数，自动捕获错误并传递给 errorHandler。
- `src/middleware/errorHandler.ts`：统一错误处理中间件，返回 `ApiResponse` 格式。
- `src/middleware/validate.ts`：配合 express-validator，统一处理验证错误。
- `src/index.ts`：基础 Express，挂载全局中间件（cors, helmet, morgan, json），添加 `/health` 测试路由，挂载 errorHandler。
- 提供初始化脚本命令：`npm run migrate:dev`（仅创建数据库，无需迁移），`npm run dev` 启动开发服务器。

**注意**：阶段 1 绝对不要创建任何业务模型（User, Post 等）。

### 阶段 2：认证系统（GitHub OAuth + JWT）
- 扩展 `prisma/schema.prisma`：添加 `User` 模型（字段：id, githubId String @unique, username, avatarUrl, email, role UserRole, createdAt, updatedAt）。定义 `enum UserRole { ADMIN USER }`。
- 生成迁移并执行 `npx prisma migrate dev --name add_user`，更新 Prisma Client。
- `src/config/passport.ts`：配置 GitHub Strategy，不使用 session，返回用户信息（从数据库 findOrCreate）。
- `src/middleware/auth.ts`：
  - `authenticateJWT`：验证 JWT，将用户信息挂载到 `req.user`（类型为 `JwtPayload`）。
  - `requireAdmin`：检查 `req.user.role === 'ADMIN'`，否则返回 403。
- `src/routes/auth.ts`：
  - `GET /api/auth/github` – 重定向到 GitHub。
  - `GET /api/auth/github/callback` – 回调，调用 Passport 认证，成功后将 `{ userId, role }` 签名为 JWT（有效期 7 天），并重定向到 `${FRONTEND_URL}/auth/callback?token=<jwt>`。
  - `GET /api/auth/me` – 需要 JWT 认证，返回当前用户信息（不含敏感数据）。
- `src/types/express.d.ts`：扩展 `Request` 接口，添加 `user: { userId: string; role: 'ADMIN' | 'USER' }`。
- 定义 JWT payload 类型（在 `src/types/jwt.ts` 或直接内联）：`{ userId: string; role: UserRole }`。
- 确保 JWT_SECRET 在 env 中。
- 提供 Postman 测试示例。

### 阶段 3：文章与标签 API
- 扩展 `schema.prisma`：添加 `Post`, `Tag`, `PostTag` 模型。
  - `Post`：id, slug @unique, title, content, summary, coverImage?, published Boolean @default(false), publishedAt DateTime? , createdAt, updatedAt, authorId (关联 User)
  - `Tag`：id, name @unique
  - `PostTag`：postId, tagId @@unique([postId, tagId])
- 生成迁移并执行。
- `src/utils/slugify.ts`：实现 `generateUniqueSlug` 函数，检查重复并追加数字。
- `src/routes/posts.ts` + `src/controllers/postController.ts`：
  - `GET /api/posts` – 公开，分页（page, limit），标签过滤（tag），搜索（q 搜索 title+content），按 publishedAt 降序。
  - `GET /api/posts/:slug` – 公开，获取单篇文章详情（包含标签和作者基本信息）。
  - `POST /api/posts` – 管理员，创建文章（title, content, summary, published, tags: string[]）。自动生成 slug。
  - `PUT /api/posts/:id` – 管理员，更新文章。
  - `DELETE /api/posts/:id` – 管理员，删除文章（级联删除评论）。
- `src/routes/tags.ts`：`GET /api/tags` – 返回所有标签及使用次数。
- 输入验证使用 `express-validator`，在路由中调用 `validate` 中间件。
- 所有控制器使用 `asyncHandler` 包装。

### 阶段 4：评论 API
- 扩展 `schema.prisma`：添加 `Comment` 模型（id, content, postId, userId, parentId? , createdAt, isApproved Boolean @default(true)）。
- 生成迁移。
- `src/routes/comments.ts` + `src/controllers/commentController.ts`：
  - `GET /api/comments?postId=xxx` – 公开，返回该文章的所有评论（**扁平数组**，包含用户信息（username, avatarUrl），按 createdAt 升序）。
  - `POST /api/comments` – 需要登录，发表评论（body: { postId, content, parentId? }）。
  - `DELETE /api/comments/:id` – 管理员或评论作者本人可删除。
- 可选：管理员接口 `PUT /api/comments/:id/approve` 审核评论（如果使用 isApproved）。
- 输入验证，使用 asyncHandler。

### 阶段 5：前端集成指导（不生成完整前端代码，只提供关键修改指南）
- 环境变量：`VITE_API_BASE_URL`
- 提供 `src/api/client.ts` 示例：配置 axios 实例，自动添加 Authorization 头，处理响应格式。
- 提供 `src/hooks/useAuth.ts`：处理登录、注销、获取当前用户。
- 提供 `src/components/CommentSection.tsx` 示例：递归渲染评论树，发表评论表单。
- 提供 `src/pages/AdminPost.tsx` 示例：简单的文章发布/编辑表单（标题、内容、标签选择器）。
- 提供 `src/App.tsx` 路由修改指南（添加 `/post/:slug`, `/admin/new` 等）。
- 说明如何替换静态文章数据为 API 调用。

### 阶段 6：部署配置
- 提供 `Dockerfile` 多阶段构建（可选）。
- 提供 `render.yaml` 或 `railway.json` 配置示例（针对后端服务）。
- 提供 GitHub Actions 工作流文件 `.github/workflows/deploy.yml`：
  - 前端构建并部署到 gh-pages 分支
  - 后端构建并部署到 Render/Railway（可选，需要配置环境变量）
- 根目录 `README.md`：项目介绍、本地运行（同时启动前后端）、环境变量表、部署链接、常见问题。
- 明确开发和生产数据库切换：开发使用 SQLite（`file:./dev.db`），生产使用 PostgreSQL（通过环境变量 `DATABASE_URL`），部署时运行 `npx prisma migrate deploy`。

---

## 输出要求（严格按照阶段顺序）

请先输出 **阶段 1** 的所有文件，并等待我的“继续”指令。每阶段文件列表必须完整，代码无省略，类型定义齐全。

开始输出阶段 1。
