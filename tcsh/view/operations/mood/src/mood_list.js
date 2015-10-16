define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js"),
        page = require('wmpage');
    require('core-css');
    require('theme-css');
    require('datepicker-css');
    require('jquery.ui.core')($);
    require('jquery.ui.widget')($);
    require('jquery.ui.datepicker')($);
    require('datepicker-zh-CN')($);
    var init = function () {
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
        bind();
    };
    var bind = function () {
        $(".send_date").datepicker({
            onClose: function (data, e) {
                var _data;
                if (!(/\d{4}-\d{2}-\d{2}/.test(data))) {
                    e.input.val('');
                }
            },
            changeYear: true,
            changeMonth: true,
            maxDate: new Date(),
            yearRange: "1790:" + new Date().getFullYear()
        });
    };
    init()
});
