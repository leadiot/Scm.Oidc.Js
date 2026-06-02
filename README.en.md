# OIDC Federated Login SDK

[![Version](https://img.shields.io/badge/version-1.3.5-blue.svg)](https://github.com/your-repo/oidc)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

A lightweight and easy-to-use OpenID Connect federated login JavaScript SDK that supports multiple login methods and frontend framework integrations.

## ✨ Features

- 🚀 **Lightweight & Zero Dependencies** - Pure JavaScript implementation with no third-party dependencies
- 🎨 **Multiple UI Styles** - Supports icon, card, list and other display formats
- 🔐 **Multiple Login Methods** - Supports WeChat, phone, email and other OAuth login methods
- 📱 **Dual Mode Support** - Web mode and SPA (Single Page Application) mode
- 🖥️ **Multiple Opening Methods** - Supports page redirect, new tab, popup window, dialog
- 🎯 **Framework Integration** - Complete Vue 2/3 support
- 📦 **Modular Design** - AMD, CommonJS, browser global variable multiple import methods
- 🔧 **Highly Configurable** - Rich configuration options to meet different scenario requirements

## 📦 Installation

### Direct Import

```html
<!-- Import CSS -->
<link rel="stylesheet" href="oidc.min.css" />

<!-- Import SDK -->
<script src="oidc.min.js"></script>
```

### Vue Project Integration

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

## 🚀 Quick Start

### Basic Usage

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="oidc.min.css" />
    <script src="oidc.min.js"></script>
</head>
<body>
    <!-- Login container -->
    <div id="oidc-container"></div>

    <script>
        // Initialize OIDC
        oidc.init('your-app-key', 'oidc-container', {
            mode: 'web',           // Mode: web | spa
            style: 'icon',         // Display style: icon | card | list
            target: 'link',        // Opening method: link | tab | window | dialog
            https: true,           // Use HTTPS
            log: true,             // Enable logging
            logLevel: 'info',      // Log level: debug | info | warn | error
            
            // Login success callback
            success: function(user) {
                console.log('Login successful:', user);
            },
            
            // Login failure callback
            error: function(err) {
                console.error('Login failed:', err);
            }
        });
    </script>
</body>
</html>
```

### Vue 3 Integration

#### Method 1: Use Plugin (Recommended)

```javascript
const { createApp } = Vue;

const app = createApp({
    template: '<Oidc app-key="your-app-key" @success="onSuccess" />',
    methods: {
        onSuccess(user) {
            console.log('Login successful:', user);
        }
    }
});

// Install OIDC Vue plugin
app.use(oidcVue);
app.mount('#app');
```

#### Method 2: Use Composition API

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
                    console.log('Login successful:', user);
                }
            });
        });

        onUnmounted(() => {
            dispose();
        });

        return { ospList, loading, login };
    },
    template: `
        <div v-if="loading">Loading...</div>
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

### Vue 2 Integration

```javascript
Vue.use(oidcVue);

new Vue({
    el: '#app',
    template: '<oidc app-key="your-app-key" @success="onSuccess" />',
    methods: {
        onSuccess(user) {
            console.log('Login successful:', user);
        }
    }
});
```

## 📖 API Documentation

### Core Methods

#### `oidc.init(appKey, container, option)`

Initialize OIDC login component.

**Parameters:**
- `appKey` (String, required) - Application key
- `container` (String) - Container element ID
- `option` (Object) - Configuration options

**Configuration Options:**

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `mode` | String | `'web'` | Mode: `web` \| `spa` |
| `target` | String | `'link'` | Opening method: `link` \| `tab` \| `window` \| `dialog` |
| `style` | String | `'item'` | Display style: `icon` \| `card` \| `list` |
| `view` | String | `'list'` | View mode: `list` \| `none` |
| `columns` | Number | `5` | Number of columns in card mode |
| `align` | String | `'center'` | Icon alignment: `start` \| `center` \| `end` |
| `https` | Boolean | `false` | Whether to use HTTPS |
| `log` | Boolean | `false` | Whether to enable logging |
| `logLevel` | String | `'info'` | Log level: `debug` \| `info` \| `warn` \| `error` |
| `response_type` | String | `'code'` | OAuth response type |
| `redirect_uri` | String | - | Redirect URI |
| `state` | String | - | Custom state parameter |
| `scope` | String | - | Authorization scope |
| `success` | Function | - | Login success callback |
| `error` | Function | - | Login failure callback |

#### `oidc.load(appKey, callback)`

Preload service list data.

```javascript
oidc.load('your-app-key', function(ospList) {
    console.log('Service list:', ospList);
});
```

#### `oidc.loginA(code)`

Web mode login.

```javascript
oidc.loginA('wechat');  // WeChat login
oidc.loginA('phone');   // Phone login
oidc.loginA('email');   // Email login
```

#### `oidc.loginB(code)`

SPA mode login.

```javascript
oidc.loginB('wechat');
```

#### `oidc.authorizeA(code)`

Web mode authorization.

```javascript
oidc.authorizeA('wechat');
```

#### `oidc.authorizeB()`

SPA mode authorization.

```javascript
oidc.authorizeB();
```

#### `oidc.toUri(code)`

Automatically select login method based on current mode.

```javascript
oidc.toUri('wechat');
```

#### `oidc.isRunning()`

Check if task is running.

```javascript
const running = oidc.isRunning();
console.log('Running status:', running);
```

#### `oidc.endListen()`

Stop listening.

```javascript
oidc.endListen();
```

### Vue Component Props

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
    head-html="<h3>Login</h3>"
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

### Vue Composition API

```javascript
const {
    ospList,      // Ref<Array> - OSP list
    loading,      // Ref<Boolean> - Loading state
    error,        // Ref<String|null> - Error message
    initialized,  // Ref<Boolean> - Whether initialized
    init,         // Function - Initialize method
    login,        // Function - Login method
    loginA,       // Function - Web mode login
    loginB,       // Function - SPA mode login
    dispose,      // Function - Cleanup resources
    toUri,        // Function - Redirect to authorization URL
    version       // String - Version number
} = oidcVue.useVue();
```

## 🎨 UI Style Examples

### Icon Mode

```javascript
oidc.init('your-app-key', 'container', {
    style: 'icon',
    align: 'center'
});
```

### Card Mode

```javascript
oidc.init('your-app-key', 'container', {
    style: 'card',
    columns: 3
});
```

### List Mode

```javascript
oidc.init('your-app-key', 'container', {
    style: 'list'
});
```

## 🔧 Advanced Usage

### Dynamic Configuration

```javascript
// Dynamic initialization based on user selection
function initCustom(config) {
    oidc.init(config.appKey, 'container', {
        mode: config.mode,
        target: config.target,
        style: config.style,
        success: function(user) {
            console.log('Login successful:', user);
        }
    });
}
```

### Preload Data

```javascript
// Preload service list to improve subsequent initialization speed
oidc.load('your-app-key', function(ospList) {
    console.log('Preload complete, service count:', ospList.length);
    
    // Can call init multiple times without reloading
    oidc.init('your-app-key', 'container1', { style: 'icon' });
    oidc.init('your-app-key', 'container2', { style: 'card' });
});
```

### Custom Callback Handling

```javascript
oidc.init('your-app-key', 'container', {
    success: function(user) {
        // Handle user information
        console.log('User ID:', user.id);
        console.log('Username:', user.name);
        
        // Save to local storage
        localStorage.setItem('user', JSON.stringify(user));
        
        // Redirect to homepage
        window.location.href = '/dashboard';
    },
    error: function(err) {
        // Error handling
        console.error('Login failed:', err);
        alert('Login failed, please try again');
    }
});
```

## 📁 Project Structure

```
Scm.Oidc.Js/
├── oidc/                  # Source code directory
│   ├── index.js          # Main entry module
│   ├── core.js           # Core configuration module
│   ├── auth.js           # Authentication login module
│   ├── network.js        # Network request module
│   ├── ui.js             # UI rendering module
│   ├── dom.js            # DOM operation module
│   ├── crypto.js         # Encryption module
│   └── task.js           # Task management module
├── oidc.js               # Uncompressed version
├── oidc.min.js           # Compressed version
├── oidc.css              # Style file
├── oidc.min.css          # Compressed style
├── oidc.vue.js           # Vue integration module
├── index.html            # Usage example
└── vue-example.html      # Vue integration example
```

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- IE 11+ (requires polyfill)

## 🔐 Security Recommendations

1. **Use HTTPS** - Always enable HTTPS in production environments
2. **Validate state parameter** - Prevent CSRF attacks
3. **Secure token storage** - Avoid storing sensitive information in localStorage
4. **Regularly update keys** - Periodically rotate App Keys

## 📝 Changelog

### v1.3.5 (2026-06-02)
- Optimized logging system with multi-level log output
- Improved configuration validation and error messages
- Enhanced SPA mode stability

### v1.3.4 (2025-11-22)
- Added complete Vue 2/3 support
- Added Composition API
- Optimized module loading mechanism

## 🤝 Contributing

Issues and Pull Requests are welcome!

1. Fork this repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## 📮 Contact

- Website: https://www.oidc.org.cn
- Issue Feedback: Submit an Issue

## 🙏 Acknowledgments

Thanks to all contributors for their support!
