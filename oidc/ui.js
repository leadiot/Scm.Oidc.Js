/**
 * OIDC UI Module
 * UI渲染和对话框模块
 * 
 * @module oidc/ui
 */
const OidcUI = (function(core, dom) {
    // 根对象
    let _root;
    // 对话框
    let _dialog;
    // 内置帧
    let _iframe;

    let isDragging = false;
    let currentX = 0;
    let currentY = 0;
    let initialX = 0;
    let initialY = 0;

    /**
     * 判断是否为"显示更多"功能
     * @param {String} code Osp代码
     */
    function isMore(code) {
        code = code.toLowerCase();
        return code == 'oidc' || code == 'more';
    }

    /**
     * 获取服务徽标路径
     */
    function getLogo(icon) {
        return core.getBaseUrl() + '/data/logo/osp/' + icon;
    }

    /**
     * 显示列表模式
     */
    function asList(oidc_list) {
        let text = "";
        for (let i = 0; i < oidc_list.length; i++) {
            const item = oidc_list[i];
            const tips = !isMore(item.code) ? '使用 ' + item.name + ' 登录' : '显示更多';
            text += '<div class="oidc-list-item" title="' + tips + '" onclick="oidc.toUri(\'' + item.code + '\')">';
            text += '<span class="logo"><img src="' + getLogo(item.icon) + '" alt="' + item.code + '" /></span>';
            text += '<span class="line"></span>';
            text += '<span class="text">' + item.name + '</span>';
            text += '</div>';
        }
        return text;
    }

    /**
     * 显示图标模式
     */
    function asIcon(oidc_list) {
        let text = "";
        for (let i = 0; i < oidc_list.length; i++) {
            const item = oidc_list[i];
            const tips = !isMore(item.code) ? '使用 ' + item.name + ' 登录' : '显示更多';
            text += '<div class="oidc-list-icon" title="' + tips + '" onclick="oidc.toUri(\'' + item.code + '\')">';
            text += '<span class="logo"><img src="' + getLogo(item.icon) + '" alt="' + item.code + '" /></span>';
            text += '</div>';
        }
        return text;
    }

    /**
     * 显示卡片模式
     */
    function asCard(oidc_list) {
        let text = "";
        for (let i = 0; i < oidc_list.length; i++) {
            const item = oidc_list[i];
            const tips = !isMore(item.code) ? '使用 ' + item.name + ' 登录' : '显示更多';
            text += '<div class="oidc-list-card" title="' + tips + '" onclick="oidc.toUri(\'' + item.code + '\')">';
            text += '<div class="logo"><img src="' + getLogo(item.icon) + '" alt="' + item.code + '" /></div>';
            text += '<div class="text">' + item.name + '</div>';
            text += '</div>';
        }
        return text;
    }

    /**
     * 打开新的标签页
     */
    function showTab(url) {
        window.open(url, '_blank');
    }

    /**
     * 打开新的窗口
     */
    function showWindow(url) {
        const width = 600;
        const height = 400;
        const left = (window.screen.availWidth - width) / 2;
        const top = (window.screen.availHeight - height) / 2;
        const features = `width=${width},height=${height},left=${left},top=${top},resizable=no`;
        window.open(url, 'oidc', features);
    }

    /**
     * 打开新的对话框
     */
    function showDialog(url) {
        if (_dialog) {
            dom.css(_dialog, 'display', 'block');
            dom.attr(_iframe, 'src', url);
            return;
        }

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

    /**
     * 隐藏对话框
     */
    function hideDialog() {
        dom.css(_dialog, 'display', 'none');
    }

    /**
     * 居中对话框
     */
    function centerDialog(dialog) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        dialog.style.left = `${(viewportWidth - dialog.offsetWidth) / 2}px`;
        dialog.style.top = `${(viewportHeight - dialog.offsetHeight) / 2}px`;
    }

    /**
     * 开始拖动
     */
    function startDrag(e) {
        isDragging = true;
        initialX = e.clientX - _dialog.offsetLeft;
        initialY = e.clientY - _dialog.offsetTop;
    }

    /**
     * 中止拖动
     */
    function stopDrag() {
        isDragging = false;
    }

    /**
     * 移动对话框
     */
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

    /**
     * 显示数据
     * @param {Array} oidc_list OSP列表
     * @param {Object} div 容器元素
     */
    function showData(oidc_list, div) {
        const option = core.getOption();
        let showCard = option.showCard;
        if (showCard == undefined) showCard = true;

        let oidcDiv = div;
        if (showCard) {
            const oidcCard = dom.createElement("div", div);
            dom.addClass(oidcCard, "oidc-card");
            oidcDiv = oidcCard;
        }

        const showHead = !!option.showHead;
        if (showCard && showHead) {
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
        core.log('style:' + style);

        let text = '';
        if (style == 'icon') {
            dom.addClass(oidcList, 'oidc-data-icon');
            dom.css(oidcList, 'justify-content', option.align || 'start');
            text = asIcon(oidc_list);
        } else if (style == 'card') {
            dom.addClass(oidcList, 'oidc-data-card');
            const cols = option.columns || 1;
            if (cols > 1) {
                dom.css(oidcList, "grid-template-columns", `repeat(${cols}, ${100 / cols}%)`);
            }
            text = asCard(oidc_list);
        } else {
            dom.addClass(oidcList, 'oidc-data-item');
            text = asList(oidc_list);
        }
        dom.setHtml(oidcList, text);

        const showFoot = !!option.showFoot;
        if (showCard && showFoot) {
            const oidcFoot = dom.createElement("div", oidcDiv);
            dom.addClass(oidcFoot, "oidc-card_foot");
            dom.setHtml(oidcFoot, option.footHtml);
        }
    }

    /**
     * 初始化UI容器
     * @param {String} containerId 容器ID
     */
    function initContainer(containerId) {
        if (!containerId) containerId = "oidc";
        _root = dom.$(containerId);
        if (!_root) {
            core.log('找不到容器标签！');
            return null;
        }
        dom.addClass(_root, "oidc");
        return _root;
    }

    return {
        isMore,
        getLogo,
        asList,
        asIcon,
        asCard,
        showTab,
        showWindow,
        showDialog,
        hideDialog,
        showData,
        initContainer
    };
})(
    typeof OidcCore !== 'undefined' ? OidcCore : require('./core'),
    typeof OidcDom !== 'undefined' ? OidcDom : require('./dom')
);

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OidcUI;
}