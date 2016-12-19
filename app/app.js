library.onDocumentReady(function () {
    'use strict';

    var ajax = this.namespace('pl.library.ajax'),
        cardTemplate = '',
        cardsElement = document.querySelector("#cards");

    function showContacts(contacts) {
        var cards = '';

        library.forEach(contacts, function (contact) {
            cards += library.evaluate(cardTemplate, contact);
        });
        cardsElement.innerHTML = cards;
    }

    ajax.request({
        url:'assets/templates/card.html',
        type: 'text',
        onSuccess: function (template) {
            cardTemplate = template;
            ajax.request({
                url: 'http://213.32.66.195:3000/contacts',
                onSuccess: showContacts
            });
        }
    });


});