---
name: View Transition Theme Animation
description: 使用 View Transitions API 实现深色/浅色模式切换时的圆形扩散动画效果
---

# View Transition Theme Animation

本技能文档描述如何使用 **View Transitions API** 实现深色/浅色模式切换时从点击位置向外扩散的圆形动画效果。

---

## 效果预览

点击主题切换按钮时，新主题会从**点击位置**以**圆形扩散**的方式过渡到整个页面，产生流畅且视觉冲击力强的动画效果。

---

## 技术原理

### View Transitions API

这是一个现代浏览器 API，用于在 DOM 变化时创建平滑的视觉过渡效果。

**工作流程**：
1. 调用 `document.startViewTransition()` 时，浏览器**截取当前页面快照**作为 `::view-transition-old(root)`
2. 执行回调函数中的 DOM 变化（主题切换）
3. DOM 更新完成后，浏览器截取**新页面快照**作为 `::view-transition-new(root)`
4. 通过 CSS 动画或 JS 动画在两个快照之间进行过渡

### 动画类型

| 切换方向 | 动画效果 | 动画目标 |
|---------|---------|---------|
| 浅色 → 深色 | 圆形收缩 | `::view-transition-old(root)` |
| 深色 → 浅色 | 圆形扩张 | `::view-transition-new(root)` |

---

## 实现步骤

### 步骤 1: 添加 CSS 配置

在全局 CSS 文件中添加以下样式：

```css
/* 禁用默认过渡动画 */
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

/* 浅色模式下的层级：新视图在上层 */
::view-transition-old(root) {
  z-index: 1;
}

::view-transition-new(root) {
  z-index: 9999;
}

/* 深色模式下的层级：旧视图在上层（反转） */
.dark::view-transition-old(root) {
  z-index: 9999;
}

.dark::view-transition-new(root) {
  z-index: 1;
}
```

### 步骤 2: 实现 JavaScript 逻辑

#### React/TypeScript 版本

```typescript
const toggleTheme = async (event: React.MouseEvent<HTMLButtonElement>) => {
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';

  // 检测 API 支持
  if (!('startViewTransition' in document)) {
    applyTheme(newTheme);
    return;
  }

  // ① 获取点击坐标作为动画原点
  const x = event.clientX;
  const y = event.clientY;
  
  // ② 计算最大扩散半径（从点击点到最远角落的距离）
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  // ③ 启动视图过渡
  const transition = (document as any).startViewTransition(() => {
    applyTheme(newTheme);
  });

  // ④ 在过渡准备好后执行圆形裁剪动画
  transition.ready.then(() => {
    const isDarkMode = newTheme === 'dark';
    
    // ⑤ 根据切换方向决定动画是扩张还是收缩
    const clipPath = isDarkMode
      ? [`circle(${endRadius}px at ${x}px ${y}px)`, `circle(0px at ${x}px ${y}px)`]
      : [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];

    // ⑥ 在伪元素上执行动画
    document.documentElement.animate(
      { clipPath },
      {
        duration: 500,
        easing: 'ease-in-out',
        fill: 'forwards',
        pseudoElement: isDarkMode 
          ? '::view-transition-old(root)'   // 深色模式：收缩旧视图
          : '::view-transition-new(root)'   // 浅色模式：扩张新视图
      }
    );
  });
};
```

#### 原生 JavaScript 版本

```javascript
function toggleTheme(event) {
  const html = document.documentElement;
  const isDark = html.classList.contains('dark');
  const newTheme = isDark ? 'light' : 'dark';

  if (!('startViewTransition' in document)) {
    applyTheme(newTheme);
    return;
  }

  const { clientX: x, clientY: y } = event;
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y)
  );

  const transition = document.startViewTransition(() => applyTheme(newTheme));

  transition.ready.then(() => {
    const isDarkMode = newTheme === 'dark';
    const clipPath = isDarkMode
      ? [`circle(${endRadius}px at ${x}px ${y}px)`, `circle(0px at ${x}px ${y}px)`]
      : [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];

    html.animate(
      { clipPath },
      {
        duration: 500,
        easing: 'ease-in-out',
        fill: 'forwards',
        pseudoElement: isDarkMode
          ? '::view-transition-old(root)'
          : '::view-transition-new(root)'
      }
    );
  });
}

function applyTheme(theme) {
  const html = document.documentElement;
  if (theme === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
  html.setAttribute('data-theme', theme);
}
```

### 步骤 3: 绑定事件

```html
<button id="theme-toggle" onclick="toggleTheme(event)">
  切换主题
</button>
```

---

## 关键技术点

| 技术点 | 说明 |
|--------|------|
| `event.clientX/Y` | 获取点击坐标作为动画圆心 |
| `Math.hypot()` | 勾股定理计算到最远角落的距离 |
| `clip-path: circle()` | CSS 圆形裁剪函数 |
| `transition.ready` | Promise，DOM 变化完成后触发 |
| `fill: 'forwards'` | 动画结束后保持最终状态 |
| `z-index` 层级翻转 | 根据当前模式决定哪层在上 |

---

## 动画原理图解

### 浅色 → 深色（收缩效果）

```
┌─────────────────────────────────┐
│         浅色模式 (old)          │  z-index: 9999 (在上)
│    ┌───────────────────────┐    │
│    │                       │    │
│    │    深色模式 (new)     │ ←─ circle() 从大到小，逐渐"擦除"旧视图
│    │                       │    │
│    └───────────────────────┘    │
└─────────────────────────────────┘
```

**动画：** 对 `::view-transition-old(root)` 应用 `circle()` 从 `endRadius` → `0px`

### 深色 → 浅色（扩张效果）

```
┌─────────────────────────────────┐
│         深色模式 (old)          │  z-index: 1 (在下)
│    ┌───────────────────────┐    │
│    │                       │    │
│    │    浅色模式 (new)     │ ←─ circle() 从小到大，逐渐"覆盖"旧视图
│    │                       │    │
│    └───────────────────────┘    │
└─────────────────────────────────┘
```

**动画：** 对 `::view-transition-new(root)` 应用 `circle()` 从 `0px` → `endRadius`

---

## 浏览器兼容性

| 浏览器 | 支持情况 |
|--------|----------|
| Chrome 111+ | ✅ 完全支持 |
| Edge 111+ | ✅ 完全支持 |
| Safari 18+ | ✅ 完全支持 |
| Firefox | ❌ 暂不支持 |

### 降级处理

```javascript
if (!('startViewTransition' in document)) {
  // 直接切换，无动画
  applyTheme(newTheme);
  return;
}
```

---

## 常见问题

### Q: 为什么 Linux 平台不建议使用？

某些 Linux + Tauri 环境下，透明窗口 + View Transitions 可能导致崩溃。建议添加平台检测：

```javascript
const isLinux = navigator.platform.toLowerCase().includes('linux');
if ('startViewTransition' in document && !isLinux) {
  // 使用动画
}
```

### Q: 如何调整动画速度？

修改 `duration` 参数（单位：毫秒）：

```javascript
{
  duration: 300,  // 快速
  duration: 500,  // 中等（推荐）
  duration: 800,  // 慢速
}
```

### Q: 如何修改动画缓动曲线？

修改 `easing` 参数：

```javascript
{
  easing: 'ease-in-out',    // 默认
  easing: 'ease-in',        // 加速开始
  easing: 'ease-out',       // 减速结束
  easing: 'linear',         // 匀速
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)', // 自定义
}
```

---

## 完整代码模板

### 可复制的最小实现

```html
<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Theme Toggle Demo</title>
  <style>
    :root {
      --bg-color: #ffffff;
      --text-color: #333333;
    }
    
    .dark {
      --bg-color: #1a1a2e;
      --text-color: #eaeaea;
    }
    
    body {
      background-color: var(--bg-color);
      color: var(--text-color);
      transition: background-color 0s, color 0s;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    /* View Transitions 配置 */
    ::view-transition-old(root),
    ::view-transition-new(root) {
      animation: none;
      mix-blend-mode: normal;
    }
    
    ::view-transition-old(root) { z-index: 1; }
    ::view-transition-new(root) { z-index: 9999; }
    
    .dark::view-transition-old(root) { z-index: 9999; }
    .dark::view-transition-new(root) { z-index: 1; }
    
    button {
      padding: 12px 24px;
      font-size: 16px;
      cursor: pointer;
      border: none;
      border-radius: 8px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
  </style>
</head>
<body>
  <button onclick="toggleTheme(event)">🌓 切换主题</button>

  <script>
    function toggleTheme(event) {
      const html = document.documentElement;
      const isDark = html.classList.contains('dark');
      const newTheme = isDark ? 'light' : 'dark';

      if (!('startViewTransition' in document)) {
        applyTheme(newTheme);
        return;
      }

      const { clientX: x, clientY: y } = event;
      const endRadius = Math.hypot(
        Math.max(x, innerWidth - x),
        Math.max(y, innerHeight - y)
      );

      const transition = document.startViewTransition(() => applyTheme(newTheme));

      transition.ready.then(() => {
        const isDarkMode = newTheme === 'dark';
        html.animate(
          {
            clipPath: isDarkMode
              ? [`circle(${endRadius}px at ${x}px ${y}px)`, `circle(0px at ${x}px ${y}px)`]
              : [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
          },
          {
            duration: 500,
            easing: 'ease-in-out',
            fill: 'forwards',
            pseudoElement: isDarkMode
              ? '::view-transition-old(root)'
              : '::view-transition-new(root)'
          }
        );
      });
    }

    function applyTheme(theme) {
      const html = document.documentElement;
      html.classList.toggle('dark', theme === 'dark');
    }
  </script>
</body>
</html>
```

---

## 参考资源

- [MDN: View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API)
- [Chrome Developers: Smooth transitions with the View Transitions API](https://developer.chrome.com/docs/web-platform/view-transitions)
