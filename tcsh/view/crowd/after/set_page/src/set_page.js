define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge";
    var domains = require('domains');
    var $ = require("jquery"),
		box = require("wmbox"),
		juicer = require("juicer"),
		lib = require("lib")
    ;

    var init = function () {

        bind();
    };
    var bind = function () {
        var $page = $("#page"), $body = $("body");
        ;
        $page.on("click", ".go_page", function () {
            var $this = $(this), _url = $this.attr("data_url");
            _url += (~_url.indexOf("?") ? "&" : "?") + $.param({
                edit_comm: '1',
                r: parseInt(Math.random() * 99999) + 10000
            });
            $body.addClass("ovh");
            box.invBox({
                boxCls: "page_box",
                content: '<a href="#" class="close_ico close_80_80_1 close" style="top: 15px;right: 25px;position: absolute;"></a>',
                btns: [],
                callback: function () {
                    this.setCon('<a href="#" class="close_ico close_80_80_1 close" style="top: 15px;right: 25px;position: absolute;"></a><iframe src="' + _url + '" style="width:100%;height:' + this.wmBox.outerHeight() + 'px"></iframe>');
                }
            });

            return false;
        });
        $page.on("click", ".noboxmsg", function () {
            alert('更多页面，敬请期待！');
            return false;
        });

    };
    init();
});