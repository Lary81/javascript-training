var library = (function () {
    'use strict';

    var api = {
            forEach: each,
            filter: filter,
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

    function each(arr, callback) {
        for (var index = 0; index < arr.length; index++) {
            callback(arr[index], index);
        }
    }

    function filter(arr, predicate) {
        var result = [];

        each(arr, function (element, index) {
            if (predicate(element)) {
                result.push(element);
            }
        });
        return result;
    }

    function namespace(path) {
        var currentNamespace = baseNamespace;

        each(path.split('.'), function (pathElement) {
            if (currentNamespace[pathElement] === undefined) {
                currentNamespace[pathElement] = {};
            }
            currentNamespace = currentNamespace[pathElement];
        });
        return currentNamespace;
    }

    function evaluate(template, data) {
        var result = template;

        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                result = result.replace('{{' + key + '}}', data[key]);
            }
        }
        return result;
    }

    function mix(source, target) {
        for(var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
        return target;
    }

    function bind(context, func) {
        return function () {
            return func.apply(context, arguments);
        }
    }

    api.extend = (function () {
        var F = function () {};
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