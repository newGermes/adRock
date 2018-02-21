'use strict';

// Define our constructor
function adRock() {
    // Define option defaults
    var args = arguments[0] ? arguments[0] : {};
    var defaults = {
        urls: location.href,
        insertAfter: 'body',            
        repeat: 1, //hours
        html: '<h1>This is advertising!</h1>',
        css: 'h1 {align: left;}'
    };

    // Create options by extending defaults with the passed in arugments
    if (args && typeof args === "object") {
        this.options = Object.assign(defaults, args);
    }

};

// public methods
adRock.prototype.start = function() {
    var checkUrl = function(urls) { // rewrite
            return Array.isArray(urls)
                    ? urls.indexOf(location.href) !== -1
                    : urls === location.href;
    };
    var getElm = function (selector) {
        return selector.indexOf(':') !== -1
                ? document.querySelectorAll(selector.split(':')[0])[selector.split(':')[1]]
                : document.querySelector(selector);
    };
    var insertHtml = function (after, html) {
        after.insertAdjacentHTML('afterend', html);
      };
    var insertCss = function(css) {
        var style = document.createElement('style');
        style.innerText = css;
        document.querySelector('html').append(style);
    };
    var timer = function (time) {

    };

    if (checkUrl(this.options.urls)) {
        // insert CSS
        insertCss(this.options.css);
        // insert HTML
        insertHtml(getElm(this.options.insertAfter), this.options.html);
    }
};