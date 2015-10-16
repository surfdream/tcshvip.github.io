define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        page = require("wmpage")
    ;
    var init = function () {
        var _page = page.Create({
            url: global_setting.current.page.url || domains.member+"/collect/markets",
            index: (global_setting.current.page.pageindex) || 1,
            size: (global_setting.current.page.pagesize) || 10,
            sum: (global_setting.current.page.totalcount) || 0,
            pagekey: "pageindex",
            front: true
        });
        bind();
    };
    var bind = function () {

    };
    init();
});
