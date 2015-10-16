define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        lib = require("lib"),
        lazyload = require("wmlazyload"),
         wmas = require("wmas"),
        forImg = require("wmforimg");
    var init = function () {
        var $page = $("#page");
        wmas.init({
            callback: [
                {
                    key: "adv_540_254",
                    fun: function () {
                        var $img = this.find(".chuju_infor_logo img[src='']");
                        $img.attr("src", 'http://s.tcsh.me/tcsh/view/ago/wmchuju/img/logo1.jpg');
                        $img.each(function () {
                            $(this).closest(".chuju_infor").find(".discount").empty().append('<span style="color: #cc0b0b;font-size: 20px;font-weight: 700;">折扣数据</span>');
                        });
                    }
                }
            ],
            otherData: "logo,discount"
        });

        bind();
    };
    var bind = function () {
		var $page = $("#page"),
			$search_form = $page.find(".search_form")
		;
		$page.on("click", ".search_type_item", function () {
            var $this = $(this).closest("li");
            $this.closest("ul").prepend($this);
            $search_form.attr("action", $this.attr("data_action"));
            $search_txt.focus();
            return false;
        });
        $page.find(".search_type").hover(function () {
            $search_form.addClass("showsearch_type")
        }, function () {
            $search_form.removeClass("showsearch_type")
        });
		$page.on("click", ".search_form .submit", function () {
            var $txt = $page.find(".search_txt"), _v = $.trim($txt.val());
            if (!_v) {
                $txt.focus();
                return false;
            }

        });
    };
    init();
});