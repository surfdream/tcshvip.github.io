define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        verification = require("verification");

    var init = function () {
        var $page = $("#page");
        verification.init($page);
        bind();
    };
    var bind = function () {
        var $page = $("#page");
        
        $page.on("click", ":submit", function () {
            var $this = $(this), $form = $this.closest("form");
            return verification.verify($form);
        });
    };
    init();
});
