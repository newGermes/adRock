'use strict';

// Define our constructor
function adRock() {
    // Define option defaults
    var args = arguments[0] ? arguments[0] : {};
    var defaults = {
        urls: location.href,
        insertAfter: 'div',            
        datePoint: '02-09-2020 00:45', //hours
        html: '<h1>This is advertising!</h1>',
        css: 'h1 {text-align: center;}'
    };

    // Create options by extending defaults with the passed in arugments
    if (args && typeof args === "object") {
        this.options = Object.assign(defaults, args);
    }

};

// public methods
adRock.prototype.start = function() {
    var checkUrl = function (urls) {
        var url = document.createElement('a');
        var arrUrls = new Array(urls).join().split(',');
        // var urlEtalon = Object.create({pathname: '/novosti/'});
        var urlEtalon = location.pathname;
        var urlEtlSplit = urlEtalon.pathname.split('/');
        var lastUrlEtlSplitElm = urlEtlSplit[urlEtlSplit.length - 1];
        var prevUrlEtlSplitElm = urlEtlSplit[urlEtlSplit.length - 2];

        var arrUrlsPath = arrUrls.map(function(href) {
            url.href = href;

            var urlSplit = url.pathname.split('/');
            var lastSplitElm = urlSplit[urlSplit.length - 1];
            var prevSplitElm = urlSplit[urlSplit.length - 2];
            var flagOne = !prevUrlEtlSplitElm.toLowerCase()
                                .localeCompare(prevSplitElm.toLowerCase());
            var flagTwo = false;

            if (lastSplitElm === lastUrlEtlSplitElm) {
                flagTwo = true;
            } else if (!lastSplitElm.search('.') && !lastUrlEtlSplitElm.search('.')) {
                flagTwo = true;
            } else {
                flagTwo = false;
            }
            

            return flagOne && flagTwo;
        }).filter(function(elm) {
            return elm;
        }).join();

        

        return arrUrlsPath;
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
        document.head.append(style);
    };
    var timer = function (time) {
        var dates = time.split(' ')[0];
        var hours = time.split(' ')[1];

        var date = dates.split('-')[0];
        var month = dates.split('-')[1] - 1;
        var year = dates.split('-')[2];

        var hour = hours.split(':')[0];
        var minutes = hours.split(':')[1];

        var dateTempl = new Date(year, month, date, hour, minutes);

        return dateTempl.getTime() > Date.now();
    };

    if (timer(this.options.datePoint) && !!checkUrl(this.options.urls)) {
        // insert CSS
        insertCss(this.options.css);
        // insert HTML
        insertHtml(getElm(this.options.insertAfter), this.options.html);
    }
};