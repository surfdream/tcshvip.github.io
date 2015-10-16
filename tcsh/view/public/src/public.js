define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge";
    var domains = require('http://s.tcsh.me/tcsh/model/domains/dist/domains.js');
    var $ = require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js"),
        lib = require('http://s.tcsh.me/tcsh/model/lib/dist/lib.js');
    require('http://s.tcsh.me/tcsh/model/wmprt/dist/wmprt.js');
    var isIE6 = $.browser.msie && $.browser.version === "6.0";
    var $win = $(window), $body = $("body"), body = $body.get(0);
    var initFixed = function (key) {
        var $go_top, _windowH;
        if (isIE6) {
            _windowH = $win.height();
            $go_top = $body.find(".go_top");
            $go_top.length && $win.on("scroll.fixed" + (key || Math.random() * 9999), function () {
                var $this = $(this), t = Math.random() * 99999;
                $this.data("fixed_t", t);
                (function (t) {
                    setTimeout(function () {
                        if (t == $this.data("fixed_t")) {
                            var scrollTop = body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0;
                            $go_top.animate({ "top": scrollTop + 600 });
                        }
                    }, 500)
                })(t);
            });
        }
    };
    var init = function () {
        $body.append('<a href="#" class="go_top" title="回到顶部" style="display: none;"></a>');
        initFixed("go_top");
        bind();
        try {
            //站长统计
            var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");
            $body.append("<span id='cnzz_stat_icon_1252994918'></span>");
            var s = document.createElement('script');
            s.type = 'text/javascript';
            s.async = true;
            //s.src = cnzz_protocol + "s22.cnzz.com/z_stat.php?id=1252994918";
            var x = document.getElementsByTagName('script')[0];
            x.parentNode.insertBefore(s, x);
        }
        catch (e) { }
    };
    var bind = function () {
        var $bodyhtml = $("body,html"), $go_top = $body.find(".go_top");
        $win.on("scroll.showGoTop", function () {
            var scrollTop = body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0;
            if (scrollTop >= 1500) {
                $go_top.fadeIn(500);
            }
            if (scrollTop <= 500) {
                $go_top.fadeOut(300);
            }
        });
        $body.on("click", ".go_top", function () {
            $bodyhtml.animate({ scrollTop: 0 });
            return false;
        });

        $body.on("click", "", function () {

        });
    };
    init();
});
