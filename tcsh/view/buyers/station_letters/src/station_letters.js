define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        tips = require("wmtips"),
        page = require('wmpage');
    var init = function () {
        var _global_setting = global_setting;
        var _page = page.Create({
            url: (_global_setting.current.page.url || domains.i+"/letter/view"),
            index: (_global_setting.current.page.pageindex) || 1,
            size: (_global_setting.current.page.pagesize) || 10,
            sum: (_global_setting.current.page.totalcount) || 0,
            pagekey: "pageindex",
            front: true
        });
        bind();
    };
    var bind = function () {
        var $page = $("#page");
        $page.on("click", ".reply", function () {
            var $this = $(this), $ul = $this.closest("ul"), _replyId = $ul.attr("data_replyid") - 0;
            var callSystemTips;
            if (_replyId) {

            } else {
                callSystemTips = $this.data("callSystemTips");
                if (!callSystemTips) {
                    callSystemTips = new tips({
                        ele: $this,
                        con: '<p>=_= 系统哥哥很忙的哦</p><p>请不要回复它发送给你的消息哦~</p>',
                        close: 2000,
                        direction: 'rt',
                        offset: {
                            top: -5,
                            left: 10
                        }
                    });
                    $this.data("callSystemTips", callSystemTips);
                }
                callSystemTips.show();
            }
            return false;
        });
        $page.on("click", ".del", function () {
            var $this = $(this), $ul = $this.closest("ul"), _replyId = $ul.attr("data_replyid") - 0;
            var delSystemTips;
            if (_replyId) {

            } else {
                delSystemTips = $this.data("delSystemTips");
                if (!delSystemTips) {
                    delSystemTips = new tips({
                        ele: $this,
                        con: '<p>=_= 系统哥哥正在整理邮件呢</p><p>请先不要删除哦~</p>',
                        close: 2000,
                        direction: 'rt',
                        offset: {
                            top: -5,
                            left: 10
                        }
                    });
                    $this.data("delSystemTips", delSystemTips);
                }
                delSystemTips.show();
            }
            return false;
        });
        if ($.browser.msie && $.browser.version === "6.0") {
            $page.find(".table_list ul").hover(function () {
                $(this).addClass("ul_hover");
            }, function () {
                $(this).removeClass("ul_hover");
            });
        }
    };
    init();
});
