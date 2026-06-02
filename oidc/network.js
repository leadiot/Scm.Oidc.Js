/**
 * OIDC Network Module
 * 网络请求模块
 * 
 * @module oidc/network
 */
const OidcNetwork = (function(core) {
    /**
     * 发起异步请求
     * @param {Object} data 请求配置
     * @param {Function} success 成功回调
     * @param {Function} failure 失败回调
     */
    function ajax(data, success, failure) {
        if (!data) return;

        const xhr = new XMLHttpRequest();
        xhr.open(data.method, data.url, true);

        xhr.onload = function() {
            if (xhr.status < 200 || xhr.status >= 300) {
                console.error('请求失败:', xhr.statusText);
                return;
            }

            const type = data.type || 'json';
            if (type.toLowerCase() != 'json') {
                success(xhr.responseText);
                return;
            }

            const json = JSON.parse(xhr.responseText);
            success(json);
        };

        xhr.ontimeout = failure;
        xhr.onerror = failure;

        xhr.send();
    }

    /**
     * 发起GET请求
     * @param {String} url 请求地址
     * @param {Function} success 成功回调
     * @param {Function} failure 失败回调
     */
    function get(url, success, failure) {
        ajax({
            method: 'GET',
            url: url
        }, success, failure);
    }

    /**
     * 发起POST请求
     * @param {String} url 请求地址
     * @param {Object} data 请求数据
     * @param {Function} success 成功回调
     * @param {Function} failure 失败回调
     */
    function post(url, data, success, failure) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = function() {
            if (xhr.status < 200 || xhr.status >= 300) {
                console.error('请求失败:', xhr.statusText);
                return;
            }

            const json = JSON.parse(xhr.responseText);
            success(json);
        };

        xhr.ontimeout = failure;
        xhr.onerror = failure;

        xhr.send(JSON.stringify(data));
    }

    /**
     * 获取服务列表
     * @param {Function} callback 回调函数
     */
    function listOsp(callback) {
        const key = core.getKey();
        const url = core.getOAuthUrl("Osp?key=" + key);
        core.log("listOsp:" + url);

        get(url, function(result) {
            if (!result) return;
            if (callback) {
                callback(result.data);
            }
        }, function(error) {
            core.log("listOsp:" + error);
        });
    }

    /**
     * 握手请求
     * @param {Function} callback 回调函数
     */
    function handshake(callback) {
        const key = core.getKey();
        const option = core.getOption();
        let url = core.getOAuthUrl("handshake");

        let tmp = "";
        if (key) tmp += "&client_id=" + key;
        if (option.response_type) tmp += "&response_type=" + option.response_type;
        if (option.redirect_uri) tmp += "&redirect_uri=" + encodeURIComponent(option.redirect_uri);
        if (option.state) tmp += "&state=" + encodeURIComponent(option.state);
        if (option.scope) tmp += "&scope=" + encodeURIComponent(option.scope);
        const time = new Date();
        tmp += "&request_id=" + time.getTime();
        tmp += "&cipher=md5";

        if (tmp.length > 0) {
            url += "?" + tmp.substring(1);
        }
        core.log('handshake:' + url);

        get(url, function(result) {
            if (!result) return;
            if (!result.success) {
                core.log(result.message);
                return;
            }
            if (callback) {
                callback(result.ticket);
            }
        }, function(error) {
            core.log("handshake:" + error);
        });
    }

    return {
        ajax,
        get,
        post,
        listOsp,
        handshake
    };
})(typeof OidcCore !== 'undefined' ? OidcCore : require('./core'));

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OidcNetwork;
}