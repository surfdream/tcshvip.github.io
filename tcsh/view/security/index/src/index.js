define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery");
    var init = function () {
        bind();
    };
    var bind = function () {
        var $page = $("#page");
        $page.on("click", ".tab_key", function () {
            var $this = $(this);
            $this.closest(".indextab_box").attr("class", "box indextab_box " + $this.attr("data_tab_key"))
                .find(".curr").removeClass("curr")
                .find(".tab_key").attr("class", "tab_key");
            $this.attr("class", "ui_btn ui_btn_h29red11 tab_key").closest("li").addClass("curr");
            return false
        });
    };
    init();
});
