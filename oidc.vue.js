/**
 * OIDC Vue 集成模块
 *
 * Date: 2025-11-22
 * Version: 1.3.4
 *
 * 说明：
 * 此文件提供 OIDC 与 Vue 2/3 的集成支持
 * 使用前需先引入 oidc.js
 */
;(function (window) {
    'use strict';

    if (typeof oidc === 'undefined') {
        console.error('[OIDC] 请先引入 oidc.js');
        return;
    }

    var VuePlugin = {
        /**
         * 获取Vue组件定义
         * @param {Object} vue Vue实例（Vue 2或Vue 3）
         * @returns {Object} Vue组件选项对象
         */
        getVueComponent: function (vue) {
            var self = oidc;
            return {
                name: 'OidcLogin',
                props: {
                    appKey: {
                        type: String,
                        required: true
                    },
                    mode: {
                        type: String,
                        default: 'web'
                    },
                    view: {
                        type: String,
                        default: 'list'
                    },
                    style: {
                        type: String,
                        default: 'item'
                    },
                    target: {
                        type: String,
                        default: 'link'
                    },
                    https: {
                        type: Boolean,
                        default: false
                    },
                    showCard: {
                        type: Boolean,
                        default: true
                    },
                    showHead: {
                        type: Boolean,
                        default: false
                    },
                    headHtml: {
                        type: String,
                        default: ''
                    },
                    showFoot: {
                        type: Boolean,
                        default: false
                    },
                    footHtml: {
                        type: String,
                        default: ''
                    },
                    align: {
                        type: String,
                        default: 'start'
                    },
                    columns: {
                        type: Number,
                        default: 1
                    },
                    responseType: {
                        type: String,
                        default: 'code'
                    },
                    redirectUri: {
                        type: String,
                        default: ''
                    },
                    state: {
                        type: String,
                        default: ''
                    },
                    scope: {
                        type: String,
                        default: ''
                    }
                },
                data: function () {
                    return {
                        ospList: [],
                        loading: false,
                        error: null
                    };
                },
                computed: {
                    containerId: function () {
                        return 'oidc-vue-' + this._uid;
                    }
                },
                mounted: function () {
                    var _this = this;
                    this.loading = true;

                    var option = {
                        mode: this.mode,
                        view: this.view,
                        style: this.style,
                        target: this.target,
                        https: this.https,
                        showCard: this.showCard,
                        showHead: this.showHead,
                        headHtml: this.headHtml,
                        showFoot: this.showFoot,
                        footHtml: this.footHtml,
                        align: this.align,
                        columns: this.columns,
                        response_type: this.responseType,
                        redirect_uri: this.redirectUri,
                        state: this.state,
                        scope: this.scope,
                        success: function (user) {
                            _this.$emit('success', user);
                        },
                        error: function (err) {
                            _this.error = err;
                            _this.$emit('error', err);
                        }
                    };

                    self.init(this.appKey, this.containerId, option);
                    self.load(this.appKey, function (list) {
                        _this.ospList = list || [];
                        _this.loading = false;
                    });
                },
                beforeUnmount: function () {
                    if (self.isRunning()) {
                        self.endListen();
                    }
                },
                template: '<div :id="containerId" class="oidc-vue-container">' +
                    '<div v-if="loading" class="oidc-loading">加载中...</div>' +
                    '<div v-else-if="error" class="oidc-error">{{ error }}</div>' +
                    '</div>'
            };
        },

        /**
         * 创建Vue 3组合式API函数
         * @returns {Object} 组合式API对象
         */
        useVue: function () {
            var self = oidc;
            var ospList = Vue.ref([]);
            var loading = Vue.ref(false);
            var error = Vue.ref(null);
            var initialized = Vue.ref(false);

            var init = function (appKey, option) {
                if (initialized.value) {
                    return;
                }

                loading.value = true;

                self.init(appKey, 'oidc-vue-composition', option || {});

                self.load(appKey, function (list) {
                    ospList.value = list || [];
                    loading.value = false;
                    initialized.value = true;
                });
            };

            var login = function (code) {
                if (!initialized.value) {
                    console.warn('[OIDC] 未初始化，请先调用init方法');
                    return;
                }
                self.toUri(code);
            };

            var loginA = function (code) {
                if (!initialized.value) {
                    console.warn('[OIDC] 未初始化，请先调用init方法');
                    return;
                }
                self.loginA(code);
            };

            var loginB = function (code) {
                if (!initialized.value) {
                    console.warn('[OIDC] 未初始化，请先调用init方法');
                    return;
                }
                self.loginB(code);
            };

            var dispose = function () {
                if (self.isRunning()) {
                    self.endListen();
                }
                initialized.value = false;
            };

            return {
                ospList: ospList,
                loading: loading,
                error: error,
                initialized: initialized,
                init: init,
                login: login,
                loginA: loginA,
                loginB: loginB,
                dispose: dispose,
                toUri: self.toUri,
                version: self.ver
            };
        },

        /**
         * Vue插件安装方法
         * @param {Object} app Vue应用实例
         * @param {Object} options 插件选项
         */
        install: function (app, options) {
            var self = oidc;
            var globalOptions = options || {};

            if (app.version && app.version.startsWith('2.')) {
                app.component('oidc-login', self.getVueComponent(app));
                app.prototype.$oidc = oidc;
            } else {
                app.component('OidcLogin', self.getVueComponent(app));
                app.config.globalProperties.$oidc = oidc;
                app.provide('oidc', oidc);
            }

            if (globalOptions.appKey) {
                self.init(globalOptions.appKey, 'oidc-global', globalOptions);
            }
        },

        /**
         * 创建Vue应用实例
         * @param {Object} Vue Vue构造函数
         * @param {Object} option 配置选项
         * @returns {Object} Vue应用实例
         */
        createVueApp: function (Vue, option) {
            var self = oidc;
            var appKey = option.appKey;
            var containerId = option.containerId || 'oidc-app';

            var app = Vue.createApp({
                setup: function () {
                    var oidcApi = self.useVue();

                    Vue.onMounted(function () {
                        oidcApi.init(appKey, option);
                    });

                    Vue.onUnmounted(function () {
                        oidcApi.dispose();
                    });

                    return {
                        oidc: oidcApi
                    };
                },
                template: '<div :id="containerId"></div>'
            });

            app.use(self, option);

            return app;
        }
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = VuePlugin;
    } else {
        window.oidcVue = VuePlugin;
    }

    if (typeof Vue !== 'undefined') {
        if (Vue.version && Vue.version.startsWith('2.')) {
            Vue.use(VuePlugin);
        }
    }

})(window);