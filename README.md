# Mem0 中文本地化 / Mem0 Chinese Localization 🇨🇳

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GreasyFork](https://img.shields.io/badge/GreasyFork-install-brightgreen)](https://greasyfork.org/scripts/xxxxx)

为 [Mem0](https://app.mem0.ai/) AI 记忆平台提供简体中文本地化汉化。

仿照 [maboloshi/github-chinese](https://github.com/maboloshi/github-chinese) 的设计架构，通过 Tampermonkey 脚本在客户端进行文本替换翻译。

## ✨ 特性

- 🚀 **客户端实时翻译** — 无需后端，纯前端 DOM 文本替换
- 🔄 **SPA 路由支持** — 适配 Next.js 动态页面切换
- 📄 **分页翻译** — 按页面类型组织翻译词典，精准匹配
- 🎯 **智能跳过** — 不翻译代码、输入框、API 密钥等敏感内容
- 💾 **持久化设置** — 正则翻译/词汇记录等选项可持久保存
- 📊 **调试友好** — 支持记录未匹配词汇，方便贡献翻译

## 📦 安装

### 方式一：Tampermonkey / Greasemonkey（推荐）

1. 安装 [Tampermonkey](https://www.tampermonkey.net/) 浏览器扩展
2. 点击安装：[mem0-chinese.user.js](https://raw.githubusercontent.com/rendingGit/mem0-chinese/master/mem0-chinese.user.js)
3. 访问 https://app.mem0.ai/ 即可看到汉化效果 ✅

### 方式二：手动复制

1. 打开 Tampermonkey 管理面板
2. 点击「新建脚本」
3. 复制 `mem0-chinese.user.js` 全部内容并粘贴
4. 保存并启用

## 🛠️ 菜单功能

在 Tampermonkey 图标上右键可访问菜单：

| 菜单项 | 功能 |
|--------|------|
| 启用正则翻译 | 开启/关闭正则表达式翻译（日期格式等） |
| 记录未匹配词汇 | 记录词典中缺失的英文词汇 |
| 导出未匹配词汇 | 将记录输出到浏览器控制台 |
| 手动刷新翻译 | 强制重新翻译当前页面 |

## 📁 文件结构

```
mem0-chinese/
├── mem0-chinese.user.js   # 核心用户脚本（入口）
├── locals.js              # 简体中文翻译数据
├── manifest.json           # Chrome 扩展配置（可选）
└── README.md              # 本文件
```

## 🏗️ 技术架构

在 [github-chinese](https://github.com/maboloshi/github-chinese) 基础上针对 Mem0（Next.js SPA）做了适配：

| 组件 | 说明 |
|------|------|
| **翻译数据** (`locals.js`) | 按页面类型分组：`public`（全局）、`dashboard`、`login`、`projects` 等。每页支持 `static`（精确匹配）、`regexp`（正则替换）、`selector`（CSS 选择器直接替换）三种模式 |
| **TreeWalker** | `document.createTreeWalker` 遍历 DOM，跳过代码块/输入框等 |
| **MutationObserver** | 监听 DOM 变化，增量翻译动态加载的内容 |
| **SPA 路由** | 劫持 `history.pushState/replaceState` + 监听 `popstate` + Next.js 路由事件 |
| **URL 检测** | MutationObserver 中实时比较 `window.location.href` 检测页面切换 |

## 🤝 贡献翻译

欢迎提交 PR 补充或修正翻译！

1. Fork 本项目
2. 编辑 `locals.js` 添加/修改翻译条目
3. 或者开启「记录未匹配词汇」→ 访问 Mem0 正常使用 → 「导出未匹配词汇」获取缺失条目
4. 提交 PR

## 📝 License

MIT — 详见 [LICENSE](LICENSE)
