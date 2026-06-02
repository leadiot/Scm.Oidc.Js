# OIDC 联合登录 SDK

[![Version](https://img.shields.io/badge/version-1.3.5-blue.svg)](https://github.com/your-repo/oidc)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

一个轻量级、易用的 OpenID Connect 联合登录 JavaScript SDK，支持多种登录方式和前端框架集成。

## ✨ 特性

- 🚀 **轻量无依赖** - 纯 JavaScript 实现，无需第三方依赖
- 🎨 **多种 UI 样式** - 支持图标、卡片、列表等多种展示形式
- 🔐 **多种登录方式** - 支持微信、手机、邮箱等多种 OAuth 登录
- 📱 **双模式支持** - Web 模式和 SPA（单页应用）模式
- 🖥️ **多打开方式** - 支持页面跳转、新标签页、弹窗、对话框
- 🎯 **框架集成** - 提供 Vue 2/3 完整支持
- 📦 **模块化设计** - AMD、CommonJS、浏览器全局变量多种引入方式
- 🔧 **高度可配置** - 丰富的配置选项满足不同场景需求

## 📝 使用示例
[示例代码](https://www.oidc.org.cn/OAuth)

## 📦 安装

### 直接引入

```html
<!-- 引入 CSS -->
<link rel="stylesheet" href="oidc.min.css" />

<!-- 引入 SDK -->
<script src="oidc.min.js"></script>
```

### Vue 项目集成

```html
<!-- Vue 3 -->
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<script src="oidc.js"></script>
<script src="oidc.vue.js"></script>

<!-- Vue 2 -->
<script src="https://cdn.jsdelivr.net/npm/vue@2"></script>
<script src="oidc.js"></script>
<script src="oidc.vue.js"></script>
```

## 🚀 快速开始

### 基础用法

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="oidc.min.css" />
    <script src="oidc.min.js"></script>
</head>
<body>
    <!-- 登录容器 -->
    <div id="oidc-container"></div>

    <script>
        // 初始化 OIDC
        oidc.init('your-app-key', 'oidc-container', {
            mode: 'web',           // 运行模式: web | spa
            style: 'icon',         // 显示样式: icon | card | list
            target: 'link',        // 打开方式: link | tab | window | dialog
            https: true,           // 使用 HTTPS
            log: true,             // 开启日志
            logLevel: 'info',      // 日志级别: debug | info | warn | error
            
            // 登录成功回调
            success: function(user) {
                console.log('登录成功:', user);
            },
            
            // 登录失败回调
            error: function(err) {
                console.error('登录失败:', err);
            }
        });
    </script>
</body>
</html>
```

### Vue 3 集成

#### 方式一：使用插件（推荐）

```javascript
const { createApp } = Vue;

const app = createApp({
    template: '<Oidc app-key="your-app-key" @success="onSuccess" />',
    methods: {
        onSuccess(user) {
            console.log('登录成功:', user);
        }
    }
});

// 安装 OIDC Vue 插件
app.use(oidcVue);
app.mount('#app');
```

#### 方式二：使用组合式 API

```javascript
const { createApp, ref, onMounted, onUnmounted } = Vue;

const app = createApp({
    setup() {
        const { ospList, loading, init, login, dispose } = oidcVue.useVue();

        onMounted(() => {
            init('your-app-key', {
                mode: 'spa',
                target: 'dialog',
                success: (user) => {
                    console.log('登录成功:', user);
                }
            });
        });

        onUnmounted(() => {
            dispose();
        });

        return { ospList, loading, login };
    },
    template: `
        <div v-if="loading">加载中...</div>
        <div v-else>
            <button v-for="osp in ospList" 
                    :key="osp.code" 
                    @click="login(osp.code)">
                {{ osp.name }}
            </button>
        </div>
    `
});

app.mount('#app');
```

### Vue 2 集成

```javascript
Vue.use(oidcVue);

new Vue({
    el: '#app',
    template: '<oidc app-key="your-app-key" @success="onSuccess" />',
    methods: {
        onSuccess(user) {
            console.log('登录成功:', user);
        }
    }
});
```

## 📖 API 文档

### 核心方法

#### `oidc.init(appKey, container, option)`

初始化 OIDC 登录组件。

**参数：**
- `appKey` (String, 必填) - 应用密钥
- `container` (String) - 容器元素 ID
- `option` (Object) - 配置选项

**配置选项：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `mode` | String | `'web'` | 运行模式：`web` \| `spa` |
| `target` | String | `'link'` | 打开方式：`link` \| `tab` \| `window` \| `dialog` |
| `style` | String | `'item'` | 显示样式：`icon` \| `card` \| `list` |
| `view` | String | `'list'` | 视图模式：`list` \| `none` |
| `columns` | Number | `5` | 卡片模式列数 |
| `align` | String | `'center'` | 图标对齐：`start` \| `center` \| `end` |
| `https` | Boolean | `false` | 是否使用 HTTPS |
| `log` | Boolean | `false` | 是否开启日志 |
| `logLevel` | String | `'info'` | 日志级别：`debug` \| `info` \| `warn` \| `error` |
| `response_type` | String | `'code'` | OAuth 响应类型 |
| `redirect_uri` | String | - | 回调地址 |
| `state` | String | - | 自定义状态参数 |
| `scope` | String | - | 授权范围 |
| `success` | Function | - | 登录成功回调 |
| `error` | Function | - | 登录失败回调 |

#### `oidc.load(appKey, callback)`

预加载服务列表数据。

```javascript
oidc.load('your-app-key', function(ospList) {
    console.log('服务列表:', ospList);
});
```

#### `oidc.loginA(code)`

Web 模式登录。

```javascript
oidc.loginA('wechat');  // 微信登录
oidc.loginA('phone');   // 手机登录
oidc.loginA('email');   // 邮箱登录
```

#### `oidc.loginB(code)`

SPA 模式登录。

```javascript
oidc.loginB('wechat');
```

#### `oidc.authorizeA(code)`

Web 模式授权。

```javascript
oidc.authorizeA('wechat');
```

#### `oidc.authorizeB()`

SPA 模式授权。

```javascript
oidc.authorizeB();
```

#### `oidc.toUri(code)`

根据当前模式自动选择登录方式。

```javascript
oidc.toUri('wechat');
```

#### `oidc.isRunning()`

检查任务是否运行中。

```javascript
const running = oidc.isRunning();
console.log('运行状态:', running);
```

#### `oidc.endListen()`

停止监听。

```javascript
oidc.endListen();
```

### Vue 组件属性

```html
<Oidc
    app-key="your-app-key"
    mode="web"
    view="list"
    style="item"
    target="link"
    https="false"
    show-card="true"
    show-head="false"
    head-html="<h3>登录</h3>"
    show-foot="false"
    foot-html="<p>OIDC</p>"
    align="start"
    columns="1"
    response-type="code"
    redirect-uri=""
    state=""
    scope=""
    @success="onSuccess"
    @error="onError"
/>
```

### Vue 组合式 API

```javascript
const {
    ospList,      // Ref<Array> - OSP列表
    loading,      // Ref<Boolean> - 加载状态
    error,        // Ref<String|null> - 错误信息
    initialized,  // Ref<Boolean> - 是否已初始化
    init,         // Function - 初始化方法
    login,        // Function - 登录方法
    loginA,       // Function - Web模式登录
    loginB,       // Function - SPA模式登录
    dispose,      // Function - 清理资源
    toUri,        // Function - 跳转到授权URL
    version       // String - 版本号
} = oidcVue.useVue();
```

## 🎨 UI 样式示例

### 图标模式

```javascript
oidc.init('your-app-key', 'container', {
    style: 'icon',
    align: 'center'
});
```

### 卡片模式

```javascript
oidc.init('your-app-key', 'container', {
    style: 'card',
    columns: 3
});
```

### 列表模式

```javascript
oidc.init('your-app-key', 'container', {
    style: 'list'
});
```

## 🔧 高级用法

### 动态配置

```javascript
// 根据用户选择动态初始化
function initCustom(config) {
    oidc.init(config.appKey, 'container', {
        mode: config.mode,
        target: config.target,
        style: config.style,
        success: function(user) {
            console.log('登录成功:', user);
        }
    });
}
```

### 预加载数据

```javascript
// 预加载服务列表，提高后续初始化速度
oidc.load('your-app-key', function(ospList) {
    console.log('预加载完成，服务数量:', ospList.length);
    
    // 可以多次调用 init 而无需重复加载
    oidc.init('your-app-key', 'container1', { style: 'icon' });
    oidc.init('your-app-key', 'container2', { style: 'card' });
});
```

### 自定义回调处理

```javascript
oidc.init('your-app-key', 'container', {
    success: function(user) {
        // 处理用户信息
        console.log('用户ID:', user.id);
        console.log('用户名:', user.name);
        
        // 保存到本地存储
        localStorage.setItem('user', JSON.stringify(user));
        
        // 跳转到首页
        window.location.href = '/dashboard';
    },
    error: function(err) {
        // 错误处理
        console.error('登录失败:', err);
        alert('登录失败，请重试');
    }
});
```

## 📁 项目结构

```
Scm.Oidc.Js/
├── oidc/                  # 源码目录
│   ├── index.js          # 主入口模块
│   ├── core.js           # 核心配置模块
│   ├── auth.js           # 认证登录模块
│   ├── network.js        # 网络请求模块
│   ├── ui.js             # UI渲染模块
│   ├── dom.js            # DOM操作模块
│   ├── crypto.js         # 加密模块
│   └── task.js           # 任务管理模块
├── oidc.js               # 未压缩版本
├── oidc.min.js           # 压缩版本
├── oidc.css              # 样式文件
├── oidc.min.css          # 压缩样式
├── oidc.vue.js           # Vue集成模块
├── index.html            # 使用示例
└── vue-example.html      # Vue集成示例
```

## 🌐 浏览器支持

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)
- IE 11+ (需要 polyfill)

## 🔐 安全建议

1. **使用 HTTPS** - 生产环境务必启用 HTTPS
2. **验证 state 参数** - 防止 CSRF 攻击
3. **安全存储 Token** - 避免在 localStorage 存储敏感信息
4. **定期更新密钥** - 定期更换 App Key

## 📝 更新日志

### v1.3.5 (2026-06-02)
- 优化日志系统，支持多级别日志输出
- 改进配置验证和错误提示
- 增强 SPA 模式的稳定性

### v1.3.4 (2025-11-22)
- 新增 Vue 2/3 完整支持
- 添加组合式 API
- 优化模块加载机制

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 📮 联系方式

- 官网：https://www.oidc.org.cn
- 问题反馈：提交 Issue

## 🙏 致谢

感谢所有贡献者的支持！
