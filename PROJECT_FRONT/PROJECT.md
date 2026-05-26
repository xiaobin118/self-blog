# 角色与目标
你是一位资深 React 前端专家和 UI/UX 设计师。请从零实现一个极具设计感的个人博客网站，严格按照以下 5 个步骤输出完整的代码。

## 技术栈
- React 19 + TypeScript
- Vite
- TailwindCSS（使用 class 策略实现亮暗色模式）
- React Router v6
- MaterialUI Icons（@mui/icons-material）
- Framer Motion

## 整体要求
- 包含完整的 TypeScript 类型定义，不使用 any。
- 响应式设计：适配移动端（<768px）、平板（768px-1024px）、桌面端（>1024px）。
- 亮暗色模式：使用 Tailwind 的 `dark:` 修饰符 + ThemeContext 全局管理，并持久化到 localStorage。
- 所有图片路径基于 `/public` 目录，使用绝对路径（例如 `/image/home/xxx.jpg`）。
- **使用 Git 管理整个项目**

---

## Step 1：项目配置与主题系统

请提供以下文件：

### 1.1 tailwind.config.js
- 开启 `darkMode: 'class'`
- 配置自定义颜色变量（bg、card、text、accent 等），亮色和暗色模式分别定义。

### 1.2 src/index.css
- 引入 Tailwind 基础层
- 定义全局 CSS 变量，自定义滚动条样式（适配亮暗色）
- 确保 body 在主题切换时有 `transition-colors duration-300` 平滑过渡

### 1.3 src/context/ThemeContext.tsx
- 创建 ThemeProvider，管理 `theme` 状态（'light' | 'dark'）
- 提供 `toggleTheme` 方法
- 首次加载时读取 localStorage，若没有则根据 `prefers-color-scheme` 决定
- 将主题 class 添加到 `<html>` 元素上

### 1.4 src/App.tsx
- 引入 ThemeProvider 包裹整个应用
- 配置 react-router-dom 路由：`/` (Home)，`/archive` (Archive)，`/about` (About)，以及 404 重定向
- 使用 AnimatePresence 包裹 Routes，为页面切换添加过渡动画（参见动画要求）

---

## Step 2：响应式导航栏与侧边栏

### 2.1 Navbar.tsx
**布局要求：**
- 桌面端：水平展示链接（Home, Archive, About, GitHub, Search）
- 移动端：汉堡菜单按钮，点击展开全屏/下拉式菜单（使用 framer-motion 动画）
- 包含一个主题切换按钮（🌞/🌙 图标）
- GitHub 链接使用 `<a>` 外链，Search 按钮暂时无功能（仅 UI）

**动画要求：**
- 所有链接/按钮添加 `whileHover={{ scale: 1.05 }}` 和 `whileTap={{ scale: 0.95 }}`
- 当前激活的路由（active）底部有一个平滑滑动的下划线，使用 `layoutId="activeTab"` 实现

### 2.2 Aside.tsx
**内容：**
- 用户头像（可用占位符图片或 Material Icon）
- 用户名：Lilly
- 个性签名：「Gott ist tot. Hi there, I'm a programmer who loves anime.」
- 标签列表：Arch Linux, CLI Tools, Conda, Customization, Dark Mode, DSP, Extension

**响应式：**
- 桌面端：固定在右侧或左侧，宽度 280px
- 移动端：变为页面顶部的横向滚动卡片（或隐藏在一个抽屉中，点击汉堡菜单时展示）

**动画：**
- 头像添加呼吸效果：`animate={{ opacity: [0.7, 1, 0.7] }}`，循环
- 每个标签 hover 时：`scale 1.02`，背景色加深，过渡平滑

---

## Step 3：全局背景布局系统

### 3.1 BackgroundLayout.tsx
**功能：**
- 接收 props：`imageUrls: string[]` 和 `children: React.ReactNode`
- 组件挂载时，从数组中**随机选择**一张作为背景
- 背景使用 `bg-cover bg-center bg-fixed`
- 覆盖一层半透明遮罩：
  - 暗色模式：`bg-black/60`
  - 亮色模式：`bg-white/40`
  - 同时添加 `backdrop-blur-sm`
- 此组件作为页面的根容器，配合 App.tsx 中的 AnimatePresence，在此组件上添加**页面进入/退出动画**（opacity 0→1，y 20→0，持续 0.3s，缓动 easeInOut）

**注意：** 因为每个页面的背景图不同，所以三个页面会各自调用 BackgroundLayout 并传入不同的图片数组。

### 3.2 你提供的实际图片路径（请严格使用）

**Home 页面（莫奈画作）** – 位于 `/public/image/home/`
woman_with_a_parasol_-_madame_monet_and_her_son_1983.1.29.jpg

普维尔悬崖漫步.jpg

153-莫奈- Bend in the Epte River near Giverny.webp

400-莫奈-Woman Seated under the Willows.webp

**Archive 页面（赛博朋克/科技风）** – 位于 `/public/image/achieve/`（注意你的文件夹名为 `achieve`，请保持）
the-neon-lit-streets-of-a-cyberpunk-anime-night-city-with-this-captivating-4k-wallpaper-generated-ai-free-photo.jpg


**About 页面（音乐/现代风格）** – 位于 `/public/image/about/`
AD House12.jpg

AD PainoX.jpg

AD PianoIX.jpg

AD PiaonIV.jpg

Qualia.jpg

work.jpg

text
复制
下载

---

## Step 4：页面路由级组件开发

每个页面必须被 `BackgroundLayout` 包裹，并传入对应的图片数组。

### 4.1 Home.tsx
- 传入 `/image/home/` 下的图片数组
- 主内容为 `<Articles />` 组件
- 使用 Tailwind 网格布局：左侧 `<Articles />` 自适应，右侧 `<Aside />` 宽度 280px（桌面端）
- 移动端：侧边栏放在文章列表上方

### 4.2 Archive.tsx
- 传入 `/image/achieve/` 下的图片数组
- 主内容为 `<TimeLine />` 组件（按年份分组的时间轴）
- 布局同上

### 4.3 About.tsx
- 传入 `/image/about/` 下的图片数组
- 主内容为 `<LifeBoard />` 组件（Music, Art, Game 三个板块）
- 布局：桌面端三列网格，移动端单列

### 4.4 内容组件（Articles, TimeLine, LifeBoard）
请根据之前你提供的博客数据（2025/2024 年文章列表）生成**静态示例数据**，确保显示完整。

**Articles.tsx** – 显示近期 5 篇左右的文章（包含标题、日期、标签）。
**TimeLine.tsx** – 按年份分组（2026、2025、2024），每组显示文章列表，格式参考截图。
**LifeBoard.tsx** – 三个板块，每个板块内部有示例条目（例如“正在听的歌”、“最近玩的游戏”、“喜欢艺术家”），后续可替换。

---

## Step 5：进阶动效与细节打磨

### 5.1 页面切换动画（已在 App.tsx 和 BackgroundLayout 中实现）
- 使用 `AnimatePresence` 和 `motion`，每个页面进入/退出：opacity + y 位移

### 5.2 列表交错加载动画（Stagger）
- 在 `Articles.tsx` 和 `TimeLine.tsx` 中，将文章卡片列表用 `motion.div` 包裹，设置 `variants`：
  - 父容器：`visible: { transition: { staggerChildren: 0.05 } }`
  - 子卡片：`hidden: { opacity: 0, y: 20 }`，`visible: { opacity: 1, y: 0 }`
- 每个卡片过渡 `duration: 0.3`

### 5.3 LifeBoard 动态展示
- 三个卡片 hover 时：`scale 1.02`，阴影加深
- 每个板块内部的内容条目在加载时依次淡入（使用 staggerChildren）
- **折叠动画**（可选但推荐）：点击板块标题时，使用 `<AnimatePresence>` 配合 `motion.div` 的 `height: 0` → `height: "auto"` 动画展开/收起内部内容。请实现此功能。

### 5.4 其他动画
- 侧边栏头像呼吸效果（已在 Aside 中实现）
- 导航栏激活下划线滑动（已在 Navbar 中实现）
- 所有按钮/标签的 hover/tap 反馈

### 5.5 深浅色平滑过渡
- 所有组件中的颜色（背景、文字、边框）应使用 Tailwind 的 `dark:` 变体，并通过 `transition-colors duration-300` 确保切换主题时柔和过渡。

---

## 输出要求（请按顺序给出每个文件的完整代码）

请输出以下文件的代码，每个文件标注路径和完整内容，不要省略。如果某个文件已存在，则覆盖。

1. `tailwind.config.js`
2. `src/index.css`
3. `src/context/ThemeContext.tsx`
4. `src/App.tsx`
5. `src/components/Navbar.tsx`
6. `src/components/Aside.tsx`
7. `src/components/BackgroundLayout.tsx`
8. `src/components/Articles.tsx`
9. `src/components/TimeLine.tsx`
10. `src/components/LifeBoard.tsx`
11. `src/pages/Home.tsx`
12. `src/pages/Archive.tsx`
13. `src/pages/About.tsx`
14. `src/pages/NotFound.tsx`（简单的 404 页面）

**额外说明：**
- 确保所有图片路径使用 `/image/...`（注意大小写，你的文件夹是 `image` 不是 `images`）
- 由于 `achieve` 文件夹下只有一张图，Archive 页面的背景数组只包含这一张即可。
- 所有组件必须使用 TypeScript，定义好 Props 接口。
- 在响应式布局中，侧边栏在移动端应如何处理？请实现：桌面端固定宽度 280px 显示在右侧，移动端该侧边栏变为一个横向滚动卡片（显示在文章列表上方），且标签可横向滚动。

现在请按照以上 5 个步骤，一步一步输出代码。开始吧！

