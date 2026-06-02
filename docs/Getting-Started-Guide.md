# 📖 OIDC - Getting Started Guide for Beginners

## 📸 See the Effects First!

### Web Login Interface
![Web Login Interface](../screenshots/web-login.png)

### App Login Interface
![App Login Interface](../screenshots/app-login.png)

---

## 👋 Hello! Welcome to OIDC

Have you ever encountered these problems:

- 🤔 Want to add login functionality to your website, but don't want to handle registration, login, verification codes, password recovery...
- 😫 It's annoying to make users fill in a bunch of information every time!
- 😱 Worried about storing user passwords safely...

Don't worry! **OIDC Federated Login** is here to solve all these problems!

---

## 🎯 What is OIDC? (In one sentence)

**OIDC** is like a "universal key":
- Users don't need to register an account on your site
- Users can log in with existing accounts like WeChat, QQ, GitHub, etc.
- You don't have to worry about password security
- Just like "Login with WeChat"!

---

## 🚀 5-Minute Quick Start (Super Easy!)

### Step 1: Include the files

Add these two lines to your HTML file:

```html
<!-- Include the CSS file -->
<link rel="stylesheet" href="oidc.css">

<!-- Include the JS file -->
<script src="oidc.js"></script>
```

That's it! Just like including jQuery!

---

### Step 2: Find a place for the login buttons

Find a suitable place in your page (like the login area) and add a container:

```html
<div id="oidc-login"></div>
```

This `<div>` is the reserved space for the login buttons.

---

### Step 3: Initialize the configuration

Add this code in your `<script>` tag:

```javascript
// Initialize OIDC with your App Key
oidc.init('Your App Key', {
    el: '#oidc-login',  // The container ID you just created
    logLevel: 'info'    // Show logs for debugging
});
```

**Wait! Where do I get the App Key?**

Don't worry! You need to register an account at `oidc.org.cn` first, create an app, and you'll get the App Key! Just like applying for a WeChat Official Account AppID!

---

### Step 4: Load the login buttons

Now, let's load the login buttons:

```javascript
oidc.load('Your App Key', function(ospList) {
    console.log('Login buttons loaded successfully!', ospList);
});
```

That's it! Refresh the page and you'll see the beautiful login buttons!🎉

---

## 💡 Complete Example (Copy and Use!)

Save the code below as `index.html` and open it in your browser:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First OIDC Page</title>
    <link rel="stylesheet" href="oidc.css">
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to OIDC Federated Login!</h1>
        
        <!-- Here's where the login buttons go -->
        <div id="oidc-login"></div>
    </div>

    <script src="oidc.js"></script>
    <script>
        // 1. Initialize
        oidc.init('Your App Key', {
            el: '#oidc-login',
            logLevel: 'info'
        });

        // 2. Load login buttons
        oidc.load('Your App Key', function(ospList) {
            console.log('🎉 Login buttons loaded!', ospList);
        });
    </script>
</body>
</html>
```

---

## 🎨 Three Beautiful Button Styles for You to Choose!

OIDC comes with three beautiful login button styles - no need to write your own CSS!

### Style 1: Icon Mode (Compact and Clean)

```javascript
oidc.init('Your App Key', {
    el: '#oidc-login',
    uiType: 'icon'  // Icon mode
});
```

---

### Style 2: Card Mode (Elegant and Beautiful)

```javascript
oidc.init('Your App Key', {
    el: '#oidc-login',
    uiType: 'card'  // Card mode
});
```

---

### Style 3: List Mode (Neat and Organized)

```javascript
oidc.init('Your App Key', {
    el: '#oidc-login',
    uiType: 'list'  // List mode
});
```

**Recommendation**: Try all three styles and pick your favorite!✨

---

## 📱 Vue Users, Look Here! (Super Simple!)

If you're using Vue, it's even easier!

### Vue 3 Simplest Usage:

```html
<template>
  <div>
    <h1>Vue 3 + OIDC</h1>
    <Oidc 
      app-key="Your App Key" 
      @success="onLoginSuccess"
    />
  </div>
</template>

<script setup>
import { Oidc } from './oidc.vue.js';

const onLoginSuccess = (data) => {
  console.log('Login successful!', data);
};
</script>
```

---

### Vue 2 Usage:

```html
<template>
  <div>
    <h1>Vue 2 + OIDC</h1>
    <oidc 
      app-key="Your App Key" 
      @success="onLoginSuccess"
    />
  </div>
</template>

<script>
export default {
  methods: {
    onLoginSuccess(data) {
      console.log('Login successful!', data);
    }
  }
};
</script>
```

---

## 🔍 What Do I Get After Successful Login?

When the user clicks the login button and successfully logs in, you'll receive data like this:

```javascript
oidc.init('Your App Key', {
    el: '#oidc-login',
    success: function(data) {
        console.log('Login successful!', data);
        // data includes: user ID, nickname, avatar, etc.
    }
});
```

You can use this information to:
- Save user info to your database
- Set login status
- Redirect to user center

---

## ⚡ Advanced Features (For Advanced Users)

### Feature 1: Custom Callback Functions

```javascript
oidc.init('Your App Key', {
    el: '#oidc-login',
    
    // Callback on successful login
    success: function(data) {
        alert('Login successful! Welcome ' + data.nickname);
        // You can redirect to home page here
    },
    
    // Callback on login failure
    fail: function(error) {
        alert('Login failed: ' + error.message);
    },
    
    // Callback when login is canceled
    cancel: function() {
        console.log('User canceled login');
    }
});
```

---

### Feature 2: Dynamically Update Configuration

Want to change the style? No need to refresh the page!

```javascript
// Change to card mode
oidc.config({
    uiType: 'card'
});

// Refresh display
oidc.refresh();
```

---

### Feature 3: Preload (Faster!)

If you want the buttons to load faster, you can preload the data:

```javascript
// Preload when the page loads
window.addEventListener('load', function() {
    oidc.preload('Your App Key');
});

// Display later
setTimeout(function() {
    oidc.load('Your App Key', function(list) {
        console.log('Data was ready a long time ago!');
    });
}, 1000);
```

---

## 🔧 Frequently Asked Questions (FAQ)

### Q1: Why aren't the login buttons showing up?

**Answer**: Please check the following:
1. ✅ Are `oidc.js` and `oidc.css` file paths correct?
2. ✅ Did you fill in the App Key correctly?
3. ✅ Are there any errors in the browser console (press F12)?
4. ✅ Are you accessing the page with `http://` (not by double-clicking the HTML file)?

---

### Q2: How do I get an App Key?

**Answer**:
1. Visit `oidc.org.cn`
2. Register an account and log in
3. Create a new app
4. You'll see your App Key!

---

### Q3: Which files should I use in production?

**Answer**: For faster page loading, use the compressed files in production:

| File Type | Development | Production |
|-----------|-------------|------------|
| JS File | `oidc.js` | `oidc.mn.js` |
| Vue File | `oidc.vue.js` | `oidc.vue.mn.js` |
| CSS File | `oidc.css` | `oidc.mn.css` |

Compressed files are smaller and load faster!🚀

---

### Q4: Can I use HTTPS?

**Answer**: Absolutely! It will auto-detect by default:

```javascript
// Auto-detect (recommended)
oidc.init('Your App Key');

// Or force HTTPS
oidc.init('Your App Key', {
    https: true
});

// Force HTTP
oidc.init('Your App Key', {
    https: false
});
```

---

## 📚 More Learning Resources

- 📖 [README.md](../README.md) - Complete API documentation
- 📖 [README.en.md](../README.en.md) - English documentation
- 🎯 [index.html](../index.html) - Complete example code
- 🎯 [vue-example.html](../vue-example.html) - Vue integration example

---

## 🎉 Congratulations!

You've learned the basics of OIDC federated login! Isn't it easy?

Now, go try it on your website! Feel free to ask if you have any questions!

---

**Happy coding!** 💖

---

*Questions? Feel free to open an Issue!*
