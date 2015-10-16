define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        verification = require("wmverification");
    var init = function () {
        var $page = $(".get_password");
        verification.init($page);
        bind();
    };
    var bind = function () { };
    init();
});
