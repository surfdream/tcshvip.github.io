define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge";
    var domains = require('domains');
    var $ = require('jquery'),
        page = require('wmpage'),
        lib = require('lib');

    var init = function () {
        var _page1 = page.Create({
            element: '.wm_page',
            url: domains.operator + "/seller/list",
            index: global_setting.current.page.pageindex,
            pagekey: global_setting.current.page.pagekey || "page",
            size: global_setting.current.page.pagesize,
            sum: global_setting.current.page.totalcount,
            param: global_setting.current.page.param,
            across: true,
            front: true
        });
        bind();
    };
    var bind = function () {
        var $page = $("#page");


    };
    init();
});
