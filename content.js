// ==Mem0Chinese==
// Mem0 中文本地化 — Chrome Extension 内容脚本
// 与 mem0-chinese.user.js 功能一致，适配 Chrome Extension API
// ==/Mem0Chinese==

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

  function loadConfig() {
    try {
      var saved = localStorage.getItem(CONFIG_KEY);
      if (saved) {
        var config = JSON.parse(saved);
        State.enableRegex = config.enableRegex !== false;
        State.enableMissedTerms = config.enableMissedTerms === true;
      }
    } catch (e) {}
  }

  function saveConfig() {
    localStorage.setItem(
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

    if (/^\/(login|auth)/.test(pathname)) return "login";
    if (pathname === "/dashboard/get-started") return "dashboard/get-started";
    if (/\/onboarding/.test(pathname)) return "dashboard/get-started";
    if (pathname === "/dashboard/requests") return "dashboard/requests";
    if (pathname === "/dashboard" || pathname === "/") return "dashboard";
    if (/^\/project\//.test(pathname)) return "project";
    if (/^\/projects/.test(pathname)) return "projects";
    if (/^\/history/.test(pathname)) return "history";
    if (/^\/instructions/.test(pathname)) return "instructions";
    if (/^\/get-api-key/.test(pathname)) return "get-api-key";
    if (/^\/members/.test(pathname)) return "members";
    if (/^\/explore/.test(pathname)) return "explore";
    if (/^\/e\//.test(pathname)) return "e";
    if (/^\/person/.test(pathname)) return "person";
    if (/^\/config/.test(pathname)) return "config";
    if (/^\/org/.test(pathname)) return "organization";
    if (/^\/error/.test(pathname)) return "error";
    if (/enterprise/.test(pathname)) return "enterprise-intake";

    return "";
  }

  // ==================== 初始化当前页面配置 ====================
  function buildPageConfig(pageType) {
    // 即使页面类型未知，也加载 public 词库保证翻译不白屏
    if (!I18N["zh-CN"]) return null;
    var effectiveType = pageType || "_fallback";

    var zh = I18N["zh-CN"];
    var conf = I18N.conf || {};

    var staticDict = {};
    var regexpRules = [];
    var selectorRules = [];
    var titleStatic = {};
    var titleRegexp = [];

    if (zh["public"]) {
      Object.assign(staticDict, zh["public"].static || {});
      regexpRules = regexpRules.concat(zh["public"].regexp || []);
      selectorRules = selectorRules.concat(zh["public"].selector || []);
    }

    if (zh["title"] && zh["title"].static) {
      Object.assign(titleStatic, zh["title"].static);
    }
    if (zh["title"] && zh["title"].regexp) {
      titleRegexp = titleRegexp.concat(zh["title"].regexp);
    }

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
    if (/[\u4e00-\u9fff]/.test(text)) return text;

    var trimmed = text.trim();
    if (!trimmed) return text;
    if (!/[a-zA-Z]/.test(trimmed)) return text;
    if (trimmed.length < 2) return text;

    var config = State.pageConfig;
    if (!config) return text;

    // 1) 静态词典
    if (config.staticDict[trimmed]) {
      return config.staticDict[trimmed];
    }

    // 2) 正则规则
    if (State.enableRegex && config.regexpRules) {
      for (var i = 0; i < config.regexpRules.length; i++) {
        var rule = config.regexpRules[i];
        var result = trimmed.replace(rule[0], rule[1]);
        if (result !== trimmed) return result;
      }
    }

    // 3) 记录未匹配
    if (State.enableMissedTerms && trimmed.length >= 3) {
      State.missedTerms[trimmed] = (State.missedTerms[trimmed] || 0) + 1;
    }

    return text;
  }

  function shouldIgnoreNode(node, isMutation) {
    if (!node || !node.parentNode) return true;

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

    if (["input", "textarea"].indexOf(tagName) >= 0 && node.placeholder) {
      var ph = fetchTransResult(node.placeholder);
      if (ph !== node.placeholder) node.placeholder = ph;
    }

    if (node.getAttribute && node.getAttribute("aria-label")) {
      var al = fetchTransResult(node.getAttribute("aria-label"));
      if (al !== node.getAttribute("aria-label"))
        node.setAttribute("aria-label", al);
    }

    if (node.title) {
      var t = fetchTransResult(node.title);
      if (t !== node.title) node.title = t;
    }

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

    if (config.titleStatic && config.titleStatic[document.title]) {
      document.title = config.titleStatic[document.title];
      return;
    }

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
      if (window.location.href !== State.previousURL) {
        State.previousURL = window.location.href;
        handleURLChange();
        return;
      }

      if (State.pauseTranslate) return;

      var nodesToProcess = new Set();

      for (var i = 0; i < mutations.length; i++) {
        var mutation = mutations[i];

        if (mutation.type === "childList") {
          for (var j = 0; j < mutation.addedNodes.length; j++) {
            var node = mutation.addedNodes[j];
            if (!shouldIgnoreNode(node, true)) {
              nodesToProcess.add(node);
            }
          }
        }

        if (mutation.type === "attributes" && mutation.target) {
          if (!shouldIgnoreNode(mutation.target, true)) {
            transElementAttrs(mutation.target);
          }
        }

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

    if (document.body) {
      traverseNode(document.body);
      startObserving();

      setTimeout(function () {
        if (State.pageConfig) {
          transBySelector();
          traverseNode(document.body);
        }
      }, 2000);
    } else {
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
    window.addEventListener("popstate", function () {
      setTimeout(function () {
        if (window.location.href !== State.previousURL) {
          State.previousURL = window.location.href;
          handleURLChange();
        }
      }, 100);
    });

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

  // ==================== 调试 API（Chrome 扩展版） ====================
  // 通过 window.__mem0Chinese 暴露调试接口
  window.__mem0Chinese = {
    toggleRegex: function () {
      State.enableRegex = !State.enableRegex;
      saveConfig();
      doTranslate();
      return State.enableRegex;
    },
    toggleMissedTerms: function () {
      State.enableMissedTerms = !State.enableMissedTerms;
      saveConfig();
      if (State.enableMissedTerms) State.missedTerms = {};
      return State.enableMissedTerms;
    },
    getMissedTerms: function () {
      var sorted = Object.entries(State.missedTerms).sort(function (a, b) {
        return b[1] - a[1];
      });
      return sorted;
    },
    refresh: function () {
      doTranslate();
    },
    getState: function () {
      return {
        pageType: State.pageType,
        enableRegex: State.enableRegex,
        enableMissedTerms: State.enableMissedTerms,
        missedTermsCount: Object.keys(State.missedTerms).length,
      };
    },
  };

  // ==================== 添加 CSS ====================
  function addStyles() {
    var style = document.createElement("style");
    style.textContent = ".mem0-zh-loading { opacity: 0.6; }";
    document.head.appendChild(style);
  }

  // ==================== 启动 ====================
  function init() {
    loadConfig();
    State.previousURL = window.location.href;
    State.pageType = detectPageType();
    State.pageConfig = buildPageConfig(State.pageType);

    if (document.head) {
      addStyles();
    } else {
      document.addEventListener("DOMContentLoaded", addStyles, { once: true });
    }

    setupSPAListening();

    if (
      document.readyState === "interactive" ||
      document.readyState === "complete"
    ) {
      doInitTrans();
    } else {
      document.addEventListener("DOMContentLoaded", doInitTrans, { once: true });
    }

    setTimeout(function () {
      if (State.pageConfig) {
        transBySelector();
        traverseNode(document.body);
      }
    }, 5000);
  }

  init();
})();
