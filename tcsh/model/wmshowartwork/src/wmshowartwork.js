/*
显示原图
*/
define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('http://s.tcsh.me/tcsh/model/domains/dist/domains.js');
    require('../css/style.css#');
    var $ = require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js"),
    juicer = require("http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js"),
    lib = require("http://s.tcsh.me/tcsh/model/lib/dist/lib.js"),
    box = require('http://s.tcsh.me/tcsh/model/wmbox/dist/wmbox.js');
    require('http://s.tcsh.me/tcsh/view/public/css/ico.css#');
    var _windowRest = function () {
        $(window).on("resize.wmshowartwork", function () {
            var $window = $(window),
                $artwork_box = $(".artwork_box:visible"),
                $img = $artwork_box.find("img"),
             _windowW = $window.width(),
             _windowH = $window.height(),
             _boxW = _windowH * 0.8 + 300,
             _boxH = _windowH * 0.8;
            $artwork_box.css({
                "margin-top": -_boxH / 2,
                "margin-left": -_boxW / 2
            });
            $artwork_box.find(".artwork_con").css({
                "width": _boxW,
                "height": _boxH
            });
            _w = $img.width();
            _h = $img.height();
            _max = Math.max(_w, _h);
            if (_max === _w) {
                $img.css({
                    "width": _boxW,
                    "height": _boxW / _w * _h,
                    "margin-top": (_boxH / 2) - (_boxW / _w * _h) / 2,
                    "visibility": "visible"
                });
            }
            if (_max === _h) {
                $img.css({
                    "width": _boxH / _h * _w,
                    "height": _boxH,
                    "margin-top": (_boxH / 2) - _boxH / 2,
                    "visibility": "visible"
                });

            }
            if ($.browser.msie && $.browser.version === "6.0") {
                $(window).scroll();
            }
        });
    };
    _windowRest();
    var showartwork = function (op) {
        var $window = $(window),
            artworkBox,
             _windowW = $window.width(),
             _windowH = $window.height(),
             _boxW,
             _boxH,
             _w,
             _h,
             _max,
             _op;
        if (typeof op === "string") {
            _op = {
                src: op,
                width: _windowH * 0.8 + 300,
                height: _windowH * 0.8,
                callback: null
            }
        } else {
            _op = $.extend({
                src: "http://s.tcsh.me/tcsh/view/public/img/img404_1.png",
                width: _windowH * 0.8 + 300,
                height: _windowH * 0.8,
                callback: null
            }, op);
        }

        _boxW = _op.width;
        _boxH = _op.height;
        var $invBoxCon = $('<div class="artwork_con"><img src="' + (typeof _op.src === "string" ? _op.src : _op.src[0]) + '" style="visibility: hidden;"/><a href="#" class="close_ico close_80_80_1 close_btn"></a></div>'),
        $img = $invBoxCon.find("img");
        $invBoxCon.css({
            width: _boxW,
            height: _boxH
        });
        artworkBox =  box.invBox({
            boxCls: "artwork_box",
            content: $invBoxCon,
            callback: function () {
                var self = this;
                this.wmBox.on("click", ".close_btn", function () {
                    self.hide();
                    return false;
                });
            }
        });
        lib.geometricZoom({
            $img: $img,
            boxW: _boxW,
            boxH: _boxH
        });
        return artworkBox;
    };
    exports.create = function (op) {  
        return showartwork(op);
    };
});
