define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        lib = require("lib"),
        box = require("wmbox"),
        verification = require("verification"),
        juicer = require("juicer"),
        inputdown = require("inputdown"),
        page = require("wmpage")
    ;
    var init = function () {
        
        if (global_setting && global_setting.PageInfo) {
            var _page = page.Create({
                url: global_setting.PageInfo.url,
                element: ".wm_page",
                index: global_setting.PageInfo.Index,
                sum: global_setting.PageInfo.TotalItems,
                size: global_setting.PageInfo.Size,
                front: true,
                param: global_setting.PageInfo.param,
                pagekey: global_setting.PageInfo.pageKey
            });
        }
        bind();
    };
    var bind = function () {
        
    };
    init();
});
