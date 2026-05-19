你已经在之前帮我实现了一个 React + TypeScript + Vite + TailwindCSS + Framer Motion 的个人博客网站的基础版本。现在项目存在一些 bug 和需要增加的新功能。请基于我现有的代码进行修改和补充。
## 现有问题（需要修复）

1. **Dark Mode 下 Articles 组件颜色问题**：在暗色模式中，文章卡片的背景仍是白色（与亮色模式相同），缺乏区分度。请修改 Articles.tsx 及其相关卡片组件，确保暗色模式下卡片背景为深灰色（如 `dark:bg-gray-800`），文字为浅色（`dark:text-white` 或 `dark:text-gray-200`），并且所有颜色切换带有 `transition-colors duration-300` 平滑过渡。

2. **背景图片加载速度慢**：页面 DOM 加载完成后，背景图片经常晚几秒才显示。请优化 BackgroundLayout.tsx：
   - 实现图片预加载（使用 `new Image()` 并在 `onload` 后设置背景）
   - 添加淡入动画（背景图从透明到不透明，过渡时长 0.5s）
   - 设置降级纯色背景（在图片加载前显示与遮罩相近的深色）
   - （可选）压缩或推荐使用 WebP 格式，但代码层面请保留原有图片路径。

3. **Archive.tsx 背景图片未显示**：归档页面的背景图为空白。请检查：
   - 图片路径是否正确（`/image/achieve/` 文件夹下只有一张图片，请确保路径字符串完全匹配，包括文件名中的空格和特殊字符）
   - 如果需要，请对文件名进行 URL 编码处理（如 `encodeURI`）
   - 确认 BackgroundLayout 随机选取逻辑在该页面工作正常。

4. **Dark/Light 模式切换时背景几乎没有视觉变化**：当前遮罩层固定为 `bg-black/50`，不会随主题改变。请修改 BackgroundLayout 中的遮罩 div：
   - 亮色模式：使用 `bg-black/30` 或 `bg-white/20`
   - 暗色模式：使用 `bg-black/70`
   - 确保切换主题时遮罩颜色平滑过渡（已有 `transition-colors`）

5. **项目未使用 Git 版本控制**：请提供：
   - 一个完整的 `.gitignore` 文件内容（包含 `node_modules/`, `dist/`, `.env`, `*.log`, `.vite/`, `.DS_Store` 等）
   - 并在最后输出“Git 初始化步骤说明”，包含 `git init`, `git add .`, `git commit -m "..."` 命令。


## 新功能需求

### 功能1：文章详情页
- 当用户在首页（Articles 组件）点击文章标题时，跳转到独立的文章详情页。
- 需要创建新页面 `src/pages/Post.tsx`，路由为 `/post/:id`
- 创建文章数据源 `src/data/posts.ts`，定义 `Post` 接口（包含 `id`, `title`, `date`, `tags`, `summary`, `content` 等字段）。
- 至少提供 5 篇示例文章（内容可基于之前截图中的博客标题模拟 Markdown 内容）。
- 详情页布局应包含 Navbar、Aside（与首页相同），背景可使用 Home 页的莫奈画作集（或单独指定）。
- 文章内容支持 Markdown 渲染（安装 `react-markdown` 和 `remark-gfm` 并在代码中导入使用）。

### 功能2：搜索功能
- 在 Articles 组件顶部增加搜索输入框，支持**按文章标题、摘要、标签**进行实时过滤。
- 侧边栏（Aside 组件）中的标签列表也应该可点击，点击后过滤显示该标签下的文章。
- 搜索和标签过滤可以组合使用（AND 逻辑）。
- 搜索结果应实时更新文章列表，无结果时显示“未找到文章”。
- 使用 Framer Motion 为过滤后的列表添加简单的淡入动画（可选）。

### 功能3：文章分页
- 由于文章数量可能增多，请在 Articles 组件中实现分页功能。
- 每页显示 5 篇文章。
- 在文章列表下方显示“上一页/下一页”按钮和当前页数/总页数。
- 分页与搜索/标签过滤联动：过滤后重新计算总页数，并重置到第一页。

### 美化Scroll(滚动条)，取消默认的滚动条样式，设计一个更符合整体风格的滚动条（圆角），

- 并且在滚动时添加一个淡入淡出的动画效果，使其在用户滚动时显示，在停止滚动后几秒钟自动隐藏。

## 其他要求
- 所有新增的组件和文件必须使用 TypeScript，定义好 props 和 state 类型。
- 保持已有的响应式布局和动画效果不破坏。
- 修改完成后，请输出所有涉及修改的文件的**完整代码**（包括新建的文件）。
- 请按以下顺序输出文件：
  1. `src/data/posts.ts`（新建）
  2. `src/pages/Post.tsx`（新建）
  3. `src/components/Articles.tsx`（修改）
  4. `src/components/Aside.tsx`（修改，使标签可点击并触发过滤）
  5. `src/components/BackgroundLayout.tsx`（修改，优化背景加载和主题遮罩）
  6. `src/App.tsx`（添加详情页路由）
  7. `.gitignore`（提供内容）
  8. 最后输出“Git 初始化步骤”和“安装新依赖的命令”（`npm install react-markdown remark-gfm`）。

请开始逐步输出上述文件和说明。
