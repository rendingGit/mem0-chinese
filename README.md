# Mem0 中文本地化 / Mem0 Chinese Localization 🇨🇳

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.1.1-blue)](https://github.com/rendingGit/mem0-chinese)

为 [Mem0](https://app.mem0.ai/) AI 记忆平台提供简体中文本地化汉化。全站覆盖 ~1000 条翻译。

仿照 [maboloshi/github-chinese](https://github.com/maboloshi/github-chinese) 的设计架构，通过 Tampermonkey 脚本在客户端进行文本替换翻译。

## ✨ 特性

- 🚀 **客户端实时翻译** — 无需后端，纯前端 DOM 文本替换
- 🌐 **全站覆盖** — 登录/仪表盘/项目/设置/计费/Webhook/导出等所有页面
- 🔄 **SPA 路由支持** — 适配 Next.js 动态页面切换
- 📄 **分页翻译** — 按页面类型组织翻译词典，未知页面自动回退到公共词库
- 🎯 **智能跳过** — 不翻译代码、输入框、API 密钥等敏感内容
- 💾 **持久化设置** — 正则翻译/词汇记录等选项可持久保存
- 📊 **自动更新** — 内置 `@updateURL`，Tampermonkey 自动检测新版本

## 📦 安装

### 方式一：一键安装（推荐）

1. 安装 [Tampermonkey](https://www.tampermonkey.net/) 浏览器扩展
2. 打开这个链接，Tampermonkey 会自动弹出安装：
   
   👉 **[mem0-chinese.user.js](https://raw.githubusercontent.com/rendingGit/mem0-chinese/master/mem0-chinese.user.js)**
3. 访问 https://app.mem0.ai/ — 所有页面自动汉化 ✅

> **重要**：必须从链接安装（不要粘贴代码），否则无法自动更新。

### 方式二：Chrome 扩展版

1. `git clone` 本项目
2. Chrome → `chrome://extensions` → 加载已解压的扩展程序 → 选择项目目录
3. 需要 `locals.js` 和 `content.js` 在同一目录

## 🛠️ 菜单功能

Tampermonkey 图标右键 → mem0-chinese：

| 菜单项 | 功能 |
|--------|------|
| 启用正则翻译（开关） | 切换日期/时间等正则翻译，F12 控制台查看状态 |
| 记录未匹配词汇（开关） | 记录词典缺失的英文词，F12 控制台查看状态 |
| 清空未匹配词汇 | 重置未匹配词汇缓存 |
| 导出未匹配词汇 | 将缓存输出到 F12 控制台 |
| 手动刷新翻译 | 强制重新翻译当前页面 |

> **注意**：开关的菜单标签不会变化（Tampermonkey 限制）。开关后按 F12 查看控制台输出确认状态。

## 🌐 覆盖范围

| 页面 | 状态 |
|------|------|
| 登录/注册（含 GitHub/Google/Microsoft/Okta/邮箱） | ✅ |
| 仪表盘 / 活动 / 统计面板 | ✅ |
| 新手引导 / SDK 集成 / 插件安装 | ✅ |
| 项目 / 组织 / 成员管理 | ✅ |
| 记忆内容 / 分类 / 详情 / 历史 | ✅ |
| API 密钥管理 | ✅ |
| Webhook 配置 | ✅ |
| 记忆导出（Pydantic Schema） | ✅ |
| 账户设置 / 个人资料 | ✅ |
| 计费 / 用量 / 方案对比（全部 5 档） | ✅ |
| 演练场 / 探索 | ✅ |
| 日期/时间格式（5 种正则） | ✅ |

## 📁 文件结构

```
mem0-chinese/
├── mem0-chinese.user.js   # Tampermonkey 用户脚本（主入口）
├── content.js             # Chrome 扩展版（无 GM_* API 依赖）
├── locals.js              # 简体中文翻译数据（~1000 条）
├── manifest.json          # Chrome 扩展配置
├── LICENSE                # MIT
└── README.md              # 本文件
```

## 🏗️ 技术架构

在 [github-chinese](https://github.com/maboloshi/github-chinese) 基础上针对 Mem0（Next.js SPA）做了适配：

| 组件 | 说明 |
|------|------|
| **翻译数据** (`locals.js`) | 按页面类型分组 + `public` 全局兜底。三模式：`static`（精确）、`regexp`（正则）、`selector`（CSS 选择器） |
| **TreeWalker** | `document.createTreeWalker` 遍历 DOM，跳过 code/pre/input/textarea |
| **MutationObserver** | 监听 DOM 变化，去重后增量翻译动态加载内容 |
| **SPA 路由** | 劫持 `history.pushState/replaceState` + `popstate`，实时检测页面切换 |
| **未知页面兜底** | URL 无法匹配时自动加载 `public` 公共词库，杜绝白屏 |

## 🤝 贡献翻译

1. Fork 本项目
2. 安装脚本 → 右键菜单 → 「记录未匹配词汇（开关）」→ 正常使用 Mem0
3. 导出：菜单 → 「导出未匹配词汇」→ F12 复制
4. 编辑 `locals.js` 补充翻译 → 提 PR

> **提示**：导出列表中的名称（如 `hermes-user`）、延迟数值（`446.44 ms`）、记忆内容（长段落）是**用户数据不是 UI 标签**，无需翻译。

## 📝 License

MIT — 详见 [LICENSE](LICENSE)
