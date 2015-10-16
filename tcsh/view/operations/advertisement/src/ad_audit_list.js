define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
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
            url: global_setting.pageURL,
            element: ".wm_page",
            size: global_setting.pageSize,
            index: global_setting.pageIndex,
            sum: global_setting.totalcount,
            pagekey: global_setting.pageKey,
            param: global_setting.param,
            front: true
        });
        bind();

    };
    var bind = function () {
        var isInit = true;
        var $page = $("#page"), $location = $page.find(".sel_location");
        $page.find(".show_sdate,.show_edate,.submit_sdate,.submit_edate").datepicker({
            onClose: function (data, e) { if (!(/\d{4}-\d{2}-\d{2}/.test(data))) { e.input.val(''); } }
        });
        $page.find(".sel_channel").on("change", function () {
            var $this = $(this);
            _url = $this.find("option:selected").attr("page_url");
            _data = global_setting.urlList[_url].data,
            _arr = [
                    '<option value="0">-全部-</option>'
            ];
            for (var i in _data) {
                _arr.push('<option value="' + _data[i].id + '">' + _data[i].adName + '</option>')
            }
            $location.empty().append(_arr.join(''));
            isInit && global_setting && global_setting.param && global_setting.param.locationName && $location.val(global_setting.param.locationName);
            isInit = false;
        });
        $page.find(".sel_channel").change();

    };
    init();
});
