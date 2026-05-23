// ==Mem0Chinese==
// Mem0 (app.mem0.ai) 简体中文汉化数据
// 仿照 github-chinese 结构设计
// ==/Mem0Chinese==

var I18N = {
  conf: {
    // 页面路径匹配 -> 页面类型
    rePagePath: /^\/(dashboard|projects|project|history|instructions|members|login|get-api-key|e|array|person|config|error|_not-found)(\/|$)/,
    // 需要监听 CharacterData 变化的页面（高频页面才开启）
    characterDataPage: ["dashboard", "projects", "project", "history"],
    // 全局忽略的选择器（不翻译这些元素内容）
    ignoreMutationSelectorPage: {
      "*": [
        ".cm-scroller",
        ".cm-content",
        "code",
        "pre",
        "[data-language]",
        ".json-view",
        ".api-key-display",
        "input[type='text']",
        "input[type='email']",
        "input[type='password']",
        "textarea",
        "[contenteditable]",
        ".SelectTrigger",
        ".toast",
      ],
    },
    ignoreSelectorPage: {
      "*": [
        "code", "pre", "script", "style", "noscript",
        "input", "textarea", "select",
        "[data-language]",
        ".cm-scroller",
        ".json-view",
        ".api-key-display",
        "[contenteditable]",
      ],
    },
  },

  "zh-CN": {
    // ==================== 全局公共 ====================
    "public": {
      "static": {
        // -- 导航 / 页头 --
        "Home": "首页",
        "Dashboard": "仪表盘",
        "Notifications": "通知",
        "Notifications alt+T": "通知 alt+T",
        "Collapse sidebar": "收起侧栏",
        "Docs": "文档",
        "Upgrade": "升级",
        "Playground": "演练场",
        "SETUP": "设置",
        "Install Mem0": "安装 Mem0",
        "API Keys": "API 密钥",
        "ACTIVITY": "活动",
        "Request": "请求",
        "Requests": "请求",
        "Webhooks": "Webhooks",
        "Memory Exports": "记忆导出",
        "ACCOUNT": "账户",
        "Usage & Billing": "用量与计费",
        "Entities": "实体",
        "View Breakdown": "查看分类",
        "Select Organization": "选择组织",
        "Select Project": "选择项目",
        "Settings": "设置",
        "Security": "安全",
        "Profile": "个人资料",
        "Help": "帮助",
        "Documentation": "文档",
        "API Reference": "API 参考",
        "Support": "支持",
        "Feedback": "反馈",
        "Log out": "退出登录",
        "Sign out": "退出",
        "Logged in as": "当前登录：",
        "Toggle theme": "切换主题",
        "Current theme:": "当前主题：",

        // -- 通用按钮 --
        "Back": "返回",
        "Cancel": "取消",
        "Clear": "清除",
        "Close": "关闭",
        "Continue": "继续",
        "Delete": "删除",
        "Edit": "编辑",
        "Save": "保存",
        "Save changes": "保存更改",
        "Submit": "提交",
        "Confirm": "确认",
        "Refresh": "刷新",
        "Retry": "重试",
        "Search": "搜索",
        "Search...": "搜索...",
        "SEARCH": "搜索",
        "ADD": "添加",
        "DELETE": "删除",
        "GET ALL": "获取全部",
        "All": "全部",
        "All time": "全部时间",
        "Send": "发送",
        "Update": "更新",
        "Copy": "复制",
        "Copied": "已复制",
        "Paste": "粘贴",
        "Download": "下载",
        "Upload": "上传",
        "Export": "导出",
        "Import": "导入",
        "Add": "添加",
        "Remove": "移除",
        "Create": "创建",
        "View": "查看",
        "Show": "显示",
        "Hide": "隐藏",
        "More": "更多",
        "Less": "收起",
        "Load More": "加载更多",
        "Next": "下一步",
        "Previous": "上一步",
        "Finish": "完成",
        "Skip": "跳过",
        "Start": "开始",
        "Pause": "暂停",
        "Resume": "恢复",
        "Stop": "停止",
        "Done": "完成",
        "Go to Dashboard": "前往仪表盘",
        "Continue to dashboard": "前往仪表盘",
        "Proceed": "继续",
        "Proceed Button": "继续",

        // -- 状态 --
        "Loading...": "加载中...",
        "Loading data...": "加载数据中...",
        "Processing": "处理中",
        "Processing...": "处理中...",
        "Sending...": "发送中...",
        "Success": "成功",
        "Error": "错误",
        "Warning": "警告",
        "Info": "信息",
        "None": "无",
        "N/A": "不适用",
        "Unknown": "未知",
        "Default": "默认",
        "Custom": "自定义",
        "Generic": "通用",
        "Basic": "基础",
        "Free": "免费",
        "Full": "完整",
        "Other": "其他",
        "Other...": "其他...",

        // -- 表单标签 --
        "Name": "名称",
        "Email": "邮箱",
        "Password": "密码",
        "Description": "描述",
        "Type": "类型",
        "Date": "日期",
        "Data": "数据",
        "Label": "标签",
        "Status": "状态",
        "Role": "角色",
        "Title": "标题",

        // -- 表格/列表 --
        "Filters": "筛选",
        "Filter": "筛选",
        "Time": "时间",
        "Event": "事件",
        "Latency": "延迟",
        "Overview": "概览",
        "Has Results": "有结果",
        "pagination": "分页",
        "Go to previous page": "上一页",
        "More pages": "更多页",
        "Go to next page": "下一页",
        "Content": "内容",
        "Message": "消息",
        "Notes": "备注",
        "Size": "大小",
        "Color": "颜色",
        "Icon": "图标",
        "URL": "网址",
        "Language": "语言",
        "Timezone": "时区",
        "Company name": "公司名称",

        // -- 错误提示 --
        "Something went wrong!": "出了点问题！",
        "Something Went Wrong!": "出了点问题！",
        "Request failed": "请求失败",
        "Request failed with status code": "请求失败，状态码：",
        "Request aborted": "请求已取消",
        "Unauthorized": "未授权",
        "Access denied": "访问被拒绝",
        "Not found": "未找到",
        "Page not found": "页面未找到",
        "Connection closed.": "连接已关闭。",
        "Network error": "网络错误",
        "Timeout": "超时",
        "Validation error": "验证错误",
        "Invalid input": "输入无效",
        "Rate limit exceeded": "超出速率限制",

        // -- 通知 --
        "Close toast": "关闭通知",
        "Notification": "通知",

        // -- 客服/聊天 --
        "Intercom": "客服",
        "Open Intercom Messenger": "打开客服消息",

        // -- 计划/付费 --
        "Get 3 months of Pro for free": "免费获取3个月专业版",
        "Hobby plan usage": "爱好版用量",
        "10K": "1万",

        // -- 对话框 --
        "Are you sure?": "确定吗？",
        "Apply": "应用",
        "Yes": "是",
        "No": "否",
        "OK": "确定",

        // -- 星期 --
        "Sunday": "星期日",
        "Monday": "星期一",
        "Tuesday": "星期二",
        "Wednesday": "星期三",
        "Thursday": "星期四",
        "Friday": "星期五",
        "Saturday": "星期六",

        // -- 日历 --
        "Go to previous month": "上个月",
        "Go to next month": "下个月",
      },

      "regexp": [
        // 日期格式化 "Month YYYY" (e.g. "May 2026")
        [/^(January|February|March|April|May|June|July|August|September|October|November|December) (\d{4})$/, function (all, month, year) {
          var months = { January: "1", February: "2", March: "3", April: "4", May: "5", June: "6", July: "7", August: "8", September: "9", October: "10", November: "11", December: "12" };
          return year + "年" + months[month] + "月";
        }],
        // 日期格式化 "DD Month" (e.g. "23 May")
        [/^(\\d{1,2}) (January|February|March|April|May|June|July|August|September|October|November|December)$/, function (all, day, month) {
          var months = { January: "1", February: "2", March: "3", April: "4", May: "5", June: "6", July: "7", August: "8", September: "9", October: "10", November: "11", December: "12" };
          return months[month] + "月" + day + "日";
        }],
        // 日期格式化 "Month DD, YYYY"
        [/^(January|February|March|April|May|June|July|August|September|October|November|December) (\\d{1,2}), (\\d{4})$/, function (all, month, day, year) {
          var months = { January: "1", February: "2", March: "3", April: "4", May: "5", June: "6", July: "7", August: "8", September: "9", October: "10", November: "11", December: "12" };
          return year + "年" + months[month] + "月" + day + "日";
        }],
        // 时间格式
        [/^(\d{1,2}):(\d{2}) (AM|PM)$/, function (all, hour, min, ampm) {
          var h = parseInt(hour);
          if (ampm === "PM" && h < 12) h += 12;
          if (ampm === "AM" && h === 12) h = 0;
          return h + ":" + min;
        }],
        // 相对时间: Xh ago, Xm ago
        [/^(\d+)([hm]) ago$/, function (all, num, unit) {
          return num + (unit === "h" ? "小时前" : "分钟前");
        }],
        // 相对时间: X hours ago, X minutes ago, etc.
        [/^(\d+) (seconds?|minutes?|hours?|days?|weeks?|months?|years?) ago$/, function (all, num, unit) {
          var map = { second: "秒", seconds: "秒", minute: "分钟", minutes: "分钟", hour: "小时", hours: "小时", day: "天", days: "天", week: "周", weeks: "周", month: "个月", months: "个月", year: "年", years: "年" };
          return num + " " + (map[unit] || unit) + "前";
        }],
      ],

      "selector": [],
    },

    // ==================== 页面标题 ====================
    "title": {
      "static": {
        "Mem0 — Memory for AI Agents": "Mem0 — AI Agent 记忆平台",
        "Mem0 Dashboard": "Mem0 仪表盘",
        "Mem0 — Login": "Mem0 — 登录",
        "Mem0 — Projects": "Mem0 — 项目",
        "Mem0 — Settings": "Mem0 — 设置",
        "Mem0 — API Keys": "Mem0 — API 密钥",
      },
      "regexp": [
        [/^Mem0(.*)$/, "Mem0$1"],
      ],
    },

    // ==================== 登录页面 ====================
    "login": {
      "static": {
        "Login": "登录",
        "Sign in": "登录",
        "Sign In": "登录",
        "Welcome back": "欢迎回来",
        "Create your Mem0 Account": "创建你的 Mem0 账户",
        "Continue with Github": "通过 GitHub 继续",
        "Continue with Google": "通过 Google 继续",
        "Continue with Microsoft": "通过 Microsoft 继续",
        "Continue with Okta": "通过 Okta 继续",
        "Continue with email": "通过邮箱继续",
        "Continue with email button": "通过邮箱继续",
        "Sign in with": "登录方式：",
        "Check your email": "请查看你的邮箱",
        "Checking your account...": "正在检查你的账户...",
        "By creating an account, you agree to our": "创建账户即表示你同意我们的",
        "Privacy Policy": "隐私政策",
        "Terms of Service": "服务条款",
        "and": "和",
        "OR": "或",
        "Login page": "登录页",
        "Login Success": "登录成功",
        "Email sign in": "邮箱登录",
        "Magic link": "魔法链接",
        "Send magic link": "发送魔法链接",
        "Verification": "验证",
        "Please verify your email": "请验证你的邮箱",
        "Verification code": "验证码",
        "Enter verification code": "输入验证码",
      },
      "regexp": [],
      "selector": [],
      "title": {
        "static": {
          "Mem0 — Login": "Mem0 — 登录",
        },
        "regexp": [],
      },
    },

    // ==================== 仪表盘/首页 ====================
    "dashboard": {
      "static": {
        "Dashboard": "仪表盘",
        "Overview": "概览",
        "Quick Snapshot Memories": "快照记忆",
        "Recent activity": "最近活动",
        "Activity": "活动",
        "Last Week": "上周",
        "This Week": "本周",
        "Today": "今天",
        "Yesterday": "昨天",
        "Last 7 days": "最近7天",
        "Last 30 days": "最近30天",
        "Pick a date range": "选择日期范围",
        "All Time": "全部时间",
        "30d": "30天",
        "Total Memories": "总记忆数",
        "User user count": "用户数",
        "SEARCH retrieved count": "搜索检索数",
        "remaining add count": "剩余添加次数",
        "add add count": "添加次数",
        "Retrieval Events": "检索事件",
        "Retrieval": "检索",
        "Add Events": "添加事件",
        "View Requests": "查看请求",
        "No request activity for this range.": "此范围内无请求活动。",
        "TOTAL REQUESTS": "总请求数",
        "View Entities": "查看实体",
        "No entity activity for this range.": "此范围内无实体活动。",
        "TOTAL ENTITIES": "总实体数",

        // 记忆相关
        "Memory": "记忆",
        "Memories": "记忆",
        "Add Memory": "添加记忆",
        "Edit Memory": "编辑记忆",
        "Update Memory": "更新记忆",
        "Delete Memory": "删除记忆",
        "Categorize Memory": "分类记忆",
        "Search memories": "搜索记忆",
        "No memories found.": "未找到记忆。",
        "All memories have been successfully refreshed.": "所有记忆已成功刷新。",
        "Memories refreshed": "记忆已刷新",
        "Memory updated": "记忆已更新",
        "Memory not found": "记忆未找到",
        "Memory deleted": "记忆已删除",
        "The memory has been successfully updated.": "记忆已成功更新。",
        "Failed to create memory:": "创建记忆失败：",
        "Failed to fetch memories:": "获取记忆失败：",
        "Failed to update memory": "更新记忆失败",
        "Failed to update memory:": "更新记忆失败：",
        "Failed to fetch agent memories:": "获取 Agent 记忆失败：",
        "Failed to fetch agent memories. Please try again.": "获取 Agent 记忆失败，请重试。",
        "Failed to fetch memory history:": "获取记忆历史失败：",
        "Failed to fetch memory history. Please try again.": "获取记忆历史失败，请重试。",
        "What do you know about me?": "你了解我什么？",

        // Make changes to your memory here
        "Make changes to your memory here. Click save when you're done.": "在此处修改你的记忆，完成后点击保存。",

        // 记忆详情
        "Memory details": "记忆详情",
        "Memory history": "记忆历史",
        "Version history": "版本历史",

        // 批量操作
        "Batch deletion completed": "批量删除完成",
        "Batch removal completed": "批量移除完成",
        "Select all": "全选",
        "Deselect all": "取消全选",

        // 探索/入门卡片（仪表盘首页）
        "Explore the Platform": "探索平台",
        "Explore what mem0 can do": "探索 Mem0 的功能",
        "Customize Mem0": "自定义 Mem0",
        "Suggested": "推荐",
        "Set what Mem0 remembers, how it's organized, and when it's used.": "设置 Mem0 记住什么、如何组织、何时使用。",
        "Integration Examples": "集成示例",
        "See real integration examples and patterns to add memory to your product.": "查看为产品添加记忆的真实集成示例与模式。",
        "Try the Playground": "尝试演练场",
        "Test memory addition and retrieval live before wiring it into your app.": "在接入应用前，实时测试记忆的添加与检索。",
        "Step-by-step guides and references to integrate Mem0 into your stack.": "将 Mem0 集成到技术栈的分步指南与参考。",
      },
      "regexp": [],
      "selector": [],
      "title": {
        "static": {
          "Mem0 Dashboard": "Mem0 仪表盘",
        },
        "regexp": [],
      },
    },

    // ==================== 新手引导 ====================
    "dashboard/get-started": {
      "static": {
        "Get Started": "开始使用",
        "Onboarding": "新手引导",
        "Onboarding Screen 1": "引导页 1",
        "Onboarding Screen 2": "引导页 2",
        "Onboarding Screen 3": "引导页 3",
        "Onboarding page": "引导页",
        "Onboarding page - Invite": "引导页 - 邀请",
        "Setup Memory Behavior 1": "设置记忆行为 1",
        "Setup Memory Behavior 2": "设置记忆行为 2",
        "Help us set up the best memory experience for your usecase": "帮助我们为你的使用场景设置最佳记忆体验",
        "What would you like to do today ?": "今天想做什么？",
        "Please select what you want to do today": "请选择你今天想做的事情",
        "Where do you need memory?": "你需要在哪些场景使用记忆？",
        "Which memories matter most for your": "哪些记忆对你的",
        "What's your role in this project?": "你在这个项目中的角色是什么？",
        "Where did you hear about us?": "你是从哪里了解到我们的？",
        "Please tell us where you heard about us": "请告诉我们你是从哪里了解到我们的",
        "Tell us where": "告诉我们你在哪里",
        "Mind sharing the conversation that led you here? (optional)": "方便分享一下是什么让你来到这里的吗？（可选）",
        "Invite Onboarding": "邀请引导",
        "Invite team members": "邀请团队成员",
        "Invite role selected": "已选择邀请角色",
        "Invitation sent to": "邀请已发送至",
        "Jump straight to integration": "直接跳到集成",
      },
      "regexp": [],
      "selector": [],
    },

    // ==================== 项目页面 ====================
    "projects": {
      "static": {
        "Projects": "项目",
        "Project": "项目",
        "Create project": "创建项目",
        "New project": "新建项目",
        "Project name": "项目名称",
        "Project created successfully": "项目创建成功",
        "Project updated": "项目已更新",
        "Project deleted successfully": "项目删除成功",
        "Failed to add project": "添加项目失败",
        "Failed to update project": "更新项目失败",
        "Failed to fetch projects": "获取项目失败",
        "All projects deleted successfully": "所有项目删除成功",
        "No project selected": "未选择项目",
        "No project or organization selected": "未选择项目或组织",
        "Default project": "默认项目",
      },
      "regexp": [],
      "selector": [],
    },

    "project": {
      "static": {
        "Project": "项目",
        "Project settings": "项目设置",
        "Project overview": "项目概览",
      },
      "regexp": [],
      "selector": [],
    },

    // ==================== 组织页面 ====================
    "organization": {
      "static": {
        "Organization": "组织",
        "Organizations": "组织",
        "Create organization": "创建组织",
        "Organization name": "组织名称",
        "Organization deleted successfully": "组织删除成功",
        "Organization updated": "组织已更新",
        "Failed to add organization": "添加组织失败",
        "Failed to update organization": "更新组织失败",
        "All organizations deleted successfully": "所有组织删除成功",
        "No organization selected": "未选择组织",
      },
      "regexp": [],
      "selector": [],
    },

    // ==================== 成员页面 ====================
    "members": {
      "static": {
        "Members": "成员",
        "Team members": "团队成员",
        "Add member": "添加成员",
        "Remove member": "移除成员",
        "Invite member": "邀请成员",
        "Member role": "成员角色",
        "Failed to add member": "添加成员失败",
        "Failed to update member": "更新成员失败",
        "Failed to remove:": "移除失败：",
        "All users removed successfully": "所有用户移除成功",
        "Owner": "所有者",
        "Admin": "管理员",
        "Member": "成员",
        "Viewer": "查看者",
      },
      "regexp": [],
      "selector": [],
    },

    // ==================== 记忆历史 ====================
    "history": {
      "static": {
        "History": "历史记录",
        "Memory History": "记忆历史",
        "Version History": "版本历史",
      },
      "regexp": [],
      "selector": [],
    },

    // ==================== 指令/配置 ====================
    "instructions": {
      "static": {
        "Instructions": "指令",
        "Instructions set successfully": "指令设置成功",
        "Setup instructions": "设置指令",
        "System instructions": "系统指令",
        "Custom instructions": "自定义指令",
      },
      "regexp": [],
      "selector": [],
    },

    // ==================== 使用场景 ====================
    "usecase": {
      "static": {
        "Use Case": "使用场景",
        "Use case": "使用场景",
        "Use cases": "使用场景",
        "Select use case": "选择使用场景",
        "Custom use case": "自定义使用场景",
        "Failed to fetch use case": "获取使用场景失败",
        "Failed to fetch use cases": "获取使用场景列表失败",

        // 预设场景
        "Customer Support": "客户支持",
        "Coding agents": "编程 Agent",
        "Voice agents": "语音 Agent",
        "ECommerce": "电商",
        "ECOMMERCE": "电商",
        "Education": "教育",
        "EDUCATION": "教育",
        "Engineering": "工程",
        "Finance": "金融",
        "Healthcare": "医疗",
        "HEALTHCARE": "医疗",
        "Generic": "通用",
      },
      "regexp": [],
      "selector": [],
    },

    // ==================== API 密钥 ====================
    "get-api-key": {
      "static": {
        "API Key": "API 密钥",
        "API Keys": "API 密钥",
        "Create API Key": "创建 API 密钥",
        "API key name": "API 密钥名称",
        "Your API Key": "你的 API 密钥",
        "Copy API Key": "复制 API 密钥",
        "Failed to fetch API keys": "获取 API 密钥失败",
        "Manage API Keys": "管理 API 密钥",
        "Secret key": "密钥",
        "Public key": "公钥",
      },
      "regexp": [],
      "selector": [],
    },

    // ==================== API 请求 ====================
    "dashboard/requests": {
      "static": {
        "Requests": "请求",
        "API Requests": "API 请求",
        "Recent requests": "最近请求",
        "Request logs": "请求日志",
        "Request details": "请求详情",
      },
      "regexp": [],
      "selector": [],
    },

    // ==================== 集成 ====================
    "integration": {
      "static": {
        "Integration": "集成",
        "Integrations": "集成",
        "Add integration": "添加集成",
        "Setup integration": "设置集成",
      },
      "regexp": [],
      "selector": [],
    },

    // ==================== 配置 ====================
    "config": {
      "static": {
        "Configuration": "配置",
        "Settings": "设置",
        "Account settings": "账户设置",
        "General settings": "常规设置",
        "Appearance": "外观",
        "Theme": "主题",
        "Light": "浅色",
        "Dark": "深色",
        "System": "系统",
        "Language": "语言",
        "Notifications": "通知",
        "Email notifications": "邮件通知",
        "Push notifications": "推送通知",
      },
      "regexp": [],
      "selector": [],
    },

    // ==================== AI 模型/提供商 ====================
    "provider": {
      "static": {
        "Provider": "提供商",
        "Model": "模型",
        "AI Model": "AI 模型",
        "Select model": "选择模型",
        "LLM Provider": "LLM 提供商",
        "Embedding Provider": "嵌入模型提供商",

        // 提供商
        "OpenAI": "OpenAI",
        "Anthropic": "Anthropic",
        "DeepSeek": "DeepSeek",
        "Groq": "Groq",
        "Together": "Together AI",
        "Gemini": "Gemini",
        "Meta": "Meta",
        "NVIDIA": "NVIDIA",
        "Vercel": "Vercel",

        // 模型
        "ChatGPT": "ChatGPT",
        "Claude": "Claude",
        "Claude Code": "Claude Code",
        "Codex": "Codex",
        "Cursor": "Cursor",
        "OpenClaw": "OpenClaw",
        "Mini": "Mini",

        // 具体模型名
        "Anthropic: Opus 4": "Anthropic: Opus 4",
        "Anthropic: Sonnet 4": "Anthropic: Sonnet 4",
        "DeepSeek: deepseek-chat": "DeepSeek: deepseek-chat",
        "NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO": "NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO",
        "Qwen/Qwen2-72B-Instruct": "Qwen/Qwen2-72B-Instruct",
        "Qwen/Qwen2.5-72B-Instruct-Turbo": "Qwen/Qwen2.5-72B-Instruct-Turbo",
        "Qwen/Qwen2.5-VL-72B-Instruct": "Qwen/Qwen2.5-VL-72B-Instruct",
      },
      "regexp": [],
      "selector": [],
    },

    // ==================== 对话 ====================
    "conversation": {
      "static": {
        "Conversation": "对话",
        "Conversations": "对话",
        "Start conversation": "开始对话",
        "New conversation": "新建对话",
        "Conversations loaded successfully": "对话加载成功",
      },
      "regexp": [],
      "selector": [],
    },

    // ==================== 个人/用户 ====================
    "person": {
      "static": {
        "Person": "个人",
        "User": "用户",
        "Users": "用户",
        "User profile": "用户资料",
        "User ID": "用户 ID",
        "Agent ID": "Agent ID",
      },
      "regexp": [],
      "selector": [],
    },

    // ==================== 事件 ====================
    "e": {
      "static": {
        "Events": "事件",
        "Event": "事件",
        "Event details": "事件详情",
      },
      "regexp": [],
      "selector": [],
    },

    // ==================== 错误页 ====================
    "error": {
      "static": {
        "Page not found": "页面未找到",
        "Not found": "未找到",
        "Go back home": "返回首页",
        "Something went wrong": "出了点问题",
      },
      "regexp": [],
      "selector": [],
    },

    // ==================== 探索页 ====================
    "explore": {
      "static": {
        "Explore": "探索",
        "Explore what mem0 can do": "探索 Mem0 的功能",
      },
      "regexp": [],
      "selector": [],
    },

    // ==================== 企业入口 ====================
    "enterprise-intake": {
      "static": {
        "Enterprise": "企业版",
        "Enterprise Intake": "企业入驻",
      },
      "regexp": [],
      "selector": [],
    },
  },
};

// 兼容 Tampermonkey/Greasemonkey 全局导出
if (typeof module !== "undefined" && module.exports) {
  module.exports = I18N;
}
