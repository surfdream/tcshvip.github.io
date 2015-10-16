define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery");
    var init = function () {

        bind();
    };
    var bind = function () {
        var $page = $("#page");
        $page.on("click", ".tab_item", function () {
            var $this = $(this);
            $this.closest(".user_commodity_box").attr("class", "user_commodity_box " + $this.attr("data_tab_key"));
            return false;
        });
    };
    init();
});
