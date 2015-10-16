/*
懒加载
*/
define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('http://s.tcsh.me/tcsh/model/domains/dist/domains.js');
    var $ = require('http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js');
    var $win = $(window);
    var lazyload = function (op) {
        var _op = $.extend({
            lazyloadEle: ".lazyload",
            lazyloadAttrKey: "lazyload_url"
        }, op);
        
        var body = $("body").get(0);
        var $lazyloadItem = $(_op.lazyloadEle);
        $lazyloadItem.each(function () {
            $(this).attr("lazyload", "t");
        });
        var _show = function () {
            var scrollTop = body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0;
            this.each(function () {
                var $this = $(this), _top = parseFloat($this.offset().top);
                if (_top <= scrollTop + $win.outerHeight()) {
                    $this.attr("src", $this.attr(_op.lazyloadAttrKey));
                    $this.removeAttr("lazyload");
                } else {
                    $this.data("top", _top);
                }
            });
        };
        $lazyloadItem = $(_op.lazyloadEle + "[lazyload]");
        _show.call($lazyloadItem);
        $win.on("scroll.lazyload", function () {
            _show.call($(_op.lazyloadEle + "[lazyload]"));
        });
    };

    var _coding = function (html_code, default_src) {
        var $html;
        if (typeof html_code === "string") {
            $html = $('<div>' + html_code + '</div>');
            $html.find("img").each(function () {
                var $this = $(this);
                $this.attr("lazyload_url", $this.attr("src"));
                $this.attr("src", (default_src || "http://s.tcsh.me/tcsh/view/public/img/pit.png"));
                $this.addClass("lazyload");
            });
            return $html.html();
        } else {
            throw "lazyload argument exception , not the string parameter !";
        }
    };
    var _decoding = function (html_code) {
        var $html;
        if (typeof html_code === "string") {
            $html = $('<div>' + $.trim(html_code) + '</div>');
            $html.find("img[lazyload_url]").each(function () {
                var $this = $(this);
                $this.attr("src", $this.attr("lazyload_url"));
            });
            return $html.html();
        } else {
            throw "lazyload argument exception , not the string parameter !";
        }
    };
    exports.init = function (op) {
        return new lazyload(op);
    };
    //将常规html编码成需要懒加载的格式
    exports.coding = function (html_code, default_src) {
        return _coding(html_code, default_src);
    };
    //将懒加载的html格式解码成常规html
    exports.decoding = function (html_code) {
        return _decoding(html_code);
    };
    exports.triggerLazyload = function () {
        $win.trigger("scroll.lazyload");
    };
});