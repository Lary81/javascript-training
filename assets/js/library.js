var library = (function () {
    'use strict';

    var api = {
            forEach: forEach,
            filter: filter,
            map: map,
            reduce: reduce,
            on: function (element, event, callback, context) {
                element.addEventListener(event, bind(context || element, callback));
            },
            onDocumentReady: function (callback) {
                this.on(window, 'load', callback, library);
            },
            evaluate: evaluate,
            namespace: namespace,
            mix: mix
        },
        baseNamespace = {};

    function forEach(target, callback, context) {
        if (Array.prototype.forEach && target.forEach === Array.prototype.forEach) {
            target.forEach(callback, context);
        } else if (target.length === +target.length) {
            for (var index = 0, length = target.length; index < length; index++) {
                callback.call(context, target[index]);
            }
        } else {
            for (var key in target) {
                if (target.hasOwnProperty(key)) {
                    callback.call(context, target[key], key);
                }
            }
        }
    }

    function map(target, callback, context) {
        var result = [];
        if (Array.prototype.map && target.map === Array.prototype.map) {
            return target.map(callback, context);
        }
        forEach(target, function (value, index, list) {
            result.push(callback.call(context, value, index, list));
        });
        return result;
    }

    function filter(target, callback, context) {
        var result = [];
        if (Array.prototype.filter && target.filter === Array.prototype.filter) {
            return target.filter(callback, context);
        }
        forEach(target, function (value, index, list) {
            if (callback.call(context, value, index, list)) {
                result.push(value);
            }
        });
        return result;
    }

    function reduce(target, callback, accumulator, contxt) {
        var hasAccumulator = arguments.length > 2;
        if ((Array.prototype.reduce && target.reduce) === Array.prototype.reduce) {
            return hasAccumulator ? target.reduce(callback, accumulator) : target.reduce(callback);
        }
        forEach(target, function (value, index, list) {
            if (!hasAccumulator) {
                accumulator = value;
                hasAccumulator = true;
            } else {
                accumulator = callback.call(contxt, accumulator, value, index, list);
            }
        });
        return accumulator;
    }

    function namespace(path) {
        var currentNamespace = baseNamespace;
        forEach(path.split('.'), function (pathElement) {
            if (currentNamespace[pathElement] === undefined) {
                currentNamespace[pathElement] = {};
            }
            currentNamespace = currentNamespace[pathElement];
        });
        return currentNamespace;
    }

    function evaluate(template, data) {
        var result = template;
        forEach(data, function (value, key) {
            result = result.replace('{{' + key + '}}', value);
        });
        return result;
    }

    function mix(source, target) {
        forEach(source, function (value, key) {
            target[key] = source[key];
        });
        return target;
    }

    function bind(context, func) {
        return function () {
            return func.apply(context, arguments);
        }
    }

    api.extend = (function () {
        var F = function () {
        };
        return function (Base, Subtype) {
            F.prototype = Base.prototype;
            Subtype.prototype = new F();
            Subtype.prototype.constructor = Subtype;
            Subtype.parent = Subtype.prototype;
        }
    })();

    if (!window.addEventListener) {
        api.on = function (element, event, callback, context) {
            element.attachEvent('on' + event, bind(context || element, callback));
        };
    }

    return api;
})();