define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        page = require("wmpage");
    var init = function () {
        if (global_setting.current.page.totalcount) {
            var _page = page.Create({
                url: (global_setting.current.page.url || domains.member+"/fund/records"),
                index: (global_setting.current.page.pageindex) || 1,
                size: (global_setting.current.page.pagesize) || 10,
                sum: (global_setting.current.page.totalcount) || 0,
                pagekey: global_setting.current.page.key || "pageindex",
                front: true,
                param: global_setting.current.page.param
            });
        }
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
