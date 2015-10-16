define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge";
    var domains = require('domains');
    var $ = require("jquery"),
		box = require("wmbox"),
		juicer = require("juicer"),
		lib = require("lib"),
        friend = require("friend")
    ;

    var init = function () {

        bind();
    };
    var bind = function () {
        var $page = $("#page"),
            $all_chk = $page.find(".all_chk"),
            $black_list = $page.find(".black_list");


        //选择
        $page.on("click", ".black_item", function () {
            $(this).toggleClass("curr");
            if ($page.find(".black_item").length === $page.find(".black_item.curr").length) {
                $all_chk.addClass("curr");
            } else {
                $all_chk.removeClass("curr");
            }
            return false;
        });
        //全选
        $page.on("click", ".all_chk", function () {
            var $this = $(this);
            $this.toggleClass("curr");

            if ($this.hasClass("curr")) {
                $page.find(".black_item").addClass("curr");
            } else {
                $page.find(".black_item").removeClass("curr");
            }
            return false;
        });
        //移出黑名单
        $page.on("click", ".remove_blacklist", function () {
            var $remove_list = $black_list.find(".curr"),
                ids = [];
            $remove_list.each(function () {
                ids.push($(this).attr("data_id"));
            });
            $.ajax({
                url: domains.commune + "/commune/remove/blacklist.json",
                data: {
                    communeId: global_setting.communeId,
                    userIds: ids.join(',')
                },
                dataType: "json",
                success: function (data) {
                    if (data.success) {
                        $remove_list.fadeOut(function () {
                            $remove_list.remove();
                        });
                    } else {
                        alert(data.error || "系统繁忙！");
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