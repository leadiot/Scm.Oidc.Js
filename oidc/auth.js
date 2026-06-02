/**
 * OIDC Auth Module
 * 认证登录模块
 * 
 * @module oidc/auth
 */
const OidcAuth = (function(core, ui, network, task) {
    /**
     * 构建URL参数
     */
    function buildParams() {
        const key = core.getKey();
        const option = core.getOption();
        let tmp = "";
        
        if (key) tmp += "&client_id=" + key;
        if (option.response_type) tmp += "&response_type=" + option.response_type;
        if (option.redirect_uri) tmp += "&redirect_uri=" + encodeURIComponent(option.redirect_uri);
        if (option.state) tmp += "&state=" + encodeURIComponent(option.state);
        if (option.scope) tmp += "&scope=" + encodeURIComponent(option.scope);
        
        return tmp;
    }

    /**
     * 根据code获取URL路径
     */
    function getUrlPath(code) {
        code = code.toLowerCase();
        let url = core.getBaseUrl() + "/oauth";
        
        if (ui.isMore(code)) {
            url += "/index";
        } else if (code == "phone") {
            url += "/phone";
        } else if (code == "email") {
            url += "/email";
        } else {
            url += "/authorizeA/" + code;
        }
        
        return url;
    }

    /**
     * 根据code获取登录URL路径
     */
    function getLoginUrlPath(code) {
        code = code.toLowerCase();
        let url = core.getBaseUrl() + "/oauth";
        
        if (ui.isMore(code)) {
            url += "/index";
        } else if (code == "phone") {
            url += "/phone";
        } else if (code == "email") {
            url += "/email";
        } else {
            url += "/LoginA/" + code;
        }
        
        return url;
    }

    /**
     * 根据目标类型打开URL
     */
    function openUrl(url) {
        const target = core.getTarget();
        
        if (target == 'none') return;
        if (target == 'dialog') {
            ui.showDialog(url);
            return;
        }
        if (target == 'tab' || target == '_blank') {
            ui.showTab(url);
            return;
        }
        if (target == 'window') {
            ui.showWindow(url);
            return;
        }
        
        // link - 默认方式
        window.location.href = url;
    }

    /**
     * Web模式，引导登录
     */
    function authorizeA(code) {
        let url = getUrlPath(code);
        const params = buildParams();
        
        if (params.length > 0) {
            url += "?" + params.substring(1);
        }
        core.log('authorizeA:' + url);
        
        openUrl(url);
    }

    /**
     * Web模式，执行登录
     */
    function loginA(code) {
        let url = getLoginUrlPath(code);
        const params = buildParams();
        
        if (params.length > 0) {
            url += "?" + params.substring(1);
        }
        core.log('loginA:' + url);
        
        openUrl(url);
    }

    /**
     * Spa模式，引导登录
     */
    function authorizeB() {
        network.handshake((ticket) => {
            if (!ticket) return;
            
            const url = core.getOAuthUrl("authorizeB?ticket=" + ticket.code);
            core.log('authorizeB:' + url);
            window.open(url, "_blank");
            
            task.runListen(ticket);
        });
    }

    /**
     * Spa模式，执行登录
     * @param {String} code Osp代码
     */
    function loginB(code) {
        network.handshake((ticket) => {
            if (!ticket) return;
            
            const url = core.getOAuthUrl(`LoginB/${code}?ticket=${ticket.code}`);
            core.log('loginB:' + url);
            window.open(url, "_blank");
            
            task.runListen(ticket);
        });
    }

    /**
     * 根据模式跳转登录
     * @param {String} code Osp代码
     */
    function toUri(code) {
        const mode = core.getMode();
        
        if (mode == 'spa') {
            loginB(code);
        } else {
            loginA(code);
        }
    }

    return {
        authorizeA,
        loginA,
        authorizeB,
        loginB,
        toUri
    };
})(
    typeof OidcCore !== 'undefined' ? OidcCore : require('./core'),
    typeof OidcUI !== 'undefined' ? OidcUI : require('./ui'),
    typeof OidcNetwork !== 'undefined' ? OidcNetwork : require('./network'),
    typeof OidcTask !== 'undefined' ? OidcTask : require('./task')
);

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OidcAuth;
}