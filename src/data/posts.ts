export interface Post {
  id: number;
  title: string;
  date: string;
  tags: string[];
  summary: string;
  content: string;
}

export const posts: Post[] = [
  {
    id: 1,
    title: 'Building a Personal Blog with React and Tailwind CSS',
    date: '2026-05-15',
    tags: ['React', 'Tailwind CSS', 'TypeScript'],
    summary: 'A deep dive into building a modern personal blog using React 19, Tailwind CSS 4, and Framer Motion.',
    content: `# Building a Personal Blog with React and Tailwind CSS

## Why React + Tailwind?

After trying various frameworks, I settled on **React 19** with **Tailwind CSS 4** for this blog. The combination offers:

- Excellent developer experience with Vite
- Utility-first styling that scales
- Type safety with TypeScript

## Getting Started

First, scaffold the project:

\`\`\`bash
npm create vite@latest my-blog -- --template react-ts
cd my-blog
npm install tailwindcss @tailwindcss/vite
\`\`\`

## Theme System

Tailwind v4 uses CSS-based configuration with \`@theme\`:

\`\`\`css
@import "tailwindcss";

@theme {
  --color-bg-light: #ffffff;
  --color-bg-dark: #16171d;
}
\`\`\`

Dark mode is handled by adding a \`dark\` class to the \`<html>\` element, which activates all \`dark:\` utilities.

## Animations with Framer Motion

Page transitions are smooth with \`AnimatePresence\`:

\`\`\`tsx
<AnimatePresence mode="wait">
  <Routes location={location} key={location.pathname}>
    {/* routes */}
  </Routes>
</AnimatePresence>
\`\`\`

## Conclusion

This stack provides a solid foundation for a modern personal blog. The combination of React's component model, Tailwind's utility classes, and Framer Motion's animation capabilities creates a delightful developer and user experience.
`,
  },
  {
    id: 2,
    title: 'My Arch Linux Rice Setup 2026',
    date: '2026-04-20',
    tags: ['Arch Linux', 'Customization', 'Linux'],
    summary: 'Documenting my latest Arch Linux desktop configuration with Hyprland and Waybar.',
    content: `# My Arch Linux Rice Setup 2026

## The Journey

I've been using Arch Linux for over 3 years now. This year, I switched from **i3wm** to **Hyprland** for Wayland support.

## My Setup

| Component | Choice |
|-----------|--------|
| Distro | Arch Linux |
| WM | Hyprland |
| Bar | Waybar |
| Terminal | Alacritty |
| Shell | Zsh + Starship |
| Editor | Neovim |

## Hyprland Config Highlights

\`\`\`bash
# ~/.config/hypr/hyprland.conf
monitor=,preferred,auto,1
general {
    gaps_in = 5
    gaps_out = 10
    border_size = 2
    col.active_border = rgba(c084fcff)
}
\`\`\`

## Ricing Tips

1. **Start with a color scheme** — I use a custom purple/dark theme
2. **Keep it minimal** — less is more
3. **Make it functional** — beauty shouldn't sacrifice usability
4. **Document everything** — you'll forget your configs otherwise

## Dotfiles

All my dotfiles are available on my GitHub. Feel free to use them as inspiration!
`,
  },
  {
    id: 3,
    title: 'Understanding DSP: From Theory to Practice',
    date: '2026-03-10',
    tags: ['DSP', 'Mathematics', 'Signal Processing'],
    summary: 'Exploring digital signal processing fundamentals and implementing basic filters in Python.',
    content: `# Understanding DSP: From Theory to Practice

## What is DSP?

Digital Signal Processing (DSP) is the manipulation of signals after they have been converted from analog to digital form.

## Key Concepts

### Sampling

The **Nyquist theorem** states that to accurately represent a signal, you must sample at least **twice** the highest frequency component:

$$f_s \geq 2 \cdot f_{max}$$

### The Z-Transform

The Z-transform is the discrete equivalent of the Laplace transform:

$$X(z) = \sum_{n=-\infty}^{\infty} x[n] z^{-n}$$

## Implementing a Simple Filter

\`\`\`python
import numpy as np
from scipy import signal

# Design a lowpass Butterworth filter
b, a = signal.butter(4, 0.1, 'low')

# Apply the filter
filtered = signal.filtfilt(b, a, noisy_signal)
\`\`\`

## Practical Applications

- **Audio processing**: noise reduction, equalization
- **Image processing**: blurring, edge detection
- **Communications**: modulation, demodulation
- **Biomedical**: ECG analysis, EEG processing

## Resources

- *Understanding Digital Signal Processing* by Richard Lyons
- *The Scientist and Engineer's Guide to DSP* by Steven Smith (free online)
`,
  },
  {
    id: 4,
    title: 'Dark Mode Done Right: A Complete Guide',
    date: '2025-12-05',
    tags: ['Dark Mode', 'CSS', 'UI/UX'],
    summary: 'Best practices for implementing dark mode in modern web applications with smooth transitions.',
    content: `# Dark Mode Done Right

## Why Dark Mode?

Dark mode isn't just a trend — it reduces eye strain in low-light environments and can save battery on OLED screens.

## Implementation Strategy

### CSS Custom Properties

\`\`\`css
:root {
  --bg: #ffffff;
  --text: #1a1a1a;
}

.dark {
  --bg: #1a1a1a;
  --text: #e5e5e5;
}
\`\`\`

### Tailwind's Class Strategy

Tailwind CSS uses a \`class\` strategy for dark mode:

\`\`\`js
// tailwind.config.js
module.exports = {
  darkMode: 'class',
}
\`\`\`

Then use \`dark:\` utilities:

\`\`\`html
<div class="bg-white dark:bg-gray-900">
  <p class="text-black dark:text-white">Hello</p>
</div>
\`\`\`

## Smooth Transitions

The key to a polished dark mode is **smooth transitions**:

\`\`\`css
* {
  transition: background-color 0.3s ease,
              color 0.3s ease,
              border-color 0.3s ease;
}
\`\`\`

## Best Practices

1. **Respect system preference** — use \`prefers-color-scheme\` as default
2. **Allow manual toggle** — some users prefer one mode regardless of system
3. **Persist the choice** — save to \`localStorage\`
4. **Test both modes** — don't ship broken dark themes
5. **Transition smoothly** — abrupt changes are jarring

## Common Pitfalls

- Forgetting about images (add a slight brightness reduction in dark mode)
- Not testing scrollbars
- Ignoring form elements
- Using pure black (#000) — dark gray (#1a1a1a) is easier on the eyes
`,
  },
  {
    id: 5,
    title: 'Conda Environment Management Tips',
    date: '2025-09-18',
    tags: ['Conda', 'Python', 'DevOps'],
    summary: 'Tips and tricks for managing Python environments efficiently with Conda.',
    content: `# Conda Environment Management Tips

## Why Conda?

While \`venv\` and \`pip\` work for simple projects, Conda excels at:

- Managing **non-Python dependencies** (C libraries, CUDA, etc.)
- **Reproducible environments** across platforms
- **Isolated package management** without polluting the system Python

## Essential Commands

\`\`\`bash
# Create a new environment
conda create -n myproject python=3.12

# Activate
conda activate myproject

# Install packages
conda install numpy pandas scikit-learn

# Export environment
conda env export > environment.yml

# Recreate from file
conda env create -f environment.yml
\`\`\`

## Pro Tips

### 1. Use Mamba for Speed

\`\`\`bash
conda install -n base conda-libmamba-solver
conda config --set solver libmamba
\`\`\`

### 2. Pin Python Version

Always specify the Python version to avoid surprises:

\`\`\`bash
conda create -n myproject python=3.12
\`\`\`

### 3. Use conda-lock for CI

\`\`\`bash
pip install conda-lock
conda-lock -f environment.yml
\`\`\`

### 4. Clean Up Regularly

\`\`\`bash
conda clean --all
\`\`\`

## My Workflow

1. Create environment per project
2. Export \`environment.yml\` to version control
3. Use \`mamba\` for faster solves
4. Pin Python version and major dependencies
5. Clean unused packages monthly
`,
  },
  {
    id: 6,
    title: 'CLI Tools I Can\'t Live Without',
    date: '2025-06-22',
    tags: ['CLI Tools', 'Productivity'],
    summary: 'A curated list of command-line tools that boost my daily productivity.',
    content: `# CLI Tools I Can't Live Without

## File Navigation

### eza (modern ls replacement)
\`\`\`bash
eza -la --icons --git
\`\`\`

### zoxide (smart cd)
\`\`\`bash
z projects/blog  # jumps to most frecent match
\`\`\`

### fzf (fuzzy finder)
\`\`\`bash
# Find files
fzf --preview 'cat {}'

# Search history
Ctrl+R
\`\`\`

## Development

### delta (better git diff)
\`\`\`bash
git config --global core.pager delta
\`\`\`

### lazygit (TUI for git)
Simple, beautiful, and powerful git interface.

### hyperfine (benchmarking)
\`\`\`bash
hyperfine 'command1' 'command2'
\`\`\`

## System Tools

### btop (system monitor)
Beautiful and informative system resource monitor.

### dust (disk usage)
\`\`\`bash
dust -n 20  # top 20 largest directories
\`\`\`

### procs (modern ps)
\`\`\`bash
procs --tree  # process tree view
\`\`\`

## Why These?

Each tool replaces a traditional Unix tool with a **modern**, **colorful**, and **more functional** alternative. They all follow the Unix philosophy of doing one thing well.
`,
  },
  {
    id: 7,
    title: 'Setting Up Neovim from Scratch',
    date: '2025-03-14',
    tags: ['Neovim', 'Editor'],
    summary: 'A beginner-friendly guide to configuring Neovim with Lua and lazy.nvim.',
    content: `# Setting Up Neovim from Scratch

## Why Neovim?

Neovim is the modern fork of Vim, with:
- **Lua** configuration (faster than Vimscript)
- Built-in **LSP** support
- Better **plugin ecosystem**
- Active development community

## Initial Setup

### Install Neovim

\`\`\`bash
# Arch Linux
sudo pacman -S neovim

# macOS
brew install neovim
\`\`\`

### Create Config Directory

\`\`\`bash
mkdir -p ~/.config/nvim
\`\`\`

## Plugin Manager: lazy.nvim

\`\`\`lua
-- ~/.config/nvim/lua/plugins/init.lua
return {
  { "folke/tokyonight.nvim" },
  { "nvim-treesitter/nvim-treesitter", build = ":TSUpdate" },
  { "neovim/nvim-lspconfig" },
  { "hrsh7th/nvim-cmp" },
}
\`\`\`

## Essential Plugins

1. **Treesitter** — syntax highlighting
2. **LSP** — code intelligence
3. **nvim-cmp** — autocompletion
4. **telescope.nvim** — fuzzy finder
5. **neo-tree.nvim** — file explorer

## My Keybindings

| Key | Action |
|-----|--------|
| \`<Space>ff\` | Find files |
| \`<Space>fg\` | Live grep |
| \`<Space>e\` | Toggle file tree |
| \`gd\` | Go to definition |
| \`K\` | Hover documentation |

## Tips

- Start minimal, add plugins as needed
- Read \`:help\` — it's excellent
- Use \`checkhealth\` to diagnose issues
`,
  },
  {
    id: 8,
    title: 'Exploring VS Code Extensions for Web Dev',
    date: '2024-11-08',
    tags: ['Extension', 'VS Code'],
    summary: 'My essential VS Code extensions for web development productivity.',
    content: `# VS Code Extensions for Web Dev

## Must-Have Extensions

### Editor Enhancements
- **Vim** — modal editing
- **Error Lens** — inline error display
- **TODO Tree** — track TODOs across codebase

### Language Support
- **TypeScript** (built-in)
- **ESLint** — linting
- **Prettier** — formatting
- **Tailwind CSS IntelliSense** — class autocomplete

### Git
- **GitLens** — inline blame and history
- **Git Graph** — visual git log

### Productivity
- **Path Intellisense** — autocomplete file paths
- **Auto Rename Tag** — rename paired HTML tags
- **Color Highlight** — visualize color values

## My Settings

\`\`\`json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.minimap.enabled": false,
  "editor.fontSize": 14,
  "editor.fontFamily": "JetBrains Mono"
}
\`\`\`

## Conclusion

The right extensions can dramatically improve your workflow. But remember: **less is more**. Too many extensions can slow down VS Code.
`,
  },
  {
    id: 9,
    title: 'Getting Started with TypeScript 5',
    date: '2024-07-20',
    tags: ['TypeScript', 'JavaScript'],
    summary: 'An introduction to TypeScript 5 features and why you should make the switch.',
    content: `# Getting Started with TypeScript 5

## Why TypeScript?

JavaScript is great, but TypeScript adds:

- **Static type checking** — catch errors before runtime
- **Better IDE support** — autocomplete, refactoring
- **Self-documenting code** — types serve as documentation
- **Safer refactoring** — the compiler catches breaking changes

## Key Features in TypeScript 5

### Decorators

\`\`\`typescript
function log(target: any, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = function(...args: any[]) {
    console.log(\`Calling \${key}\`);  return original.apply(this, args);
  };
}

class Calculator {
  @log
  add(a: number, b: number) {
    return a + b;
  }
}
\`\`\`

### const Type Parameters

\`\`\`typescript
function createRoutes<const T extends readonly Route[]>(routes: T) {
  return routes;
}
\`\`\`

## Getting Started

\`\`\`bash
npm install typescript --save-dev
npx tsc --init
\`\`\`

## Tips for Beginners

1. Start with \`strict: true\`
2. Use \`type\` for unions/intersections, \`interface\` for objects
3. Learn utility types: \`Partial\`, \`Pick\`, \`Omit\`
4. Don't use \`any\` — use \`unknown\` instead
`,
  },
  {
    id: 10,
    title: 'My Journey into Open Source',
    date: '2024-02-15',
    tags: ['Open Source', 'Git'],
    summary: 'How I started contributing to open source and what I learned along the way.',
    content: `# My Journey into Open Source

## The Beginning

I started contributing to open source about a year ago. My first contribution was a **typo fix** in a README file. It sounds trivial, but it was the first step.

## Finding Projects

### Good First Issues
- Look for labels like \`good first issue\`, \`help wanted\`
- GitHub's topic pages are useful

### Projects I Contributed To

1. **Documentation fixes** — easiest way to start
2. **Bug reports** — detailed reports are valuable
3. **Small features** — after understanding the codebase
4. **Code reviews** — learning by reading others' code

## What I Learned

### Technical Skills
- **Git workflows** — branching, rebasing, PR etiquette
- **Code review** — giving and receiving feedback
- **Testing** — writing tests for your contributions
- **CI/CD** — understanding automated pipelines

### Soft Skills
- **Communication** — clear PR descriptions matter
- **Patience** — reviews take time
- **Humility** — your code isn't always right

## Tips for New Contributors

1. **Read CONTRIBUTING.md** first
2. **Start small** — documentation, tests, typos
3. **Be respectful** — maintainers are volunteers
4. **Ask questions** — most communities are welcoming
5. **Be persistent** — don't give up after one rejection

## My Contribution Stats

- 15+ repositories
- 50+ pull requests
- Countless issues reported

It's not about the numbers — it's about the **learning** and **community**.
`,
  },
];

export function getPostById(id: number): Post | undefined {
  return posts.find(post => post.id === id);
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  posts.forEach(post => post.tags.forEach(tag => tagSet.add(tag)));
  return Array.from(tagSet).sort();
}
