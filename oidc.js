/**
 * OIDC - 联合登录
 * 
 * Date: 2026-06-02
 * Version: 1.3.5
 * 
 * 模块化重构版本，支持浏览器直接引入和CommonJS模块
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // CommonJS
        module.exports = factory();
    } else {
        // 浏览器全局
        root.oidc = factory();
    }
})(typeof self !== 'undefined' ? self : this, function () {
    /**
     * Core Module
     */
    const Core = (function () {
        const _ver = '1.3.5';
        const _site = 'oidc.org.cn';
        let _base = '';
        let _key = '';
        let _mode = 'web';
        let _option = {};
        let _log = false;
        let _target = 'none';
        let _logLevel = 'info'; // debug, info, warn, error

        function log(txt, level = 'info') {
            if (!_log) return;

            // 根据日志级别过滤
            const levels = { debug: 0, info: 1, warn: 2, error: 3 };
            const currentLevel = levels[_logLevel] || 1;
            const msgLevel = levels[level] || 1;

            if (msgLevel < currentLevel) return;

            const timestamp = new Date().toISOString();
            const prefix = `[OIDC][${level.toUpperCase()}][${timestamp}]`;

            switch (level) {
                case 'error':
                    console.error(prefix, txt);
                    break;
                case 'warn':
                    console.warn(prefix, txt);
                    break;
                case 'debug':
                    console.debug(prefix, txt);
                    break;
                default:
                    console.log(prefix, txt);
            }
        }

        function getOAuthUrl(url) {
            const fullUrl = _base + "/OAuth/" + url;
            log(`构建OAuth URL: ${fullUrl}`, 'debug');
            return fullUrl;
        }

        function initConfig(appKey, option) {
            log('========== 开始初始化核心配置 ==========', 'info');

            // 验证appKey
            if (!appKey) {
                log('错误：appKey为空！', 'error');
                return;
            }
            _key = appKey;
            log(`appKey: ${_key}`, 'debug');

            // 处理option
            if (!option) {
                log('警告：option为空，使用默认配置', 'warn');
                option = {};
            }
            _option = option;

            // 设置日志级别
            _log = !!option.log;
            _logLevel = option.logLevel || 'info';
            log(`日志状态: ${_log}, 日志级别: ${_logLevel}`, 'debug');

            // 设置协议和基础URL
            this.initHttp();

            // 设置模式
            _mode = (option.mode || 'web').toLowerCase();
            if (!['web', 'spa'].includes(_mode)) {
                log(`警告：未知模式 "${_mode}"，使用默认值 "web"`, 'warn');
                _mode = 'web';
            }
            log(`运行模式: ${_mode}`, 'info');

            // 设置打开方式
            _target = option.target || 'link';
            const validTargets = ['none', 'link', 'tab', 'window', 'dialog', '_blank'];
            if (!validTargets.includes(_target)) {
                log(`警告：未知打开方式 "${_target}"，使用默认值 "link"`, 'warn');
                _target = 'link';
            }
            log(`打开方式: ${_target}`, 'info');

            // 记录完整配置
            log(`完整配置: ${JSON.stringify(_option)}`, 'debug');
            log('========== 核心配置初始化完成 ==========', 'info');
        }

        return {
            version: _ver,
            log,
            getBaseUrl: () => _base,
            setBaseUrl: (base) => {
                log(`基础URL变更: ${_base} -> ${base}`, 'info');
                _base = base;
            },
            getKey: () => _key,
            setKey: (key) => {
                log(`appKey变更: ${_key} -> ${key}`, 'info');
                _key = key;
            },
            getMode: () => _mode,
            setMode: (mode) => {
                log(`模式变更: ${_mode} -> ${mode}`, 'info');
                _mode = mode;
            },
            getOption: () => _option,
            setOption: (option) => {
                log(`选项变更: ${JSON.stringify(_option)} -> ${JSON.stringify(option)}`, 'debug');
                _option = option;
                _log = !!option.log;
            },
            getTarget: () => _target,
            setTarget: (target) => {
                log(`打开方式变更: ${_target} -> ${target}`, 'info');
                _target = target;
            },
            getOAuthUrl,
            initConfig,
            initHttp: function () {
                if (!_base) {
                    let protocol = (window.location.protocol || 'http:').toLowerCase();
                    if (!protocol.startsWith('http')) {
                        protocol = 'https:';
                    }

                    _base = protocol + '//' + _site;
                    log(`URL初始化: ${_base}`, 'info');
                }
            }
        };
    })();

    /**
     * DOM Module
     */
    const Dom = (function () {
        function $(id) {
            return document.getElementById(id);
        }

        function createElement(tagName, parent) {
            const obj = document.createElement(tagName);
            if (parent && parent instanceof HTMLElement) {
                parent.appendChild(obj);
            }
            return obj;
        }

        function setText(element, text) {
            element.innerText = text;
        }

        function setHtml(element, html) {
            element.innerHTML = html;
        }

        function css(element, propertyName, value) {
            if (!(element instanceof HTMLElement)) {
                throw new Error("The first argument must be a DOM element.");
            }

            if (value !== undefined) {
                const styleName = propertyName.replace(/-(\w)/g, (match, char) => char.toUpperCase());
                element.style[styleName] = value;
            } else {
                const computedStyle = window.getComputedStyle(element);
                return computedStyle.getPropertyValue(propertyName);
            }
        }

        function attr(element, propertyName, value) {
            if (!(element instanceof HTMLElement)) {
                throw new Error("The first argument must be a DOM element.");
            }
            return value == undefined ? element.getAttribute(propertyName) : element.setAttribute(propertyName, value);
        }

        function hasClass(element, className) {
            return new RegExp("(^|\\s)" + className + "(\\s|$)").test(element.className);
        }

        function addClass(element, className) {
            const ary = className.replace(/(^ +| +$)/g, "").split(/ +/g);
            for (let i = 0; i < ary.length; i++) {
                const curClass = ary[i];
                if (!hasClass(element, curClass)) {
                    element.className += " " + curClass;
                }
            }
        }

        function removeClass(element, className) {
            const ary = className.replace(/(^ +| +$)/g, "").split(/ +/g);
            for (let i = 0; i < ary.length; i++) {
                const curClass = ary[i];
                if (hasClass(element, curClass)) {
                    element.className = element.className.replace(new RegExp("(^| +)" + curClass + "( +|$)", "g"), " ").trim();
                }
            }
        }

        return { $, createElement, setText, setHtml, css, attr, hasClass, addClass, removeClass };
    })();

    /**
     * Network Module
     */
    const Network = (function (core) {
        function ajax(data, success, failure) {
            if (!data) return;
            const xhr = new XMLHttpRequest();
            xhr.open(data.method, data.url, true);

            xhr.onload = function () {
                if (xhr.status < 200 || xhr.status >= 300) {
                    console.error('请求失败:', xhr.statusText);
                    return;
                }

                const type = data.type || 'json';
                const result = type.toLowerCase() != 'json' ? xhr.responseText : JSON.parse(xhr.responseText);
                success(result);
            };

            xhr.ontimeout = failure;
            xhr.onerror = failure;
            xhr.send();
        }

        function get(url, success, failure) {
            ajax({ method: 'GET', url: url }, success, failure);
        }

        function listOsp(callback) {
            const url = core.getOAuthUrl("Osp?key=" + core.getKey());
            core.log("listOsp:" + url);
            get(url, function (result) {
                if (result && callback) callback(result.data);
            }, function (error) {
                core.log("listOsp:" + error);
            });
        }

        function handshake(callback) {
            let url = core.getOAuthUrl("handshake");
            let tmp = "";
            const key = core.getKey();
            const option = core.getOption();

            if (key) tmp += "&client_id=" + key;
            if (option.response_type) tmp += "&response_type=" + option.response_type;
            if (option.redirect_uri) tmp += "&redirect_uri=" + encodeURIComponent(option.redirect_uri);
            if (option.state) tmp += "&state=" + encodeURIComponent(option.state);
            if (option.scope) tmp += "&scope=" + encodeURIComponent(option.scope);
            tmp += "&request_id=" + (new Date()).getTime() + "&cipher=md5";

            if (tmp.length > 0) url += "?" + tmp.substring(1);
            core.log('handshake:' + url);

            get(url, function (result) {
                if (!result || !result.success) {
                    if (result) core.log(result.message);
                    return;
                }
                if (callback) callback(result.ticket);
            }, function (error) {
                core.log("handshake:" + error);
            });
        }

        return { ajax, get, listOsp, handshake };
    })(Core);

    /**
     * Crypto Module
     */
    const Crypto = (function () {
        function md5(string, key, raw) {
            function safeAdd(x, y) {
                const lsw = (x & 0xffff) + (y & 0xffff);
                const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
                return (msw << 16) | (lsw & 0xffff);
            }

            function bitRotateLeft(num, cnt) {
                return (num << cnt) | (num >>> (32 - cnt));
            }

            function md5cmn(q, a, b, x, s, t) {
                return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
            }

            function md5ff(a, b, c, d, x, s, t) { return md5cmn((b & c) | (~b & d), a, b, x, s, t); }
            function md5gg(a, b, c, d, x, s, t) { return md5cmn((b & d) | (c & ~d), a, b, x, s, t); }
            function md5hh(a, b, c, d, x, s, t) { return md5cmn(b ^ c ^ d, a, b, x, s, t); }
            function md5ii(a, b, c, d, x, s, t) { return md5cmn(c ^ (b | ~d), a, b, x, s, t); }

            function binlMD5(x, len) {
                x[len >> 5] |= 0x80 << len % 32;
                x[(((len + 64) >>> 9) << 4) + 14] = len;

                let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
                for (let i = 0; i < x.length; i += 16) {
                    const olda = a, oldb = b, oldc = c, oldd = d;

                    a = md5ff(a, b, c, d, x[i], 7, -680876936);
                    d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
                    c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
                    b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
                    a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
                    d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
                    c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
                    b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
                    a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
                    d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
                    c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
                    b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
                    a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
                    d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
                    c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
                    b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);

                    a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
                    d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
                    c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
                    b = md5gg(b, c, d, a, x[i], 20, -373897302);
                    a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
                    d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
                    c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
                    b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
                    a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
                    d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
                    c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
                    b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
                    a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
                    d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
                    c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
                    b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);

                    a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
                    d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
                    c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
                    b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
                    a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
                    d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
                    c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
                    b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
                    a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
                    d = md5hh(d, a, b, c, x[i], 11, -358537222);
                    c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
                    b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
                    a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
                    d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
                    c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
                    b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);

                    a = md5ii(a, b, c, d, x[i], 6, -198630844);
                    d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
                    c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
                    b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
                    a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
                    d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
                    c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
                    b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
                    a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
                    d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
                    c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
                    b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
                    a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
                    d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
                    c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
                    b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);

                    a = safeAdd(a, olda); b = safeAdd(b, oldb); c = safeAdd(c, oldc); d = safeAdd(d, oldd);
                }
                return [a, b, c, d];
            }

            function binl2rstr(input) {
                let output = '';
                for (let i = 0; i < input.length * 32; i += 8) {
                    output += String.fromCharCode((input[i >> 5] >>> i % 32) & 0xff);
                }
                return output;
            }

            function rstr2binl(input) {
                const output = [];
                output[(input.length >> 2) - 1] = undefined;
                for (let i = 0; i < output.length; i++) output[i] = 0;
                for (let i = 0; i < input.length * 8; i += 8) {
                    output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << i % 32;
                }
                return output;
            }

            function rstrMD5(s) { return binl2rstr(binlMD5(rstr2binl(s), s.length * 8)); }
            function rstrHMACMD5(key, data) {
                const bkey = rstr2binl(key);
                const ipad = [], opad = [];
                ipad[15] = opad[15] = undefined;
                if (bkey.length > 16) bkey = binlMD5(bkey, key.length * 8);
                for (let i = 0; i < 16; i++) {
                    ipad[i] = bkey[i] ^ 0x36363636;
                    opad[i] = bkey[i] ^ 0x5c5c5c5c;
                }
                const hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
                return binl2rstr(binlMD5(opad.concat(hash), 512 + 128));
            }

            function rstr2hex(input) {
                const hexTab = '0123456789abcdef';
                let output = '';
                for (let i = 0; i < input.length; i++) {
                    const x = input.charCodeAt(i);
                    output += hexTab.charAt((x >>> 4) & 0x0f) + hexTab.charAt(x & 0x0f);
                }
                return output;
            }

            function str2rstrUTF8(input) { return unescape(encodeURIComponent(input)); }
            function rawMD5(s) { return rstrMD5(str2rstrUTF8(s)); }
            function hexMD5(s) { return rstr2hex(rawMD5(s)); }
            function rawHMACMD5(k, d) { return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d)); }
            function hexHMACMD5(k, d) { return rstr2hex(rawHMACMD5(k, d)); }

            if (!key) return raw ? rawMD5(string) : hexMD5(string);
            return raw ? rawHMACMD5(key, string) : hexHMACMD5(key, string);
        }

        return { md5 };
    })();

    /**
     * Task Module
     */
    const Task = (function (core, network, crypto) {
        let _timer = null;
        let _steps = 0;

        function runTask(steps, task, param) {
            if (_timer || !steps || steps < 1) return;
            _steps = 0;
            _timer = setInterval(() => {
                if (_steps < steps) { task(param); _steps++; }
                else { stopTask(); }
            }, 1000);
        }

        function stopTask() {
            if (_timer) { clearInterval(_timer); _timer = null; }
        }

        function listen(ticket) {
            const digest = crypto.md5(ticket.nonce + ':' + ticket.salt);
            const url = core.getOAuthUrl(`listen?client_id=${core.getKey()}&ticket=${ticket.code}&digest=${digest}`);

            network.get(url, function (result) {
                if (!result || !result.success) {
                    if (result) core.log(result.message);
                    return;
                }
                ticket.salt = result.salt;
                if (result.handle == 3 && result.result == 2) {
                    const fun = core.getOption().success;
                    if (fun) fun(result.user);
                    stopTask();
                }
            });
        }

        return {
            runTask,
            stopTask,
            runListen: (ticket) => { runTask(300, listen, ticket); },
            isRunning: () => !!_timer
        };
    })(Core, Network, Crypto);

    /**
     * UI Module
     */
    const UI = (function (core, dom) {
        let _root, _dialog, _iframe;
        let isDragging = false, currentX = 0, currentY = 0, initialX = 0, initialY = 0;

        function isMore(code) {
            return ['oidc', 'more'].includes(code.toLowerCase());
        }

        function getLogo(icon) {
            return core.getBaseUrl() + '/data/logo/osp/' + icon;
        }

        function asList(list) {
            let text = "";
            for (let i = 0; i < list.length; i++) {
                const item = list[i];
                const tips = !isMore(item.code) ? '使用 ' + item.name + ' 登录' : '显示更多';
                text += `<div class="oidc-list-item" title="${tips}" onclick="oidc.toUri('${item.code}')">`;
                text += `<span class="logo"><img src="${getLogo(item.icon)}" alt="${item.code}" /></span>`;
                text += '<span class="line"></span><span class="text">' + item.name + '</span></div>';
            }
            return text;
        }

        function asIcon(list) {
            let text = "";
            for (let i = 0; i < list.length; i++) {
                const item = list[i];
                const tips = !isMore(item.code) ? '使用 ' + item.name + ' 登录' : '显示更多';
                text += `<div class="oidc-list-icon" title="${tips}" onclick="oidc.toUri('${item.code}')">`;
                text += `<span class="logo"><img src="${getLogo(item.icon)}" alt="${item.code}" /></span></div>`;
            }
            return text;
        }

        function asCard(list) {
            let text = "";
            for (let i = 0; i < list.length; i++) {
                const item = list[i];
                const tips = !isMore(item.code) ? '使用 ' + item.name + ' 登录' : '显示更多';
                text += `<div class="oidc-list-card" title="${tips}" onclick="oidc.toUri('${item.code}')">`;
                text += `<div class="logo"><img src="${getLogo(item.icon)}" alt="${item.code}" /></div>`;
                text += '<div class="text">' + item.name + '</div></div>';
            }
            return text;
        }

        function showTab(url) { window.open(url, '_blank'); }
        function showWindow(url) {
            const width = 600, height = 400;
            const left = (window.screen.availWidth - width) / 2;
            const top = (window.screen.availHeight - height) / 2;
            window.open(url, 'oidc', `width=${width},height=${height},left=${left},top=${top},resizable=no`);
        }

        function showDialog(url) {
            if (_dialog) { dom.css(_dialog, 'display', 'block'); dom.attr(_iframe, 'src', url); return; }

            _dialog = dom.createElement('div', _root);
            dom.addClass(_dialog, 'oidc-dialog');

            const head = dom.createElement('div', _dialog);
            dom.addClass(head, 'oidc-dialog-head');

            const title = dom.createElement('div', head);
            dom.addClass(title, 'title');
            dom.setText(title, 'OIDC - 联合登录');

            const close = dom.createElement('div', head);
            dom.addClass(close, 'close');
            dom.setText(close, '×');
            close.addEventListener('click', hideDialog);

            const body = dom.createElement('div', _dialog);
            dom.addClass(body, 'oidc-dialog-body');
            _iframe = dom.createElement('iframe', body);
            dom.attr(_iframe, 'src', url);

            const foot = dom.createElement('div', _dialog);
            dom.addClass(foot, 'oidc-dialog-foot');
            dom.setText(foot, 'Powered By OIDC.org.cn');

            centerDialog(_dialog);
            head.addEventListener("mousedown", startDrag);
            document.addEventListener('mousemove', moveDialog);
            document.addEventListener('mouseup', stopDrag);
        }

        function hideDialog() { dom.css(_dialog, 'display', 'none'); }
        function centerDialog(dialog) {
            dialog.style.left = `${(window.innerWidth - dialog.offsetWidth) / 2}px`;
            dialog.style.top = `${(window.innerHeight - dialog.offsetHeight) / 2}px`;
        }

        function startDrag(e) { isDragging = true; initialX = e.clientX - _dialog.offsetLeft; initialY = e.clientY - _dialog.offsetTop; }
        function stopDrag() { isDragging = false; }
        function moveDialog(e) {
            if (!isDragging) return;
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            const maxX = window.innerWidth - _dialog.offsetWidth;
            const maxY = window.innerHeight - _dialog.offsetHeight;
            currentX = Math.max(0, Math.min(currentX, maxX));
            currentY = Math.max(0, Math.min(currentY, maxY));
            _dialog.style.left = `${currentX}px`;
            _dialog.style.top = `${currentY}px`;
        }

        function showData(list, div) {
            const option = core.getOption();
            let showCard = option.showCard !== undefined ? option.showCard : true;
            let oidcDiv = div;

            if (showCard) {
                const oidcCard = dom.createElement("div", div);
                dom.addClass(oidcCard, "oidc-card");
                oidcDiv = oidcCard;
            }

            if (showCard && option.showHead) {
                const oidcHead = dom.createElement("div", oidcDiv);
                dom.addClass(oidcHead, "oidc-card_head");
                dom.setHtml(oidcHead, option.headHtml);
            }

            let oidcBody = oidcDiv;
            if (showCard) {
                oidcBody = dom.createElement("div", oidcDiv);
                dom.addClass(oidcBody, "oidc-card_body");
            }

            const oidcList = dom.createElement("div", oidcBody);
            dom.addClass(oidcList, "oidc-list");

            const style = (option.style || 'item').toLowerCase();
            let text = '';

            if (style == 'icon') {
                dom.addClass(oidcList, 'oidc-data-icon');
                dom.css(oidcList, 'justify-content', option.align || 'start');
                text = asIcon(list);
            } else if (style == 'card') {
                dom.addClass(oidcList, 'oidc-data-card');
                const cols = option.columns || 1;
                if (cols > 1) dom.css(oidcList, "grid-template-columns", `repeat(${cols}, ${100 / cols}%)`);
                text = asCard(list);
            } else {
                dom.addClass(oidcList, 'oidc-data-item');
                text = asList(list);
            }
            dom.setHtml(oidcList, text);

            if (showCard && option.showFoot) {
                const oidcFoot = dom.createElement("div", oidcDiv);
                dom.addClass(oidcFoot, "oidc-card_foot");
                dom.setHtml(oidcFoot, option.footHtml);
            }
        }

        function initContainer(containerId) {
            if (!containerId) containerId = "oidc";
            _root = dom.$(containerId);
            if (!_root) { core.log('找不到容器标签！'); return null; }
            dom.addClass(_root, "oidc");
            return _root;
        }

        return { isMore, getLogo, asList, asIcon, asCard, showTab, showWindow, showDialog, hideDialog, showData, initContainer };
    })(Core, Dom);

    /**
     * Auth Module
     */
    const Auth = (function (core, ui, network, task) {
        function buildParams() {
            let tmp = "";
            const key = core.getKey();
            const option = core.getOption();
            const params = [];

            if (key) {
                tmp += "&client_id=" + key;
                params.push(`client_id=${key}`);
            } else {
                core.log('警告：client_id为空', 'warn');
            }

            if (option.response_type) {
                tmp += "&response_type=" + option.response_type;
                params.push(`response_type=${option.response_type}`);
            } else {
                core.log('警告：response_type为空', 'warn');
            }

            if (option.redirect_uri) {
                tmp += "&redirect_uri=" + encodeURIComponent(option.redirect_uri);
                params.push(`redirect_uri=${option.redirect_uri}`);
            } else {
                core.log('警告：redirect_uri为空', 'warn');
            }

            if (option.state) {
                tmp += "&state=" + encodeURIComponent(option.state);
                params.push(`state=${option.state}`);
            }

            if (option.scope) {
                tmp += "&scope=" + encodeURIComponent(option.scope);
                params.push(`scope=${option.scope}`);
            } else {
                core.log('警告：scope为空，可能导致授权范围不完整', 'warn');
            }

            core.log(`构建URL参数: [${params.join(', ')}]`, 'debug');
            return tmp;
        }

        function getUrlPath(code) {
            code = code.toLowerCase();
            let url = core.getBaseUrl() + "/oauth";
            let pathType = '';

            if (ui.isMore(code)) {
                url += "/index";
                pathType = '显示更多';
            } else if (code == "phone") {
                url += "/phone";
                pathType = '手机登录';
            } else if (code == "email") {
                url += "/email";
                pathType = '邮箱登录';
            } else {
                url += "/authorizeA/" + code;
                pathType = `第三方授权(${code})`;
            }

            core.log(`获取授权路径: ${url} [${pathType}]`, 'debug');
            return url;
        }

        function getLoginUrlPath(code) {
            code = code.toLowerCase();
            let url = core.getBaseUrl() + "/oauth";
            let pathType = '';

            if (ui.isMore(code)) {
                url += "/index";
                pathType = '显示更多';
            } else if (code == "phone") {
                url += "/phone";
                pathType = '手机登录';
            } else if (code == "email") {
                url += "/email";
                pathType = '邮箱登录';
            } else {
                url += "/LoginA/" + code;
                pathType = `第三方登录(${code})`;
            }

            core.log(`获取登录路径: ${url} [${pathType}]`, 'debug');
            return url;
        }

        function openUrl(url) {
            const target = core.getTarget();
            core.log(`准备打开URL: ${url} (target: ${target})`, 'info');

            if (target == 'none') {
                core.log('目标为none，不执行跳转', 'warn');
                return;
            }

            if (target == 'dialog') {
                core.log('使用dialog方式打开', 'info');
                ui.showDialog(url);
                return;
            }

            if (target == 'tab' || target == '_blank') {
                core.log('使用新标签页打开', 'info');
                ui.showTab(url);
                return;
            }

            if (target == 'window') {
                core.log('使用弹窗打开', 'info');
                ui.showWindow(url);
                return;
            }

            // 默认link方式
            core.log('使用页面跳转方式', 'info');
            window.location.href = url;
        }

        function authorizeA(code) {
            core.log('========== 开始Web模式授权流程 ==========', 'info');
            core.log(`授权码: ${code}`, 'debug');

            let url = getUrlPath(code);
            const params = buildParams();

            if (params.length > 0) {
                url += "?" + params.substring(1);
            }

            core.log(`最终授权URL: ${url}`, 'info');
            openUrl(url);
            core.log('========== Web模式授权流程结束 ==========', 'info');
        }

        function loginA(code) {
            core.log('========== 开始Web模式登录流程 ==========', 'info');
            core.log(`登录码: ${code}`, 'debug');

            let url = getLoginUrlPath(code);
            const params = buildParams();

            if (params.length > 0) {
                url += "?" + params.substring(1);
            }

            core.log(`最终登录URL: ${url}`, 'info');
            openUrl(url);
            core.log('========== Web模式登录流程结束 ==========', 'info');
        }

        function authorizeB() {
            core.log('========== 开始SPA模式授权流程 ==========', 'info');

            network.handshake((ticket) => {
                if (!ticket) {
                    core.log('错误：握手失败，未获取到ticket', 'error');
                    return;
                }

                core.log(`握手成功，ticket: ${ticket.code}`, 'debug');

                const url = core.getOAuthUrl("authorizeB?ticket=" + ticket.code);
                core.log(`授权URL: ${url}`, 'info');

                window.open(url, "_blank");
                core.log('已打开授权窗口', 'info');

                core.log('开始监听登录状态', 'info');
                task.runListen(ticket);
                core.log('========== SPA模式授权流程结束 ==========', 'info');
            });
        }

        function loginB(code) {
            core.log('========== 开始SPA模式登录流程 ==========', 'info');
            core.log(`登录码: ${code}`, 'debug');

            network.handshake((ticket) => {
                if (!ticket) {
                    core.log('错误：握手失败，未获取到ticket', 'error');
                    return;
                }

                core.log(`握手成功，ticket: ${ticket.code}`, 'debug');

                const url = core.getOAuthUrl(`LoginB/${code}?ticket=${ticket.code}`);
                core.log(`登录URL: ${url}`, 'info');

                window.open(url, "_blank");
                core.log('已打开登录窗口', 'info');

                core.log('开始监听登录状态', 'info');
                task.runListen(ticket);
                core.log('========== SPA模式登录流程结束 ==========', 'info');
            });
        }

        function toUri(code) {
            const mode = core.getMode();
            core.log(`toUri调用，code: ${code}, 当前模式: ${mode}`, 'info');

            if (mode == 'spa') {
                loginB(code);
            } else {
                loginA(code);
            }
        }

        return { authorizeA, loginA, authorizeB, loginB, toUri };
    })(Core, UI, Network, Task);

    // 主入口
    let _ospList = null;

    function load(appKey, callback) {
        if (!appKey) { Core.log('无效的应用代码！'); return; }

        Core.initHttp();

        Core.setKey(appKey);
        Network.listOsp(function (data) { _ospList = data; if (callback) callback(data); });
    }

    function init(appKey, container, option) {
        if (!option) option = {};
        if (!option.response_type) option.response_type = 'code';

        Core.initConfig(appKey, option);

        const view = (option.view || 'list').toLowerCase();
        if (view == 'none') return;

        const root = UI.initContainer(container);
        if (!root) return;

        if (_ospList) UI.showData(_ospList, root);
        else Network.listOsp(function (data) { _ospList = data; UI.showData(data, root); });
    }

    return {
        ver: Core.version,
        core: Core,
        dom: Dom,
        network: Network,
        crypto: Crypto,
        task: Task,
        ui: UI,
        auth: Auth,
        load,
        init,
        toUri: Auth.toUri,
        loginA: Auth.loginA,
        loginB: Auth.loginB,
        authorizeA: Auth.authorizeA,
        authorizeB: Auth.authorizeB,
        runListen: Task.runListen,
        endListen: Task.stopTask,
        isRunning: Task.isRunning
    };
});