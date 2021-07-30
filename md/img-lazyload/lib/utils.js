(function () {
    /*
     * 获取元素样式 
     */
    const getCss = function getCss(element, attr) {
        let value = window.getComputedStyle(element)[attr],
            reg = /^\d+(px|rem|em)?$/i;
        if (reg.test(value)) {
            value = parseFloat(value);
        }
        return value;
    };

    /*
     * 设置元素样式 
     */
    const setCss = function setCss(element, attr, value) {
        if (attr === "opacity") {
            element['style']['opacity'] = value;
            element['style']['filter'] = `alpha(opacity=${value*100})`;
            return;
        }
        let reg = /^(width|height|margin|padding)?(top|left|bottom|right)?$/i;
        if (reg.test(attr)) {
            if (!isNaN(value)) {
                value += 'px';
            }
        }
        element['style'][attr] = value;
    };

    /* 
     * 批量设置元素样式 
     */
    const setGroupCss = function setGroupCss(element, options) {
        for (let key in options) {
            if (!options.hasOwnProperty(key)) break;
            setCss(element, key, options[key]);
        }
    };

    /* 
     * 样式的综合处理 
     */
    const css = function css(element) {
        let len = arguments.length,
            attr = arguments[1],
            value = arguments[2];
        if (len >= 3) {
            // 单一设置样式
            setCss(element, attr, value);
            return;
        }
        if (attr !== null && typeof attr === "object") {
            // 批量设置
            setGroupCss(element, attr);
            return;
        }
        // 获取样式
        return getCss(element, attr);
    };

    /*
     * 获取元素距离BODY的偏移量 
     */
    const offset = function offset(element) {
        let parent = element.offsetParent,
            top = element.offsetTop,
            left = element.offsetLeft;
        while (parent) {
            if (!/MSIE 8/.test(navigator.userAgent)) {
                left += parent.clientLeft;
                top += parent.clientTop;
            }
            left += parent.offsetLeft;
            top += parent.offsetTop;
            parent = parent.offsetParent;
        }
        return {
            top,
            left
        };
    };

    /*
     * 简单的AJAX获取数据 
     */
    const ajax = function ajax(url) {
        return new Promise(resolve => {
            let xhr = new XMLHttpRequest;
            xhr.open('get', url);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                }
            };
            xhr.send();
        });
    };

    /*
     * 函数防抖处理
     */
    const debounce = function debounce(func, wait, immediate) {
        if (typeof func !== "function") throw new TypeError('func must be an function');
        if (typeof wait === "boolean") {
            immediate = wait;
            wait = 300;
        }
        if (typeof wait !== "number") wait = 300;
        if (typeof immediate !== "boolean") immediate = false;
        let timer;
        return function proxy(...params) {
            let runNow = !timer && immediate,
                self = this,
                result;
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            timer = setTimeout(() => {
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
                if (!immediate) result = func.call(self, ...params);
            }, wait);
            if (runNow) result = func.call(self, ...params);
            return result;
        };
    };

    /*
     * 函数节流处理 
     */
    const throttle = function throttle(func, wait) {
        if (typeof func !== "function") throw new TypeError('func must be an function');
        if (typeof wait !== "number") wait = 300;
        let timer,
            previous = 0;
        return function proxy(...params) {
            let now = +new Date(),
                remaining = wait - (now - previous),
                self = this,
                result;
            if (remaining <= 0) {
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
                result = func.call(self, ...params);
                previous = now;
            } else if (!timer) {
                timer = setTimeout(() => {
                    if (timer) {
                        clearTimeout(timer);
                        timer = null;
                    }
                    result = func.call(self, ...params);
                    previous = +new Date();
                }, remaining);
            }
            return result;
        };
    };

    /* 暴露API */
    let utils = {
        debounce,
        throttle,
        ajax,
        offset,
        css
    };
    let _$ = window.$;
    utils.noConflict = function noConflict() {
        if (window.$ === utils) window.$ = _$;
        return utils;
    };
    if (typeof window !== "undefined") window.utils = window.$ = utils;
    if (typeof module === "object" && typeof module.exports === "object") module.exports = utils;
})();