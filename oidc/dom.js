/**
 * OIDC DOM Utility Module
 * DOM操作工具函数
 * 
 * @module oidc/dom
 */
const OidcDom = (function() {
    /**
     * 根据ID获取DOM对象
     * @param {String} id 要获取的对象的ID
     * @returns 获取的DOM对象
     */
    function $(id) {
        return document.getElementById(id);
    }

    /**
     * 根据指定HTML文本创建DOM对象，并添加到指定元素下面。
     * @param {String} tagName 标签名
     * @param {Object} parent 目标DOM元素，为空则不添加
     * @returns 新建的DOM对象
     */
    function createElement(tagName, parent) {
        const obj = document.createElement(tagName);
        if (parent && parent instanceof HTMLElement) {
            parent.appendChild(obj);
        }
        return obj;
    }

    /**
     * 为指定元素添加TEXT内容
     * @param {Object} element 目标DOM对象
     * @param {String} text 要添加的文本
     */
    function setText(element, text) {
        element.innerText = text;
    }

    /**
     * 为指定元素添加HTML内容
     * @param {Object} element 目标DOM对象
     * @param {String} html 要添加的HTML内容
     */
    function setHtml(element, html) {
        element.innerHTML = html;
    }

    /**
     * 为指定元素添加CSS属性
     * @param {Object} element 目标DOM对象
     * @param {String} propertyName CSS属性
     * @param {String} value CSS内容
     * @returns 如果没有指定value参数时，则返回CSS属性的已有值
     */
    function css(element, propertyName, value) {
        if (!(element instanceof HTMLElement)) {
            throw new Error("The first argument must be a DOM element.");
        }

        if (value !== undefined) {
            const styleName = propertyName.replace(/-(\w)/g, (match, char) => {
                return char.toUpperCase();
            });
            element.style[styleName] = value;
        } else {
            const computedStyle = window.getComputedStyle(element);
            return computedStyle.getPropertyValue(propertyName);
        }
    }

    /**
     * 为指定元素添加附加属性
     * @param {Object} element 目标DOM对象
     * @param {String} propertyName 附加属性
     * @param {String} value 附加内容
     * @returns 如果没有指定value参数时，则返回附加属性的已有值
     */
    function attr(element, propertyName, value) {
        if (!(element instanceof HTMLElement)) {
            throw new Error("The first argument must be a DOM element.");
        }

        if (value == undefined) {
            return element.getAttribute(propertyName);
        }

        element.setAttribute(propertyName, value);
    }

    /**
     * 判断是否含有某个class
     * @param {Object} element 目标DOM对象
     * @param {String} className class名称
     * @returns 布尔，是否包含
     */
    function hasClass(element, className) {
        const reg = new RegExp("(^|\\s)" + className + "(\\s|$)");
        return reg.test(element.className);
    }

    /**
     * 为指定元素添加class
     * @param {Object} element 目标DOM对象
     * @param {String} className class名称，多个class以空格隔开
     */
    function addClass(element, className) {
        const ary = className.replace(/(^ +| +$)/g, "").split(/ +/g);
        for (let i = 0; i < ary.length; i++) {
            const curClass = ary[i];
            if (!hasClass(element, curClass)) {
                element.className += " " + curClass;
            }
        }
    }

    /**
     * 为指定元素移除class
     * @param {Object} element 目标DOM对象
     * @param {String} className class名称，多个class以空格隔开
     */
    function removeClass(element, className) {
        const ary = className.replace(/(^ +| +$)/g, "").split(/ +/g);
        for (let i = 0; i < ary.length; i++) {
            const curClass = ary[i];
            if (hasClass(element, curClass)) {
                const reg = new RegExp("(^| +)" + curClass + "( +|$)", "g");
                element.className = element.className.replace(reg, " ").trim();
            }
        }
    }

    return {
        $,
        createElement,
        setText,
        setHtml,
        css,
        attr,
        hasClass,
        addClass,
        removeClass
    };
})();

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OidcDom;
}