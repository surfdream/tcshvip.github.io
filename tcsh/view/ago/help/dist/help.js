define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        lib = require("lib"),
        top_data = require("top_data");
    var $body = $("body");
    var init = function () {
        top_data();
        bind();
    };
    var bind = function () {
        var $page = $("#page");
        $page.on("click", ".nav_item", function () {
            var $this = $(this);
            if ($this.hasClass("show_item")) {
                $this.removeClass("show_item");
            } else {
                $this.addClass("show_item");
            }
            return false
        });
        $page.on("click", ".nav_item a", function (e) {
            e.stopPropagation();
        });
        $page.on("click", ".add_favorite", function () {
            lib.addFavorite(window.location.href, "»¥¶¯¹ºÎï");
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
    };
    init();
});
