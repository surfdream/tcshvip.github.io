define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        page = require("wmpage");
    require('core-css');
    require('theme-css');
    require('datepicker-css');
    require('jquery.ui.core')($);
    require('jquery.ui.widget')($);
    require('jquery.ui.datepicker')($);
    require('datepicker-zh-CN')($);


    var init = function () {
        var $state=$("#state");
        var _page = page.Create({
            url: global_setting.pageURL,
            element: ".wm_page",
            size: global_setting.pageSize,
            index: global_setting.pageIndex,
            sum: global_setting.totalcount,
            pagekey: global_setting.pageKey,
            front: true
        });
        bind();
        $(".status_item[state_val='" + $state.val() + "']").addClass("chked");
    };
    var bind = function () {
        var $page = $("#page");
        $page.find(".submit_sdate,.submit_edate").datepicker({
            onClose: function (data, e) { if (!(/\d{4}-\d{2}-\d{2}/.test(data))) { e.input.val(''); } }
        });
        $page.on("click", ".status_item", function () {
            var $this = $(this), _v = $this.attr("state_val");
            $page.find("#state").val(_v);
            $this.closest("form").submit();
            return false;
        });
    };
    init();
});
