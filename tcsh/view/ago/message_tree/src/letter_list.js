define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
		page = require("wmpage")
    ;

    var init = function () {
        if (global_setting && global_setting.page && global_setting.page.totalcount) {
            var _page = page.Create({
                url: (global_setting.page.url || "http://s.tcsh.me/tcsh/view/buyers/message_tree/letter_list.html"),
                index: (global_setting.page.pageindex) || 1,
                size: (global_setting.page.pagesize) || 10,
                sum: (global_setting.page.totalcount) || 0,
                pagekey: "pageindex",
                front: true
            });
        }
        bind();
    }
    var bind = function () {

    }

    init();
})