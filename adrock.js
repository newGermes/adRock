'use strict';
(function (w) {
    // Define our constructor
    w.adRock = function() {
        // Define option defaults
        var defaults = {
            urls: location.href, /**['http://example.com', 
                                'https://example.com/cat',
                                'https://example.com/cat/*.*'],
                                'https://example.com/cat/some.html' */
            exceptUrl: [],/** ['https://example.com', 'example01.com] */
            keyMatching: {
                strict: [], /**['leg', 'nose' ]*/
                floating: [] /** ['great intelligence'] */
            },
            counters:{
                'example.com': '666666'
            }, //host
            insertElement: 'div', /** #id, .class:(0,1,2,3,4) */
            insertPosition: 'afterbegin', /** beforebegin, afterbegin, 
                                                beforeend, afterend*/        
            datePoint: '02-09-2020 00:45', /** 'DD-MM-YYYY hh:mm' */
            wrapperClass:'counter', /** only class */
            html: '<h1>This is advertising!</h1>', /** insert serialized HTML */
            css: 'h1 {text-align: center;}' /** insert style tag with css */
        };

        // Create options by extending defaults with the passed in arugments
        if (arguments[0] && typeof arguments[0] === "object") {
            this.options = Object.assign(defaults, arguments[0]);
        }
    };

    // state of instances
    w.adRock.stateInstances = [];

    // define runner
    w.adRock.runner = function(instances) {
        var indexArr = [];
        var customIndexArr = [];
        var instancesObj = {};

        w.adRock.stateInstances.push(
            ...instances.map(function(instance) {
                return {
                    id: instance.options.insertElement.trim()
                        + instance.options.insertPosition.trim(),
                    position: instance.options.insertPosition.trim(),
                    instanceFlag: instance.start(),
                    instance
                };
            })
        );


        instancesObj = w.adRock.stateInstances.reduce(function(obj, item) {
            obj[item.id] = obj[item.id] || [];
            item.instanceFlag ? obj[item.id].push(item) : false;
            return obj; 
        }, {});
        
        customIndexArr = Object.keys(instancesObj).map(function(elm) {
            return instancesObj[elm].length > 1 ? instancesObj[elm] : false;
        }).filter(function(elm) {
            return elm;
        });

        // stop all instance except the last
        customIndexArr.forEach(function(arrElm) {
            for (var i = 0; i < arrElm.length - 1; i++) {
                var elm = arrElm[i];
                elm.instance.stop(elm.position);
            }
        });
        
    };

    /** Private methods */
    // check keywords
    var checkKeywords = function(obj) {
        var metaKeywords = document.querySelector('meta[name=keywords]');
        var flagMeta = metaKeywords ? metaKeywords.content.length > 0 : null;
        var isEmty = (obj.strict.length || obj.floating.length);
        var flag = true;

        var checkStrict = function(str, strOpt, arr) {
            str.split(' ').forEach(function(word) {
                word = word.trim().toLowerCase();
                strOpt.forEach(function(wordStrict) {
                    wordStrict = wordStrict.trim().toLowerCase();
                    !word.localeCompare(wordStrict)
                        ? arr.push('true') 
                        : arr.push('false');
                });
            });
        };
        var checkFloating = function(str, strOpt, arr) {
            strOpt.forEach(function(wordFloating) {
                wordFloating = wordFloating.trim().toLowerCase();
                !wordFloating.localeCompare(str.trim().toLowerCase())
                    ? arr.push('true')
                    : arr.push('false');
            });
        };

        if (isEmty && flagMeta) {
            var checkComa = metaKeywords.content.indexOf(',');
            var strictWords = obj.strict;
            var floatingWords = obj.floating;
            var stateArr = [];
        
            //check existence of comma in keywords
            if (checkComa === -1) {
                // check strict words
                checkStrict(metaKeywords.content, strictWords, stateArr);
                // check floating words
                checkFloating(metaKeywords.content, floatingWords, stateArr);
            } else {
                metaKeywords.content.split(',').forEach(function(wordAfterSplit) {
                    wordAfterSplit = wordAfterSplit.trim().toLowerCase();
                    
                    // check strict words
                    checkStrict(wordAfterSplit, strictWords, stateArr);
                    // check floating words
                    checkFloating(wordAfterSplit, floatingWords, stateArr);
                });
            }
            flag = stateArr.indexOf('true') !== -1;
        }
        return flag;
    };

    // except urls
    var checkExceptUrl = function(exceptUrl) {
        var host = location.host;
        var flag = false;

        if (exceptUrl.length > 0) {
            flag = !!exceptUrl.map(function(elm) {
                return elm.indexOf(host) === -1 ? false : true;
            }).filter(function(elm) {
                return elm;
            }).join();
        }

        return !flag;
    };

    // chek URLS
    var checkUrl = function (urls) {
        // convert all urls paramets to Array
        var arrUrls = new Array(urls).join().split(',');
        var flagRootURL = (function(urls) {
            var host = new RegExp(location.host);
            var arrBoolean = urls.filter(function(elm) {
                return host.test(elm);
            });
            
            return !!arrBoolean.join();
        }(arrUrls));

        // get pathname from browser for compare
        // var urlEtalon = '/metody-lecheniya/test.html'; // for testing
        var urlEtalon = location.pathname;

        // separate url form browser with '/'
        var urlEtlSplit = urlEtalon.split('/');
        var lastUrlEtlSplitElm = urlEtlSplit[urlEtlSplit.length - 1];
        var prevUrlEtlSplitElm = urlEtlSplit[urlEtlSplit.length - 2];

        // create API for string urls
        var url = document.createElement('a');
        function arrUrlsPath () {
            return arrUrls.map(function(href) {
                url.href = href;

                var urlSplit = url.pathname.split('/');
                var lastSplitElm = urlSplit[urlSplit.length - 1];
                var prevSplitElm = urlSplit[urlSplit.length - 2];

                // compare urls from settings with browser url
                var flagOne = !prevUrlEtlSplitElm.toLowerCase()
                                    .localeCompare(prevSplitElm.toLowerCase());
                var flagTwo = false;

                // conditions for hostname, category level, all files
                if (lastSplitElm === lastUrlEtlSplitElm) {
                    flagTwo = true;
                } else if (lastSplitElm.indexOf('.') === -1 
                            && lastUrlEtlSplitElm.test('.') === -1) {
                    flagTwo = true;
                } else {
                    flagTwo = false;
                }
                
                return flagOne && flagTwo;
            }).filter(function(elm) {
                return elm;
            }).join();
        }      

        return flagRootURL ? flagRootURL : arrUrlsPath();
    };

    // return element from settings 
    var getElm = function (selector) {
        return selector.indexOf(':') !== -1
                ? document.querySelectorAll(selector.split(':')[0])[selector.split(':')[1]]
                : document.querySelector(selector);
    };

    // return Yandex counter from settings
    var getCounter = function(host, options) {
        return options.counters[host];
    };

    // insert HTML to browser
    var insertHtml = function (options) {//insertElement, html, wrapperClass
        var host = location.host;

        // get element for inserting
        var insertElement = getElm(options.insertElement);

        // create wrapper for counting with Yandex
        var div = document.createElement('div');
        var divWrap = document.createElement('div');
        div.innerHTML = options.html;
        div.firstElementChild.setAttribute('data-id', options.insertElement);
        div.firstElementChild.setAttribute('data-position', options.insertPosition);
        
        // marker selectors for Yandex counters
        var dataCounter = div.querySelectorAll('[data-counter]');

        // conditions of existence Yandex counters
        if (dataCounter.length > 0 && insertElement) {
            // create wrapper elements: <span> for clickable items
            for (var i = dataCounter.length - 1; i >= 0 ; --i) {
                var elm = dataCounter[i];
                var elmCopy = elm.cloneNode(true);

                var data = elm.dataset.counter;
                var idYandexCounter = getCounter(host, options);
                var yandexCounter = 'yaCounter' + idYandexCounter;
                var spanString = '<span class="' + options.wrapperClass +  '" onclick="' 
                                    + yandexCounter + 
                                    '.reachGoal(' + "'" + data + "'" + '); return true;">';

                divWrap.innerHTML = spanString;
                divWrap.firstElementChild.appendChild(elmCopy);

                elm.insertAdjacentHTML('afterend', divWrap.innerHTML);
                elm.remove();
            }
            insertElement.insertAdjacentHTML(options.insertPosition, div.innerHTML);
        } else if(insertElement) {
            insertElement.insertAdjacentHTML(options.insertPosition, options.html);
        } else {
            console.error('Value of insert: ' + options.insertElement + '. Check this value!');
        }
    };

    // insert <style> element to browser with styles
    var insertCss = function(options) { // css, marker
        var style = document.createElement('style');
        var scopeMarker = document.querySelectorAll('[data-scope]');
        var css = options.css;
        var marker = options.insertElement;
        var flag = true;

        // checking for duplicate style tags
        if (scopeMarker.length) {
            for (var i = 0; i < scopeMarker.length; i++) {
                var elm = scopeMarker[i];
                elm.dataset.scope === marker ? flag = false : flag = true;
            }
        }

        style.dataset.scope = marker;
        style.innerText = css;
        flag ? document.head.append(style) : true;
    };

    // the time of advertising end 
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

    /**Public method */
    // start plugin
    w.adRock.prototype.start = function() {
        var flagTimer = timer(this.options.datePoint);
        var flagUrl = !!checkUrl(this.options.urls);
        var flagElement = !!getElm(this.options.insertElement);
        var flagExceptUrl = checkExceptUrl(this.options.exceptUrl);
        var flagCheckKeywords = checkKeywords(this.options.keyMatching);

        var generalFlag = flagTimer && flagUrl && flagElement 
        && flagExceptUrl && flagCheckKeywords;

        if (generalFlag) {
            // add async
            setTimeout(function() {
                // insert CSS
                insertCss(this.options);
                // insert HTML
                insertHtml(this.options);
              }.bind(this), 0);
        }

        return generalFlag;
    };

    // stop instance
    w.adRock.prototype.stop = function(...arg) {
        var elm = getElm(this.options.insertElement);
        var marker = this.options.insertElement;
        var position = arg.length > 0 ? arg[0] : undefined;
 
        if (elm) {
            window.addEventListener('load', function() {
                var css = document.querySelectorAll('[data-scope]');
                var elmsId = document.querySelectorAll('[data-id]');
                var filterElms = function(elmsId, marker, position) {
                    return [].filter.call(elmsId, function(elm) {
                        return elm.dataset.id 
                            === marker && elm.dataset.position === position;
                    });
                }; 
   
                // remove css
                for (var i = 1; i < css.length; i++) {
                    var elmt = css[i];
                    if (elmt.dataset.scope === marker) {
                        elmt.remove();  
                    }
                }

                // remove html
                switch(position) {
                    case 'afterbegin': 
                        var ab = filterElms(elmsId, marker, 'afterbegin');
                        for (var i = 1; i < ab.length; i++) {
                            ab[i].remove();
                        }
                        break;
                    case 'afterend':
                        var ab = filterElms(elmsId, marker, 'afterend');
                        for (var i = 1; i < ab.length; i++) {
                            ab[i].remove();
                        }
                        break;
                    case 'beforebegin':
                        var ab = filterElms(elmsId, marker, 'beforebegin');
                        for (var i = ab.length - 2; i >= 0; --i) {
                            ab[i].remove();
                        }
                        break;
                    case 'beforeend': 
                        var ab = filterElms(elmsId, marker, 'beforeend');
                        for (var i = ab.length - 2; i >= 0; --i) {
                            ab[i].remove();
                        }
                        break;
                }
            });
        }
    };
} (window));