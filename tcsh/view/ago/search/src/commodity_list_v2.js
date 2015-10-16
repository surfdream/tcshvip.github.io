define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('jquery'),
        lib = require('lib'),
        lazyload = require("wmlazyload");
    require('top_data')();
    var init = function () {
        var $page = $("#page"),
            $body = $("body");
        lazyload.init();
        bind();
        switch (lib.queryString("q")) {
            case "旋转":
                $body.addClass("body_rotation");
                break;
            case "抖动":
                $body.addClass("body_shake");
                break;
            case "跳跃":
                $body.addClass("body_jump");
                break;
            case "翻转":
                $body.addClass("body_turn");
                break;
        }
    };
    var bind = function () {
        var $page = $("#page"),
            body = $("body")[0],
            $fixed_box = $page.find(".fixed_box"),
            $win = $(window);
        $page.on("focus", ".txt_search", function () {
            var $this = $(this);
            $this.closest(".crumb_search").css({ "background-position": "0 -30px" });
        });
        $page.on("blur", ".txt_search", function () {
            var $this = $(this);
            $this.closest(".crumb_search").css({ "background-position": "0 0" });
        });
        $page.on("change", ".txt_search", function () {
            var $this = $(this), _v = $this.val();
            $page.find(".txt_search").val(_v);
        });
        $page.on("click", ".more_btn", function () {
            var $this = $(this), $condition_list = $this.closest(".condition_list");
            if ($condition_list.hasClass("show_all")) {
                $condition_list.removeClass("show_all");
                $this.find(".wm_ico").attr("class", "wm_ico arrow17up");
                $this.find(".ui_btn_txt span").empty().append('更多');
            } else {
                $condition_list.addClass("show_all");
                $this.find(".wm_ico").attr("class", "wm_ico arrow17down");
                $this.find(".ui_btn_txt span").empty().append('收起');
            }
            return false;
        });
        $page.on("click", ".to_shop", function () {
            var $this = $(this), $form = $this.closest("form");
            if ($.trim($form.find(".search_txt").val())) {
                $form.attr("action", $this.attr("href"));
                $form.submit();
            }
            return false;
        });
        $page.on("click", ".to_commodity", function () {
            var $this = $(this), $form = $this.closest("form");
            if ($.trim($form.find(".search_txt").val())) {
                $form.attr("action", $this.attr("href"));
                $form.submit();
            }
            return false;
        });
        $page.find(".search_txt,.txt_search").on("keydown", function (e) {
            if (!$(this).val() && e.keyCode === 13) {
                return false;
            }
        });
        $page.find(":submit").on("click", function () {
            var $form = $(this).closest("form");
            if (!$form.find("[name='q']").val()) {
                return false;
            }
        });
        if ($.browser.msie && $.browser.version === "6.0") {
            $page.find(".commodity_item").hover(function () {
                $(this).addClass("commodity_item_hover");
            }, function () {
                $(this).removeClass("commodity_item_hover");
            });
        } else {
            //IE6不提供此效果（放弃IE6吧）
            $win.on("scroll.showTopFixed", function () {
                var scrollTop = body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0;
                if (scrollTop <= 480) {
                    $fixed_box.css({ "display": "none" });
                } else {
                    $fixed_box.css({ "display": "block" });
                }

            });
        }
    };
    init();
});
