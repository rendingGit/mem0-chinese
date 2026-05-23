// ==UserScript==
// @name         mem0-chinese
// @name:zh-CN   Mem0 中文本地化
// @namespace    https://github.com/rendingGit/mem0-chinese
// @version      1.0.9
// @description  Chinese localization for Mem0 (app.mem0.ai) — 为 Mem0 平台提供简体中文本地化
// @description:zh-CN  为 Mem0 AI 记忆平台 (app.mem0.ai) 提供简体中文本地化汉化
// @author       hermes
// @match        https://app.mem0.ai/*
// @require      https://raw.githubusercontent.com/rendingGit/mem0-chinese/master/locals.js
// @downloadURL  https://raw.githubusercontent.com/rendingGit/mem0-chinese/master/mem0-chinese.user.js
// @updateURL    https://raw.githubusercontent.com/rendingGit/mem0-chinese/master/mem0-chinese.user.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// ==/UserScript==

(function () {
  "use strict";

  // ==================== 全局状态 ====================
  var State = {
    pageConfig: null,
    pageType: "",
    previousURL: "",
    observer: null,
    translatedNodes: new WeakSet(),
    pauseTranslate: false,
    enableRegex: true,
    enableMissedTerms: false,
    missedTerms: {},
  };

  // ==================== 配置管理 ====================
  var CONFIG_KEY = "mem0-chinese-config";
  var DEFAULT_CONFIG = {
    enableRegex: true,
    enableMissedTerms: false,
  };

  function loadConfig() {
    try {
      var saved = GM_getValue(CONFIG_KEY, null);
      if (saved) {
        var config = JSON.parse(saved);
        State.enableRegex = config.enableRegex !== false;
        State.enableMissedTerms = config.enableMissedTerms === true;
      }
    } catch (e) {}
  }

  function saveConfig() {
    GM_setValue(
      CONFIG_KEY,
      JSON.stringify({
        enableRegex: State.enableRegex,
        enableMissedTerms: State.enableMissedTerms,
      })
    );
  }

  // ==================== 页面类型检测 ====================
  function detectPageType() {
    var pathname = window.location.pathname;

    // 登录页
    if (/^\/(login|auth)/.test(pathname)) return "login";

    // 新手引导
    if (pathname === "/dashboard/get-started") return "dashboard/get-started";
    if (/\/onboarding/.test(pathname)) return "dashboard/get-started";

    // API 请求
    if (pathname === "/dashboard/requests") return "dashboard/requests";

    // 仪表盘
    if (pathname === "/dashboard" || pathname === "/") return "dashboard";

    // 项目
    if (/^\/project\//.test(pathname)) return "project";
    if (/^\/projects/.test(pathname)) return "projects";

    // 记忆历史
    if (/^\/history/.test(pathname)) return "history";

    // 指令
    if (/^\/instructions/.test(pathname)) return "instructions";

    // API 密钥
    if (/^\/get-api-key/.test(pathname)) return "get-api-key";

    // 成员
    if (/^\/members/.test(pathname)) return "members";

    // 探索
    if (/^\/explore/.test(pathname)) return "explore";

    // 事件
    if (/^\/e\//.test(pathname)) return "e";

    // 个人
    if (/^\/person/.test(pathname)) return "person";

    // 配置
    if (/^\/config/.test(pathname)) return "config";

    // 组织
    if (/^\/org/.test(pathname)) return "organization";

    // 错误页
    if (/^\/error/.test(pathname)) return "error";

    // 企业
    if (/enterprise/.test(pathname)) return "enterprise-intake";

    return "";  // 兜底：至少用 public 词库
  }

  // ==================== 初始化当前页面配置 ====================
  function buildPageConfig(pageType) {
    // 即使页面类型未知，也加载 public 词库保证翻译不白屏
    if (!I18N["zh-CN"]) return null;
    var effectiveType = pageType || "_fallback";

    var zh = I18N["zh-CN"];
    var conf = I18N.conf || {};

    // 合并公共规则 + 页面特定规则
    var staticDict = {};
    var regexpRules = [];
    var selectorRules = [];
    var titleStatic = {};
    var titleRegexp = [];

    // 公共
    if (zh["public"]) {
      Object.assign(staticDict, zh["public"].static || {});
      regexpRules = regexpRules.concat(zh["public"].regexp || []);
      selectorRules = selectorRules.concat(zh["public"].selector || []);
    }

    // 标题
    if (zh["title"] && zh["title"].static) {
      Object.assign(titleStatic, zh["title"].static);
    }
    if (zh["title"] && zh["title"].regexp) {
      titleRegexp = titleRegexp.concat(zh["title"].regexp);
    }

    // 页面特定规则
    var pageZh = zh[pageType];
    if (pageZh) {
      Object.assign(staticDict, pageZh.static || {});
      regexpRules = regexpRules.concat(pageZh.regexp || []);
      selectorRules = selectorRules.concat(pageZh.selector || []);

      if (pageZh.title && pageZh.title.static) {
        Object.assign(titleStatic, pageZh.title.static);
      }
      if (pageZh.title && pageZh.title.regexp) {
        titleRegexp = titleRegexp.concat(pageZh.title.regexp);
      }
    }

    // 忽略选择器
    var ignoreSelectors = [];
    if (conf.ignoreSelectorPage) {
      if (conf.ignoreSelectorPage["*"]) {
        ignoreSelectors = ignoreSelectors.concat(conf.ignoreSelectorPage["*"]);
      }
      if (conf.ignoreSelectorPage[pageType]) {
        ignoreSelectors = ignoreSelectors.concat(
          conf.ignoreSelectorPage[pageType]
        );
      }
    }

    var ignoreMutSelectors = [];
    if (conf.ignoreMutationSelectorPage) {
      if (conf.ignoreMutationSelectorPage["*"]) {
        ignoreMutSelectors = ignoreMutSelectors.concat(
          conf.ignoreMutationSelectorPage["*"]
        );
      }
      if (conf.ignoreMutationSelectorPage[pageType]) {
        ignoreMutSelectors = ignoreMutSelectors.concat(
          conf.ignoreMutationSelectorPage[pageType]
        );
      }
    }

    return {
      pageType: pageType,
      staticDict: staticDict,
      regexpRules: regexpRules,
      selectorRules: selectorRules,
      titleStatic: titleStatic,
      titleRegexp: titleRegexp,
      ignoreSelectors: ignoreSelectors,
      ignoreMutSelectors: ignoreMutSelectors,
      characterData:
        conf.characterDataPage && conf.characterDataPage.indexOf(pageType) >= 0,
    };
  }

  function updatePageConfig() {
    var pageType = detectPageType();
    if (pageType !== State.pageType) {
      State.pageType = pageType;
      State.pageConfig = buildPageConfig(pageType);
      State.translatedNodes = new WeakSet();
    }
  }

  // ==================== 翻译核心 ====================
  function fetchTransResult(text) {
    if (!text || State.pauseTranslate) return text;

    // 跳过有效中文文本（含中文字符的直接返回）
    if (/[\u4e00-\u9fff]/.test(text)) return text;

    // 跳过过短或纯数字/符号文本
    var trimmed = text.trim();
    if (!trimmed) return text;
    if (!/[a-zA-Z]/.test(trimmed)) return text;
    if (trimmed.length < 2) return text;

    var config = State.pageConfig;
    if (!config) return text;

    // 1) 静态词典查找（精确匹配）
    if (config.staticDict[trimmed]) {
      return config.staticDict[trimmed];
    }

    // 2) 正则规则匹配
    if (State.enableRegex && config.regexpRules) {
      for (var i = 0; i < config.regexpRules.length; i++) {
        var rule = config.regexpRules[i];
        var result = trimmed.replace(rule[0], rule[1]);
        if (result !== trimmed) return result;
      }
    }

    // 3) 记录未匹配的词汇（调试用）
    if (State.enableMissedTerms && trimmed.length >= 3) {
      State.missedTerms[trimmed] = (State.missedTerms[trimmed] || 0) + 1;
    }

    return text;
  }

  function shouldIgnoreNode(node, isMutation) {
    if (!node || !node.parentNode) return true;

    // 忽略脚本/样式/代码/输入框
    var tagName = (node.nodeName || "").toLowerCase();
    if (
      /^(script|style|noscript|code|pre|textarea|input|select|svg|path|circle|rect|g|polygon|line)$/.test(
        tagName
      )
    ) {
      return true;
    }

    var selectors = isMutation
      ? State.pageConfig && State.pageConfig.ignoreMutSelectors
      : State.pageConfig && State.pageConfig.ignoreSelectors;

    if (selectors) {
      for (var i = 0; i < selectors.length; i++) {
        try {
          if (node.matches && node.matches(selectors[i])) return true;
          if (node.closest && node.closest(selectors[i])) return true;
        } catch (e) {}
      }
    }

    return false;
  }

  function transTextNode(node) {
    if (!node || node.nodeType !== 3) return;
    if (shouldIgnoreNode(node.parentNode, false)) return;
    if (State.translatedNodes.has(node)) return;

    var text = node.data || "";
    var result = fetchTransResult(text);
    if (result !== text) {
      node.data = result;
      State.translatedNodes.add(node);
    }
  }

  function transElementAttrs(node) {
    if (!node || node.nodeType !== 1) return;
    if (shouldIgnoreNode(node, false)) return;

    var tagName = (node.nodeName || "").toLowerCase();

    // placeholder
    if (["input", "textarea"].indexOf(tagName) >= 0 && node.placeholder) {
      var ph = fetchTransResult(node.placeholder);
      if (ph !== node.placeholder) node.placeholder = ph;
    }

    // aria-label
    if (node.getAttribute && node.getAttribute("aria-label")) {
      var al = fetchTransResult(node.getAttribute("aria-label"));
      if (al !== node.getAttribute("aria-label"))
        node.setAttribute("aria-label", al);
    }

    // title
    if (node.title) {
      var t = fetchTransResult(node.title);
      if (t !== node.title) node.title = t;
    }

    // data-* attributes that might contain UI text
    if (node.dataset) {
      var dataAttrs = ["tooltip", "hint", "label", "confirm", "description"];
      for (var i = 0; i < dataAttrs.length; i++) {
        var attr = dataAttrs[i];
        if (node.dataset[attr]) {
          var val = fetchTransResult(node.dataset[attr]);
          if (val !== node.dataset[attr]) {
            node.dataset[attr] = val;
            if (node.getAttribute("data-" + attr)) {
              node.setAttribute("data-" + attr, val);
            }
          }
        }
      }
    }
  }

  function transTitle() {
    if (!document.title) return;
    var config = State.pageConfig;
    if (!config) return;

    // 静态标题
    if (config.titleStatic && config.titleStatic[document.title]) {
      document.title = config.titleStatic[document.title];
      return;
    }

    // 正则标题
    if (config.titleRegexp) {
      for (var i = 0; i < config.titleRegexp.length; i++) {
        var rule = config.titleRegexp[i];
        var result = document.title.replace(rule[0], rule[1]);
        if (result !== document.title) {
          document.title = result;
          return;
        }
      }
    }
  }

  function transBySelector() {
    var config = State.pageConfig;
    if (!config || !config.selectorRules) return;

    for (var i = 0; i < config.selectorRules.length; i++) {
      var pair = config.selectorRules[i];
      try {
        var el = document.querySelector(pair[0]);
        if (el && !shouldIgnoreNode(el, false)) {
          el.textContent = pair[1];
        }
      } catch (e) {}
    }
  }

  // ==================== DOM 遍历 ====================
  function traverseNode(rootNode) {
    if (!rootNode) return;

    try {
      var treeWalker = document.createTreeWalker(
        rootNode,
        NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
        {
          acceptNode: function (node) {
            if (shouldIgnoreNode(node, false)) {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          },
        }
      );

      var node;
      while ((node = treeWalker.nextNode())) {
        if (node.nodeType === 3) {
          transTextNode(node);
        } else if (node.nodeType === 1) {
          transElementAttrs(node);
        }
      }
    } catch (e) {}
  }

  // ==================== MutationObserver ====================
  function startObserving() {
    if (State.observer) {
      State.observer.disconnect();
    }

    var obsConfig = {
      childList: true,
      subtree: true,
      characterData: State.pageConfig && State.pageConfig.characterData,
      attributes: true,
      attributeFilter: ["placeholder", "aria-label", "title", "data-tooltip", "data-hint", "data-label"],
    };

    State.observer = new MutationObserver(function (mutations) {
      // URL 变化检测（SPA 导航）
      if (window.location.href !== State.previousURL) {
        State.previousURL = window.location.href;
        handleURLChange();
        return;
      }

      if (State.pauseTranslate) return;

      var nodesToProcess = new Set();

      for (var i = 0; i < mutations.length; i++) {
        var mutation = mutations[i];

        // 新增节点
        if (mutation.type === "childList") {
          for (var j = 0; j < mutation.addedNodes.length; j++) {
            var node = mutation.addedNodes[j];
            if (!shouldIgnoreNode(node, true)) {
              nodesToProcess.add(node);
            }
          }
        }

        // 属性变化
        if (mutation.type === "attributes" && mutation.target) {
          if (!shouldIgnoreNode(mutation.target, true)) {
            transElementAttrs(mutation.target);
          }
        }

        // 文本变化
        if (
          mutation.type === "characterData" &&
          mutation.target &&
          mutation.target.parentNode
        ) {
          if (!shouldIgnoreNode(mutation.target.parentNode, true)) {
            transTextNode(mutation.target);
          }
        }
      }

      // 去重：如果节点的祖先已在集合中，移除子节点
      var topNodes = [];
      nodesToProcess.forEach(function (n) {
        var hasAncestor = false;
        nodesToProcess.forEach(function (other) {
          if (other !== n && other.contains && other.contains(n)) {
            hasAncestor = true;
          }
        });
        if (!hasAncestor) topNodes.push(n);
      });

      // 处理
      for (var k = 0; k < topNodes.length; k++) {
        traverseNode(topNodes[k]);
      }
    });

    State.observer.observe(document.body, obsConfig);
  }

  function stopObserving() {
    if (State.observer) {
      State.observer.disconnect();
      State.observer = null;
    }
  }

  // ==================== URL 变化处理 ====================
  function handleURLChange() {
    stopObserving();
    updatePageConfig();
    if (State.pageConfig) {
      doTranslate();
      startObserving();
    }
  }

  // ==================== 初始翻译 ====================
  function doTranslate() {
    if (State.pauseTranslate) return;
    updatePageConfig();
    if (!State.pageConfig) return;

    transTitle();
    transBySelector();
    traverseNode(document.body);
  }

  function doInitTrans() {
    updatePageConfig();
    if (!State.pageConfig) return;

    transTitle();
    transBySelector();

    // 等待 body
    if (document.body) {
      traverseNode(document.body);
      startObserving();

      // 重新遍历以确保动态加载内容被捕获
      setTimeout(function () {
        if (State.pageConfig) {
          transBySelector();
          traverseNode(document.body);
        }
      }, 2000);
    } else {
      // 如果 body 还没渲染（document-start），等待
      var bodyObserver = new MutationObserver(function () {
        if (document.body) {
          bodyObserver.disconnect();
          traverseNode(document.body);
          startObserving();
          setTimeout(function () {
            if (State.pageConfig) {
              transBySelector();
              traverseNode(document.body);
            }
          }, 2000);
        }
      });
      bodyObserver.observe(document.documentElement, { childList: true });
    }
  }

  // ==================== SPA 导航监听 ====================
  function setupSPAListening() {
    // 监听 popstate（浏览器前进/后退）
    window.addEventListener("popstate", function () {
      setTimeout(function () {
        if (window.location.href !== State.previousURL) {
          State.previousURL = window.location.href;
          handleURLChange();
        }
      }, 100);
    });

    // 劫持 history.pushState / replaceState
    var _pushState = history.pushState;
    history.pushState = function () {
      _pushState.apply(this, arguments);
      setTimeout(function () {
        if (window.location.href !== State.previousURL) {
          State.previousURL = window.location.href;
          handleURLChange();
        }
      }, 100);
    };

    var _replaceState = history.replaceState;
    history.replaceState = function () {
      _replaceState.apply(this, arguments);
      setTimeout(function () {
        if (window.location.href !== State.previousURL) {
          State.previousURL = window.location.href;
          handleURLChange();
        }
      }, 100);
    };

    // Next.js 路由事件（如果有暴露）
    if (window.next && window.next.router) {
      try {
        window.next.router.events.on("routeChangeComplete", function () {
          setTimeout(function () {
            if (window.location.href !== State.previousURL) {
              State.previousURL = window.location.href;
              handleURLChange();
            }
          }, 200);
        });
      } catch (e) {}
    }
  }

  // ==================== 菜单命令 ====================
  function registerMenus() {
    try {
      // 切换正则翻译
      GM_registerMenuCommand(
        "启用正则翻译（开关）",
        function () {
          State.enableRegex = !State.enableRegex;
          saveConfig();
          doTranslate();
          console.log(
            "[mem0-chinese] 正则翻译: " +
            (State.enableRegex ? "开启" : "关闭")
          );
        }
      );

      // 切换未匹配词记录
      GM_registerMenuCommand(
        "记录未匹配词汇（开关）",
        function () {
          State.enableMissedTerms = !State.enableMissedTerms;
          saveConfig();
          if (State.enableMissedTerms) {
            State.missedTerms = {};
          }
          console.log(
            "[mem0-chinese] 记录未匹配词汇: " +
            (State.enableMissedTerms ? "开启 (缓存已清空)" : "关闭")
          );
        }
      );

      // 清空未匹配词汇缓存
      GM_registerMenuCommand("清空未匹配词汇", function () {
        var count = Object.keys(State.missedTerms).length;
        State.missedTerms = {};
        console.log("[mem0-chinese] 已清空 " + count + " 条未匹配词汇。");
        alert("已清空 " + count + " 条缓存。");
      });

      // 导出未匹配词汇
      GM_registerMenuCommand("导出未匹配词汇", function () {
        if (Object.keys(State.missedTerms).length === 0) {
          alert("没有未匹配的词汇。");
          return;
        }
        var sorted = Object.entries(State.missedTerms).sort(function (a, b) {
          return b[1] - a[1];
        });
        var output = sorted
          .map(function (e) {
            return e[1] + "\t" + JSON.stringify(e[0]);
          })
          .join("\n");
        console.log("=== Mem0 未匹配词汇 ===\n" + output);
        alert(
          "已输出到控制台（F12 -> Console），共 " + sorted.length + " 个词汇。"
        );
      });

      // 手动刷新
      GM_registerMenuCommand("手动刷新翻译", function () {
        doTranslate();
      });
    } catch (e) {}
  }

  // ==================== 添加 CSS ====================
  function addStyles() {
    try {
      GM_addStyle(`
        /* mem0-chinese 加载指示 */
        .mem0-zh-loading {
          opacity: 0.6;
        }
      `);
    } catch (e) {}
  }

  // ==================== 启动 ====================
  function init() {
    loadConfig();
    State.previousURL = window.location.href;
    State.pageType = detectPageType();
    State.pageConfig = buildPageConfig(State.pageType);

    addStyles();
    registerMenus();
    setupSPAListening();

    if (
      document.readyState === "interactive" ||
      document.readyState === "complete"
    ) {
      doInitTrans();
    } else {
      document.addEventListener("DOMContentLoaded", doInitTrans, { once: true });
    }

    // 兜底：5秒后再检查一次
    setTimeout(function () {
      if (State.pageConfig) {
        transBySelector();
        traverseNode(document.body);
      }
    }, 5000);
  }

  init();
})();
