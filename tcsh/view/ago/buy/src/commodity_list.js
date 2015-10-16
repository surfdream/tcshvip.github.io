define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('jquery');
    var init = function () {
        bind();
    };
    var bind = function () {
        var $page = $("#page"),
            $brands_link = $page.find(".brands_link"),
            _brands_link_itemH = $brands_link.find("li:eq(0)").outerHeight(),
            _brands_linkH = _brands_link_itemH * (parseInt($brands_link.find("li").length / 8) + 1);
        $brands_link.find(".more").toggle(function () {
            $brands_link.find(".link_list").stop(true, true).animate({ height: _brands_linkH });
        }, function () {
            $brands_link.find(".link_list").stop(true, true).animate({ height: _brands_link_itemH });
        });
        $page.find(".hide .more a").toggle(function () {
            var $this = $(this);
            $this.closest("dl").removeClass("hide");
        }, function () {
            var $this = $(this);
            $this.closest("dl").addClass("hide");
        });
    };
    init();
});
