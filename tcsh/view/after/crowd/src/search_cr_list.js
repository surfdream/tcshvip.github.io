define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('jquery'),
        crowd_type = require('crowd_type'),
        crowd_data = require('crowd_data'),
        page = require('wmpage');

    var init = function () {
        var $sel_type = $(".sel_type")
        var _page = page.Create({
            url: global_setting.PageInfo.url || domains.sell + '/product/list',
            element: ".wm_page",
            index: global_setting.PageInfo.Index,
            sum: global_setting.PageInfo.TotalItems,
            size: global_setting.PageInfo.Size,
            front: true,
            pagekey: global_setting.PageInfo.pageKey,
            param: global_setting.PageInfo.WhereDic
        });
        //crowd_type.getData({
        //    success: function (data) {
        //        var _html = [];
        //        if (data.response) {
        //            for (var i in data.response.data) {
        //                _html.push('<optgroup value="' + data.response.data[i].id + '" label="' + data.response.data[i].categoryName + '">');
        //                for (var j in data.response.data[i].childs) {
        //                    _html.push('<option vlaue="' + data.response.data[i].childs[j].id + '">' + data.response.data[i].childs[j].categoryName + '</option>');
        //                }
        //                _html.push('</optgroup>');
        //            }
        //            $sel_type.append(_html.join(''));
        //        }
        //    }
        //});

        bind();

    };
    var bind = function () {
        var $page = $("#page");
        $page.on("click", ".add_cr", function () {
            var $this = $(this), $tr = $this.closest("tr");
            crowd_data.join({
                communeId: $tr.attr("data_commune_id"),
                success: function (data) {
                    if (data.response.data) {
                        alert("加入成功！");
                        $this.remove();
                    } else {
                        alert("您已加入该公社，请不要重复加入！");
                    }
                },
                error: function () {
                    alert("系统繁忙！");
                }
            });
            return false;
        });
    };
    init();
});
