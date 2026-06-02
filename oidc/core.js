/**
 * OIDC Core Module
 * 核心配置和基础工具函数
 * 
 * @module oidc/core
 */
const OidcCore = (function() {
    // OIDC版本
    const _ver = '1.3.5';
    // OIDC前缀
    const _pre = "_oidc_";
    // OIDC名称
    const _name = "OIDC";
    // OIDC网址，不需要http://前缀
    const _site = 'www.oidc.org.cn';
    // 基本路径
    let _base = '';

    // OIDC应用KEY
    let _key = '';
    // OIDC调用模式
    let _mode = 'web';
    // OIDC初始化选项
    let _option = {};
    // 是否输出日志
    let _log = false;
    // 打开方式
    let _target = 'none';

    /**
     * 输出日志
     * @param {String} txt 日志内容  
     */
    function log(txt) {
        if (!_log) return;
        console.log('[OIDC]' + txt);
    }

    /**
     * 获取基础URL
     */
    function getBaseUrl() {
        return _base;
    }

    /**
     * 设置基础URL
     */
    function setBaseUrl(base) {
        _base = base;
    }

    /**
     * 获取应用Key
     */
    function getKey() {
        return _key;
    }

    /**
     * 设置应用Key
     */
    function setKey(key) {
        _key = key;
    }

    /**
     * 获取模式
     */
    function getMode() {
        return _mode;
    }

    /**
     * 设置模式
     */
    function setMode(mode) {
        _mode = mode;
    }

    /**
     * 获取选项
     */
    function getOption() {
        return _option;
    }

    /**
     * 设置选项
     */
    function setOption(option) {
        _option = option;
        _log = !!option.log;
    }

    /**
     * 获取打开方式
     */
    function getTarget() {
        return _target;
    }

    /**
     * 设置打开方式
     */
    function setTarget(target) {
        _target = target;
    }

    /**
     * 获取OAuth路径
     */
    function getOAuthUrl(url) {
        return _base + "/OAuth/" + url;
    }

    /**
     * 初始化基础配置
     */
    function initConfig(appKey, option) {
        _key = appKey;
        
        if (!option) option = {};
        _option = option;
        _log = !!option.log;

        // 启用https
        const https = (!option.https) ? '' : 's';
        _base = `http${https}://` + _site;
        log('url:' + _base);

        // 应用类型
        _mode = (option.mode || 'web').toLowerCase();
        log('mode:' + _mode);

        // 打开方式
        _target = option.target || 'link';
        log('target:' + _target);
    }

    return {
        version: _ver,
        prefix: _pre,
        name: _name,
        site: _site,
        
        log,
        getBaseUrl,
        setBaseUrl,
        getKey,
        setKey,
        getMode,
        setMode,
        getOption,
        setOption,
        getTarget,
        setTarget,
        getOAuthUrl,
        initConfig
    };
})();

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OidcCore;
}