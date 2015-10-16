define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('jquery'),
        verification = require('wmverification');
       
    var init = function () {
        verification.init();
        bind();
    };
    var bind = function () {
        var $page = $("#page");
        $page.on("click", ":submit", function () {
            return verification.verify($(this).closest("form"));
            
        });
    };
    init();
});
