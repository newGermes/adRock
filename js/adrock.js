'use strict';

// Define our constructor
function adRock() {
    // Define option defaults
    var args = arguments[0] ? arguments[0] : {};
    var defaults = {
        urls: location.href,
        insertIn: false,
        insertBefore: false,
        insertAfter: false,            
        repeat: 1,
        html: '',
        css: ''
    };

    // Create options by extending defaults with the passed in arugments
    if (args && typeof args === "object") {
        this.options = Object.assign(defaults, args);
    }

};

// public methods
adRock.prototype.start = function() {
    var checkUrl = function(urls) {
            return Array.isArray(urls)
                    ? urls.indexOf(location.href) !== -1
                    : urls === location.href;
    };

    if (checkUrl(this.options.urls)) {
        
    }
};