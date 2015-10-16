define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        page = require('wmpage');
    var init = function () {
        var _page = page.Create({
            url: global_setting.PageInfo.url,
            element: ".wm_page",
            index: global_setting.PageInfo.Index,
            sum: global_setting.PageInfo.TotalItems,
            size: global_setting.PageInfo.Size,
            front: true,
            pagekey: global_setting.PageInfo.pageKey
        });
        bind();
    };
    var bind = function () {

    };
    init();
});
