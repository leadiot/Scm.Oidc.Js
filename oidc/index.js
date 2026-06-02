/**
 * OIDC Main Module
 * OIDC主入口模块
 * 
 * @module oidc
 * @version 1.3.5
 */

// 加载子模块
(function(window) {
    // 模块加载顺序很重要
    const core = require('./core');
    const dom = require('./dom');
    const network = require('./network');
    const ui = require('./ui');
    const crypto = require('./crypto');
    const task = require('./task');
    const auth = require('./auth');

    // OSP列表缓存
    let _ospList = null;

    /**
     * 服务数据加载
     * 需要多个实例时，可以预先调用此方法
     * @param {String} appKey 应用代码
     * @param {Function} callback 回调函数
     */
    function load(appKey, callback) {
        core.log('Key:' + appKey);
        if (!appKey) {
            core.log('无效的应用代码！');
            return;
        }
        core.setKey(appKey);

        network.listOsp(function(data) {
            _ospList = data;
            if (callback) {
                callback(data);
            }
        });
    }

    /**
     * 初始化
     * @param {String} appKey 应用代码
     * @param {String} container 容器ID
     * @param {Object} option 初始化参数
     */
    function init(appKey, container, option) {
        if (!option) option = {};

        // 设置默认响应类型
        if (!option.response_type) {
            option.response_type = 'code';
        }

        // 初始化配置
        core.initConfig(appKey, option);

        // 是否显示界面
        const view = (option.view || 'list').toLowerCase();
        if (view == 'none') {
            return;
        }

        // 初始化容器
        const root = ui.initContainer(container);
        if (!root) {
            return;
        }

        // 读取数据并显示
        if (_ospList) {
            ui.showData(_ospList, root);
        } else {
            network.listOsp(function(data) {
                _ospList = data;
                ui.showData(data, root);
            });
        }
    }

    /**
     * 结束侦听
     */
    function endListen() {
        task.stopTask();
    }

    // 构建最终的 oidc 对象
    const oidc = {
        /**
         * 当前版本
         */
        ver: core.version,

        // 核心模块
        core: core,
        dom: dom,
        network: network,
        ui: ui,
        crypto: crypto,
        task: task,
        auth: auth,

        // 公共API
        load: load,
        init: init,
        toUri: auth.toUri,
        loginA: auth.loginA,
        loginB: auth.loginB,
        authorizeA: auth.authorizeA,
        authorizeB: auth.authorizeB,
        runListen: task.runListen,
        endListen: endListen,
        isRunning: task.isRunning
    };

    // 暴露到全局
    window.oidc = oidc;

    // CommonJS 导出
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = oidc;
    }
})(typeof window !== 'undefined' ? window : global);
