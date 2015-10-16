define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge";
    var domains = require('domains');
    var $ = require("jquery"),
        lazyload = require("wmlazyload"),
        page = require("wmpage"),
        juicer = require("juicer"),
        forimg = require("forimg");
    require('core-css');
    require('theme-css');
    require('datepicker-css');
    require('jquery.ui.core')($);
    require('jquery.ui.widget')($);
    require('jquery.ui.datepicker')($);
    require('datepicker-zh-CN')($);
    var init = function () {
        lazyload.init();
        var _promotion_html = juicer([
            '{@each data as item}',
            '<li class="for_img_item">',
                '<a href="http://item.tcsh.me/${item.product_id}.html" target="_blank" title="${item.product_name}"><img src="${item.product_img_default}" /><span class="promotion_name">${item.product_name}</span></a>',
            '</li>',
            '{@/each}'
        ].join(''));
        $(".gifts_item").each(function () {
            var $this = $(this), _id = $this.attr("data_id");
            $.ajax({
                url: domains.member + "/asyn/present/promotion.json",
                data: {
                    present_id: _id || "13"
                },
                dataType: "jsonp",
                success: function (data) {
                    if (data.response.data) {
                        $this.find(".wm_forimg_list").empty().append(_promotion_html.render(data.response));
                        if ($this.find(".for_img_item").length > 6) {
                            new forimg.Slide({
                                forImgBoxEle: $this.find(".promotion_box"),
                                callback: function () {
                                    this.automatic(true);
                                }
                            });
                        }
                    }
                },
                error: function () {

                }
            });
        });
        if (global_setting && global_setting.PageInfo && global_setting.PageInfo.totalcount) {
            var _page = page.Create({
                url: domains.sell + '/order/list?' + $(".seleft_box .wm_form").serialize(),
                element: ".wm_page",
                size: global_setting.PageInfo.pagesize,
                index: global_setting.PageInfo.pageindex,
                sum: global_setting.PageInfo.totalcount,
                pagekey: global_setting.PageInfo.pagekey,
                front: true
            });
        };
        bind();
    };
    var bind = function () {
        var $page = $("#page");

        $page.find(".show_date_box").datepicker();

        $page.on("click", ".del", function () {
            var $this = $(this), $gifts_item = $this.closest(".gifts_item");
            if (confirm("确定删除获赠记录吗？")) {
                $gifts_item.fadeOut(function () {
                    $gifts_item.remove();
                });
            }
            return false;
        });
    };
    init();
});
