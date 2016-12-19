if (library == undefined) {
    throw 'Core module not found';
}

(function ($) {
    'use strict';

    var ajax = $.namespace('pl.library.ajax');

    function doNothing() {
    }

    function prepareSettings(config) {
        return $.mix(config, {
            method: 'GET',
            url: '',
            data: {},
            onSuccess: doNothing,
            onError: doNothing,
            type: 'json'
        });
    }

    ajax.request = function (config) {
        var settings = prepareSettings(config),
            xhr = new XMLHttpRequest(),
            response = '';

        xhr.open(settings.method, settings.url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status > 199 && xhr.status < 300) {
                    response = xhr.responseText;
                    settings.onSuccess(settings.type === 'json' ? JSON.parse(response) : response, xhr);
                } else {
                    settings.onError(xhr);
                }
            }
        }
        xhr.send(settings.data);
    };

})(library);