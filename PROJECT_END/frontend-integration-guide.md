# 前端集成指南

## 1. 环境变量

创建 `.env` 文件：

```
VITE_API_BASE_URL=http://localhost:3000
```

## 2. 新增文件

已创建以下文件：

- `src/api/client.ts` — API 客户端（axios 实例 + 类型定义）
- `src/hooks/useAuth.ts` — 认证 Hook（登录/注销/获取当前用户）
- `src/components/CommentSection.tsx` — 评论组件（递归渲染评论树）
- `src/components/LoginButton.tsx` — 登录/注销按钮
- `src/pages/AdminPost.tsx` — 文章发布/编辑页面
- `src/pages/AuthCallback.tsx` — GitHub OAuth 回调处理

## 3. 路由修改

在 `src/App.tsx` 中添加路由：

```tsx
import AuthCallback from './pages/AuthCallback';
import AdminPost from './pages/AdminPost';

// 在 Routes 中添加：
<Route path="/auth/callback" element={<AuthCallback />} />
<Route path="/admin/new" element={<AdminPost />} />
<Route path="/admin/edit/:id" element={<AdminPost />} />
```

## 4. 替换静态数据

将 `src/data/posts.ts` 的静态数据替换为 API 调用：

```tsx
// 在 Articles.tsx 中
import { postsApi } from '../api/client';

// 使用 useEffect 获取数据
const [posts, setPosts] = useState([]);
useEffect(() => {
  postsApi.getList({ page: 1, limit: 10 }).then(res => {
    if (res.success) setPosts(res.data.items);
  });
}, []);
```

## 5. 文章详情页集成评论

在 `src/pages/Post.tsx` 中添加评论区：

```tsx
import CommentSection from '../components/CommentSection';

// 在文章内容后添加：
<CommentSection postId={post.id} />
```

## 6. 导航栏集成登录

在 `src/components/layout/Navbar.tsx` 中添加：

```tsx
import LoginButton from '../LoginButton';

// 在导航栏适当位置添加：
<LoginButton />
```

## 7. GitHub OAuth 配置

1. 在 GitHub Settings > Developer settings > OAuth Apps 创建应用
2. 设置 Homepage URL: `http://localhost:5173`
3. 设置 Callback URL: `http://localhost:3000/api/auth/github/callback`
4. 将 Client ID 和 Secret 配置到后端 `.env`

## 8. 管理员配置

在后端 `.env` 中设置 `ADMIN_GITHUB_IDS` 为你的 GitHub 用户 ID（数字），多个用逗号分隔。

获取 GitHub ID：访问 `https://api.github.com/users/<username>` 查看 `id` 字段。
