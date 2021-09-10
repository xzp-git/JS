(function () {
    var getProto = Object.getPrototypeOf;
    var class2type = {};
    var toString = class2type.toString;
    var hasOwn = class2type.hasOwnProperty;
    var fnToString = hasOwn.toString;
    var ObjectFunctionString = fnToString.call(Object);

    // 检测是否是一个函数
    var isFunction = function isFunction(obj) {
        return typeof obj === "function" && typeof obj.nodeType !== "number" &&
            typeof obj.item !== "function";
    };

    // 检测是否是一个window对象
    var isWindow = function isWindow(obj) {
        return obj != null && obj === obj.window;
    };

    // 标准的检测数据类型的办法
    var toType = function toType(obj) {
        if (obj == null) return obj + "";
        var reg = /^\[object ([a-zA-Z0-9]+)\]$/i;
        return typeof obj === "object" || typeof obj === "function" ?
            reg.exec(toString.call(obj))[1].toLowerCase() :
            typeof obj;
    };

    // 检测是否为数组或者类数组
    var isArrayLike = function isArrayLike(obj) {
        if (obj == null) return false;
        if (!/^(object|function)$/i.test(typeof obj)) return false;
        var length = !!obj && "length" in obj && obj.length,
            type = toType(obj);
        if (isFunction(obj) || isWindow(obj)) return false;
        return type === "array" || length === 0 ||
            typeof length === "number" && length > 0 && (length - 1) in obj;
    };

    // 检测是否为纯粹的对象「直属类是Object || Object.create(null)」
    var isPlainObject = function isPlainObject(obj) {
        var proto, Ctor;
        if (!obj || toString.call(obj) !== "[object Object]") return false;
        proto = getProto(obj);
        if (!proto) return true;
        Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
        return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
    };

    // 检测是否是空对象
    var isEmptyObject = function isEmptyObject(obj) {
        var keys = Object.keys(obj);
        if (typeof Symbol !== "undefined") keys = keys.concat(Object.getOwnPropertySymbols(obj));
        return keys.length === 0;
    };

    // 检测是否是数字
    var isNumeric = function isNumeric(obj) {
        var type = toType(obj);
        return (type === "number" || type === "string") && !isNaN(obj);
    };

    // 操作元素样式 
    const getCss = function getCss(element, attr) {
        let value = window.getComputedStyle(element)[attr],
            reg = /^\d+(px|rem|em)?$/i;
        if (reg.test(value)) {
            value = parseFloat(value);
        }
        return value;
    };
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
    const setGroupCss = function setGroupCss(element, options) {
        for (let key in options) {
            if (!options.hasOwnProperty(key)) break;
            setCss(element, key, options[key]);
        }
    };
    const css = function css(element) {
        let len = arguments.length,
            attr = arguments[1],
            value = arguments[2];
        if (len >= 3) {
            setCss(element, attr, value);
            return;
        }
        if (attr !== null && typeof attr === "object") {
            setGroupCss(element, attr);
            return;
        }
        return getCss(element, attr);
    };

    // 获取元素距离BODY的偏移量
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

    // 函数防抖处理
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

    // 函数节流处理 
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

    // 迭代数组/类数组/对象
    const each = function each(obj, callback) {
        if (typeof callback !== "function") callback = Function.prototype;
        let i = 0,
            len,
            item,
            keys,
            key;
        if (isArrayLike(obj)) {
            len = obj.length;
            for (; i < len; i++) {
                item = obj[i];
                if (callback.call(item, item, i) === false) break;
            }
        } else {
            keys = Object.keys(obj);
            if (typeof Symbol !== "undefined") keys = keys.concat(Object.getOwnPropertySymbols(obj));
            for (; i < keys.length; i++) {
                key = keys[i];
                item = obj[key];
                if (callback.call(item, item, key) === false) break;
            }
        }
        return obj;
    };

    // 数组和对象的深浅合并
    const merge = function merge() {
        let options,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false,
            treated = arguments[length - 1];
        // 第一次执行merge，最后一项是用来替换TARGET的，不是用来记录谁处理过、谁没处理过的，所以我们要为其赋值一个新数组；等到后期每次递归，我们都会在最末尾把存放哪些处理过的数组传递过来，此时最后一项这个数组才不是用来替换TARGET的!! => treated.treated有这个属性的数组是专门存放哪些处理过的
        Array.isArray(treated) && treated.treated ? length-- : (treated = [], treated.treated = true);
        // 如果第一个值是布尔，要把这个值给DEEP，让TARGET存储的第二个传递的参数(也就是第一个对象)，也就是要被替换的对象
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[i] || {};
            i++;
        }
        // 确保TARGET是个对象
        if (typeof target !== "object" && !isFunction(target)) target = {};
        // 循环除第一个传递的对象外，剩下的每个传递的对象
        for (; i < length; i++) {
            options = arguments[i];
            if (options == null) continue;
            // 之前已经处理过这个对象的，就没必要在处理了；没处理过的，加入到treated处理列表中！
            if (treated.includes(options)) return options;
            treated.push(options);
            // 循环这个对象中的每一项，用每一项的值替换TARGET中对应项的值
            each(options, function (copy, name) {
                let copyIsArray = Array.isArray(copy),
                    copyIsObject = isPlainObject(copy),
                    src = target[name],
                    clone = src;
                // 如果某一项的值是纯粹对象或者数组，并且DEEP是TURE，我们开启深度合并
                if (deep && copy && (copyIsArray || copyIsObject)) {
                    if (copyIsArray && !Array.isArray(clone)) clone = [];
                    if (copyIsObject && !isPlainObject(clone)) clone = {};
                    target[name] = merge(deep, clone, copy, treated);
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            });
        }
        return target;
    };

    // 数组和对象的深浅克隆
    const clone = function clone() {
        let target = arguments[0],
            deep = false,
            type,
            isArray,
            isObject,
            ctor,
            result,
            treated = arguments[arguments.length - 1];
        if (typeof target === "boolean") {
            if (arguments.length === 1) return target;
            deep = target;
            target = arguments[1];
        }
        // 防止死递归
        if (!Array.isArray(treated) || !treated.treated) {
            treated = [];
            treated.treated = true;
        }
        if (treated.includes(target)) return target;
        treated.push(target);
        // 特殊值的拷贝
        type = toType(target);
        isArray = isArrayLike(target);
        isObject = isPlainObject(target);
        if (target == null) return target;
        ctor = target.constructor;
        if (/^(regexp|date|error)$/i.test(type)) {
            if (type === 'error') target = target.message;
            return new ctor(target);
        }
        if (/^(function|generatorfunction)$/i.test(type)) {
            return function proxy(...params) {
                return target.call(this, ...params);
            };
        }
        if (!isArray && !isObject) return target;
        // 数组和对象的拷贝
        result = isArray ? [] : {};
        each(target, function (copy, name) {
            if (deep) {
                // 深拷贝
                result[name] = clone(deep, copy, treated);
                return;
            }
            // 浅拷贝
            result[name] = copy;
        });
        return result;
    };

    /* 暴露API */
    let utils = {
        debounce,
        throttle,
        offset,
        css,
        toType,
        isFunction,
        isWindow,
        isPlainObject,
        isArrayLike,
        isEmptyObject,
        isNumeric,
        each,
        merge,
        clone
    };
    let _$ = window.$;
    utils.noConflict = function noConflict() {
        if (window.$ === utils) window.$ = _$;
        return utils;
    };
    if (typeof window !== "undefined") window.utils = window.$ = utils;
    if (typeof module === "object" && typeof module.exports === "object") module.exports = utils;
})();