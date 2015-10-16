define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('jquery'),
    wmds = require('http://s.tcsh.me/tcsh/model/wmds/dist/wmds.js');
    var init = function () {
        bind();
    };
    var bind = function () {
        var $body = $("body"), $nb2 = $body.find(".notice_box");
        $body.on("click", function () {
            var $append = $('<div class="notice_box"><div class="notice_main"><div class="notice_main_left"><i class="wm_ico sigh2"></i></div><div class="notice_main_right"><span class="notice_title" title="亲爱的：柴逸宁小朋友">亲爱的：柴逸宁小朋友</span><p>您已经在同城生活漫游1小时了，获得<b>100</b>积分！</p></div></div><a href="#" class="wm_ico fork4 close_notice" title="关闭"></a></div>');
            $append.css({
                "bottom": $body.find(".notice_box").length * 110+15
            });
            $body.append($append);
            $append.fadeIn();
            return false;
        });
        $body.on("click", ".notice_box .close_notice", function () {
            $(this).closest(".notice_box").fadeOut(function () {
                $(this).remove();
                $body.find(".notice_box").each(function (i) {
                    $(this).animate({
                        "bottom": i * 110 + 15
                    })
                });
            });
            return false;
        });


    };
    init();

});
