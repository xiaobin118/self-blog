Problem:
    1. The most important, 依然没有使用git进行版本控制，在开发过程中一定要使用git add， git commit等命令进行版本控制，养成良好的习惯。
    2. **Dark/Light 模式切换时背景几乎没有视觉变化** 依然存在
    3. **Archive.tsx 背景图片未显示** 依然存在, 可以在网络上找到一些免费的背景图片，放在 `public/image/achieve/` 文件夹下，并确保路径正确。

    参考https://blog.yuuzi.cc/ 的博客，换主题时背景颜色也有明显变化, finish Dark mode

## Bug 4: 进入页面时背景闪烁（尺寸变化）

进入页面时，背景图会出现闪烁现象，表现为尺寸突然变化。可能原因：
- 背景图加载过程中 `opacity` 从 0 到 1 的过渡与 CSS transition 冲突
- `backdrop-blur` 在图片加载时重新计算导致重绘
- 固定定位的背景层在页面切换时布局抖动

请修复 BackgroundLayout.tsx，确保：
- 背景图加载过程平滑无闪烁
- 页面切换时背景过渡自然
- 不出现任何尺寸跳变

