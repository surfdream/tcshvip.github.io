define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; 
    var domains = require('domains');
    var $ = require("zepto"),
        lazyload = require("wmlazyload");
    var init = function () {
        lazyload.init();

        bind();
    };
    var bind = function () { };
    init();
   
});
